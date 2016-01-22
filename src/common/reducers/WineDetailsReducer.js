/**
 * Reducer for the wine recommendations functions
 */

import { fromJS } from 'immutable';

import buildMessage from '../buildMessage';

import { API_FETCH_WINES, ROUTER_CHANGE_URL, ROUTER_GO_BACK } from '../constants/effects';

export const fetchTopWines = (reduction, dishes) => {
  const dishWineIds = dishes.reduce((dishesReduction, value) => {
    return `${dishesReduction},${value.get('wine')}`;
  }, '').substring(1);

  return reduction
    .set('effects', reduction
      .get('effects')
      .push(buildMessage(API_FETCH_WINES, dishWineIds))
    );
};

export const gotTopWines = (reduction, response) =>
  reduction
    .setIn(
      ['appState', 'wineDetails', 'wines'],
      fromJS(response.body).map(wine =>
        wine.set('meanScore', Math.round(wine.get('scores').reduce(
          (sum, value) => sum + value, 0
        ) / wine.get('scores').size))
      )
    )
    .update('effects', effects => effects.push(buildMessage(ROUTER_CHANGE_URL, 'WineDetails')));

export const viewOtherWine = (reduction, index) =>
  reduction.setIn(['appState', 'wineDetails', 'currentWineIndex'], index);


export const showRateDialog = (reduction, rating) =>
  reduction
    .setIn(['appState', 'wineDetails', 'currentWineIndex'], 0)
    .setIn(['appState', 'wineDetails', 'rating'], rating)
    .update('effects', effects => effects.push(buildMessage(ROUTER_CHANGE_URL, 'RateWine')));


export const hideRateDialog = (reduction) =>
  reduction
    .setIn(['appState', 'wineDetails', 'rating'], null)
    .update('effects', effects => effects.push(buildMessage(ROUTER_GO_BACK)));

export const updateRating = (reduction, update) =>
  reduction.setIn(['appState', 'wineDetails', 'rating', update.key], update.value);
