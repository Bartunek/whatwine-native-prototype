/**
 * Reducer for DishSearch functions
 */

import {
  LIMIT_DISHES_RESULTS,
  ERROR_TEXT_DISHES,
  CUISINE_TYPE_DISH,
  getCuisineFromItem
} from '../config/general';

import { List, Set, Map, fromJS } from 'immutable';
import { english as stopwords } from 'stopwords';
import LRU from 'lru-cache';

import buildMessage from '../buildMessage';

import {
  ERROR_HANDLER,
  API_FETCH_DISHES
} from '../constants/effects';

const REGEX = {
  PLACEHOLDER: /\[[a-zA-Z\- ]+\]/,
  PLACEHOLDERS: /\[[a-zA-Z\- ]+\]/g,
  PLACEHOLDERS_AND_WORDS: /(\[[a-z \-]+\])|([a-z]+)/g
};

const dishesForWordCache = new LRU(10); // Maximum 10 entries in the cache

// Dish names are templates that can (but don't have to) contain placeholders that are
// expanded using a dictionary of aliases. For example, a dish might be "[pasta] [tomato sauce]"
// where `pasta` is an alias for "pasta", spaghetti", "linguini" or "fettuccini",
// and `tomato sauce` is an alias for "with tomato sauce" or "alla amatriciana". In that case there are
// 8 possibles dishes: "pasta with tomato sauce", "pasta alla amatriciana", "spaghetti with tomato sauce", etc.

// Creates an full-text index for the dishes. The index is a map of `word -> List(dish)`.
// The tricky parts is that the index should include all words from every expanded version of the dish.
// So for the example "[pasta] [tomato sauce]" it will index "spaghetti", "linguini", "tomato", "sauce",
// "amatriciana", etc. so that all of them point to this dish (among others).
//
// We remember the `index` as well since we want each dish template to have a unique ID. In that way
// we can decide not to display all the expands of a given template. For example, if the user searches
// for "lasagna", we probably don't want to display every possibility for "[fish] [lasagna]" (including
// unlikely variants like "monkfish lasagna"). In the current implementation, we just display the first
// expansion so the user would just see "fish lasagna" and would see "monkfish lasagna" and the like
// only if they search for it explicitly.
const generateDishMap = (dishes, aliasMap) => {
  return dishes.reduce(
    (dishMap, dish, index) => {
      return dish.get('nameLowerCase')
      .match(REGEX.PLACEHOLDERS_AND_WORDS)
      .reduce(
        (words, word) => {
          if (word[0] === '[' && aliasMap.get(word.substr(1, word.length - 2))) {
            // For placeholders we get all the words from all the aliases
            return aliasMap.get(word.substr(1, word.length - 2))
              .reduce((aliases, alias) => aliases.union(alias.split(' ')), words);
          } else {
            return words.add(word);
          }
        },
        new Set()
      )
      .filter(word => stopwords.indexOf(word) === -1)
      .reduce(
        (current, word) => {
          const dishEntry = new Map({ dish, index });
          return current.set(word, current.has(word) ? current.get(word).push(dishEntry) : new List([dishEntry]));
        },
        dishMap
      );
    },
    new Map()
  );
};

