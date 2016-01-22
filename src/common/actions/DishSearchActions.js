import buildMessage from '../buildMessage';

import {
  // DishSearch actions
  DS_FETCH_FAILED,
  DS_FETCHED,
  DS_SEARCHED,
  DS_INPUT_CLEARED,
  DS_CLICKED,
  DS_REMOVED
} from '../constants/actions';

export const dishesFetchFailed = () => buildMessage(DS_FETCH_FAILED);
export const dishesFetched = (dishes, aliases) => buildMessage(DS_FETCHED, { dishes, aliases });

export const handleDishSearch = searchTerm => buildMessage(DS_SEARCHED, searchTerm);
export const handleDishClick = index => buildMessage(DS_CLICKED, index);
export const dishSearchCleared = () => buildMessage(DS_INPUT_CLEARED);

export const removeDishSelection = index => buildMessage(DS_REMOVED, index);
