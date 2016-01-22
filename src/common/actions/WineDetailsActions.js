import buildMessage from '../buildMessage';

import {
  // WineDetails actions
  WS_FETCH_REQUESTED,
  WS_FETCHED,
  WS_WINE_VIEW_CHANGED,
  WS_SHOW_RATING,
  WS_HIDE_RATING,
  WS_UPDATE_RATING
} from '../constants/actions';

export const fetchTopWines = dishes => buildMessage(WS_FETCH_REQUESTED, dishes);
export const gotTopWines = response => buildMessage(WS_FETCHED, response);

export const viewOtherWine = index => buildMessage(WS_WINE_VIEW_CHANGED, index);

export const showRateDialog = rating => buildMessage(WS_SHOW_RATING, rating);
export const hideRateDialog = () => buildMessage(WS_HIDE_RATING);
export const updateRating = update => buildMessage(WS_UPDATE_RATING, update);