// Here we expand all the possible combinations of aliases for all the placeholders in the
// dish name. We used to expand all possibilities and then filter them later by the words in the query,
// but this led to performance issues in some cases. For example, "[fish] [pasta] with [tomato sauce]"
// might have several thousand expansions, since both `fish` and `pasta` have a lot of aliases (and
// they are likely to have more and more as we grow the dish database.
//
// To address this, we use an optimization where we only expand the alias combinations that contain
// the word we are searching for. In the above example, if we search for "salmon", it will only expand
// two aliases for "fish": "salmon" and "wild salmon". This dramatically reduces the number of
// expansions and makes everything much faster, but at the cost of some additional code complexity.
const expandAliases = (dish, word, aliasMap) => {
  const placeholders = new List(dish.match(REGEX.PLACEHOLDERS));
  if (!placeholders.size) {
    // If there are no placeholders in this dish name, we return an array of an array of an empty string.
    // This causes there to be one expansion which is the dish name with no substitutions.
    return fromJS([['']]);
  }

  // Extract the text _apart_ from the placeholders so we can see if it contains the search word.
  // If so they we need to expand all the aliases since we know we will always match.
  // For example, if we are searching for "beef" then "beef with [pasta] in [tomato sauce]" is always
  // going to match no matter what we expand `pasta` and `tomato sauce` to.
  const noPlaceholders = placeholders.reduce((str, placeholder) => str.replace(placeholder, ''), dish);
  const alwaysMatch = noPlaceholders.split(' ').indexOf(word) !== -1;

  // `aliasesList` is a list of lists like `[["fish", "salmon", "seabass"], ["pasta, "spaghetti", "fettuccini"]]`.
  // It contains all the possible expands for each placeholder, in order.
  const aliasesList = placeholders
    .map(placeholder => placeholder.substr(1, placeholder.length - 2))
    .map(placeholder => aliasMap.get(placeholder));

  // These are the aliases that match the search word. So if the list were that in the previous comment,
  // and we are searching for "salmon", this variable would be set to `[["salmon"], []`.
  // Note however that if `alwaysMatch` is set (because the search word is found in the dish name outside
  // of the placeholders) then we don't filter anything so `matchingAliasesList` is the same as `aliasesList`.
  const matchingAliasesList = aliasesList.map(
    aliases => aliases.filter(alias => alwaysMatch || (alias.indexOf(word) !== -1))
  );

  // Loop over `matchingAliasesList` and, for each item that is not empty, create a new aliases list that
  // is made up of `aliasesList[0->N-1] + matchingAliasesList[N] + aliasesList[N+1->end]`. In essence we
  // are changing `aliasesList` so that the Nth item only contains the aliases that match the search word.
  // In this way we hugely constrain the number of expanded dish names that we have to deal with while still
  // ensuring that we include all of the ones that match the search word.
  //
  // The output of this function is a list of tuples. For the above example, the unoptimized version would be
  // `[["fish", "pasta"], ["fish", "spaghetti"], ["fish", "fettuccini"], ["salmon", "pasta"], ...]`.
  // For the optimized version, only the tuples with "salmon" as the first value would be used.
  return matchingAliasesList.reduce(
    (allMatchingAliases, matchingAliases, matchingIndex) => {
      if (matchingAliases.count() > 0) {
        const expandedAliases = (matchingIndex ? aliasesList.slice(0, matchingIndex) : fromJS([[]]))
          .concat(List.of(matchingAliases))
          .concat(aliasesList.slice(matchingIndex + 1))
          .filter(aliases => aliases.size)
          .reduce(
            (current, aliases) =>
              current ? current.flatMap(i1 => aliases.map(i2 => i1.concat(i2))) : aliases.map(alias => List.of(alias)),
            null
          );
        return allMatchingAliases.concat(expandedAliases);
      } else {
        return allMatchingAliases;
      }
    },
    new List()
  );
};

// Expands out all the possible aliases, then replaces the placeholders in the dish name with each permutation to
// create all the possible expanded dish names that contain the search word. We also include the dish ID
// (aka `dishIndex`) and the "rank" (which is the index of each alias in the alias list). This allows us afterwards
// to decide how many of the expansions to show and which to prioritize.
const expandDish = (dish, dishIndex, word, aliasMap) => {
  const aliasExpansions = expandAliases(dish.get('nameLowerCase'), word, aliasMap);
  return aliasExpansions.reduce(
    (current, expansion, rank) => {
      return current.push(new Map({
        dish: dish
          .set('nameLowerCase', expansion.reduce((str, aliasValue) => str.replace(REGEX.PLACEHOLDER, aliasValue), dish.get('nameLowerCase')))
          .set('name', expansion.reduce((str, aliasValue) => str.replace(REGEX.PLACEHOLDER, aliasValue), dish.get('name'))),
        index: dishIndex,
        rank: rank + 1
      }));
    },
    new List()
  );
};

export const fetchDishes = reduction =>
  reduction.set(
    'effects',
    reduction
      .get('effects')
      .push(buildMessage(API_FETCH_DISHES))
  );

export const dishesFetchFailed = reduction =>
  reduction
    .setIn(['appState', 'loaded', 'dishSearch'], true)
    .set('effects', reduction.get('effects').push(buildMessage(
      ERROR_HANDLER, ERROR_TEXT_DISHES
    )));

export const dishesFetched = (reduction, { dishes, aliases }) => {
  const aliasMap = aliases.reduce(
    (current, alias) => current.set(alias.get('name'), alias.get('alias')), new Map()
  );

  return reduction
    .setIn(['appState', 'loaded', 'dishSearch'], true)
    .setIn(['appState', 'dishSearch', 'aliasMap'], aliasMap)
    .setIn(
      ['appState', 'dishSearch', 'allDishes'],
      generateDishMap(
        dishes
        .filter(dish => dish.get('name'))
        .map(
          dish => dish
            .set('nameLowerCase', dish.get('name').toLowerCase())
            .set('dishKeywords', dish.get('keywords') ? dish.get('keywords').split(',') : [])
            .set('dishCuisine', getCuisineFromItem(dish.get('country'), CUISINE_TYPE_DISH))
            .set('type', dish.get('type') || '')
        ),
        aliasMap
      )
    );
};

export const handleDishSearch = (reduction, searchTerm) => {
  const term = searchTerm.toLowerCase();

  const currentCuisine = reduction.getIn(
    ['appState', 'dishSearch', 'restaurant', 'cuisine']
  );

  const dishMap = reduction.getIn(['appState', 'dishSearch', 'allDishes']);
  const aliasMap = reduction.getIn(['appState', 'dishSearch', 'aliasMap']);

  const searchResults = term.split(' ')
  .filter(word => word && stopwords.indexOf(word) === -1)
  // Start with words that are contained in less dishes since the slowest step is processing
  // the first word and getting all the dishes that contain it (including expanding placeholders).
  .sort((a, b) => {
    const resultsA = dishMap.get(a);
    if (!resultsA) {
      return 1;
    }
    const resultsB = dishMap.get(b);
    if (!resultsB) {
      return -1;
    }
    return resultsA - resultsB;
  })
  .reduce(
    (intersection, word) => {
      if (intersection.size) {
        return intersection.filter(dish => dish.get('dish').get('nameLowerCase').split(' ').indexOf(word) !== -1);
      }

      const dishesForWord = dishesForWordCache.get(word) ||
        ((dishMap.get(word) || []).reduce(
          (dishes, dish) => dishes.concat(expandDish(dish.get('dish'), dish.get('index'), word, aliasMap)), new List())
        );
      dishesForWordCache.set(word, dishesForWord);
      return dishesForWord;
    },
    new List()
  )
  // Now we can decide how many of each expansion to include in the search results. Right now, if multiple
  // candidates have the same dish ID (aka `index`), we only include the one with the lowest rank (i.e. the
  // first alias for a given placeholder). This means that if the user searches for "beef steak" they will only see
  // "grilled beef steak" and not "griddled beef steak" since "grilled" and "griddled" are aliases for the
  // same placeholder and "grilled" appears first.
  .reduce(
    (candidates, candidate) => {
      const dishIndex = candidate.get('index');
      const currentDishesForIndex = candidates.get(dishIndex);
      return candidates.set(dishIndex, currentDishesForIndex ? currentDishesForIndex.push(candidate) : List.of(candidate));
    }, new Map()
  )
  .map(dishes => dishes.sort((a, b) => a.get('rank') - b.get('rank')).take(1))
  // Convert the `Map` to a `List`
  .reduce((current, results) => current.concat(results.map(result => result.get('dish'))), new List())
  // First we prioritize the dishes that have the same cuisine as the restaurant we are in.
  // If this doesn't distinguish between the dishes then we prioritize the ones with the
  // shortest names.
  .sort((a, b) => {
    if (currentCuisine) {
      const sameCuisineA = a.get('dishCuisine') === currentCuisine;
      const sameCuisineB = b.get('dishCuisine') === currentCuisine;
      if (sameCuisineA && !sameCuisineB) {
        return -1;
      } else if (sameCuisineB && !sameCuisineA) {
        return 1;
      }
    }
    const wordsInA = (a.get('nameLowerCase').match(/ /g) || []).length;
    const wordsInB = (b.get('nameLowerCase').match(/ /g) || []).length;
    return wordsInA - wordsInB;
  });

  return reduction
    .setIn(['appState', 'dishSearch', 'searchTerm'], searchTerm)
    .setIn(
      ['appState', 'dishSearch', 'searchResults'],
      searchResults.take(LIMIT_DISHES_RESULTS)
    );
};

export const dishSearchCleared = reduction =>
  reduction
    .setIn(['appState', 'dishSearch', 'searchTerm'], null)
    .setIn(['appState', 'dishSearch', 'searchResults'], List.of());

export const handleDishClick = (reduction, index) => {
  const dish = reduction.getIn(['appState', 'dishSearch', 'searchResults', index]);
  const selectedDishes = reduction.getIn(['appState', 'dishSearch', 'selectedDishes']);
  const dishAddedAlready = selectedDishes.some(_dish => {
    return _dish.get('name') === dish.get('name');
  });

  const newSelectedDishes = dishAddedAlready ? selectedDishes : selectedDishes.push(dish);

  return reduction
    .setIn(['appState', 'dishSearch', 'selectedDishes'], newSelectedDishes)
    .setIn(['appState', 'dishSearch', 'searchTerm'], null)
    .setIn(['appState', 'dishSearch', 'searchResults'], List.of());
};

export const removeDishSelection = (reduction, index) =>
  reduction
    .setIn(
      ['appState', 'dishSearch', 'selectedDishes'],
      reduction.getIn(
        ['appState', 'dishSearch', 'selectedDishes']
      ).delete(index)
    );
