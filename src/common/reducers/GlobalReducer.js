import {
  // App actions
  APP_MOUNTING,
  APP_NOTIFICATION_ADDED,
  APP_NOTIFICATION_REMOVED,
  HNAV_BACK,
  APP_ROUTER_BOOTSTRAPPED,
  APP_ROUTER_ROUTE_CHANGED,

  // Authentication actions
  WHATWINE_AUTH_RECEIVED,
  USER_FB_STATUS_CHANGED,
  USER_FB_GET_LOGIN_STATUS,
  USER_FB_LOGIN_PROMPT_REQUESTED,

  // Wine History actions
  WINE_HISTORY_TOGGLED,

  // Restaurants actions
  RS_GEOLOCATION_FAILED,
  RS_GEOLOCATION_SUCCESSFUL,
  RS_FETCH_FAILED,
  RS_FETCHED,
  RS_SEARCHED,
  RS_MORE_REQUESTED,
  RS_MORE_FETCHED,
  RS_MORE_FAILED,
  RS_INPUT_CLEARED,
  RS_CLICKED,

  // DishSearch actions
  DS_FETCH_FAILED,
  DS_FETCHED,
  DS_SEARCHED,
  DS_INPUT_CLEARED,
  DS_CLICKED,
  DS_REMOVED,

  // WineDetails actions
  WS_FETCH_REQUESTED,
  WS_FETCHED,
  WS_WINE_VIEW_CHANGED,
  WS_SHOW_RATING,
  WS_HIDE_RATING,
  WS_UPDATE_RATING
} from '../constants/actions';

import Reduction from '../reduction';
import * as AppReducers from './AppReducer';
import * as LoginReducers from './LoginReducer';
import * as WineHistoryReducers from './WineHistoryReducer';
import * as RestaurantsReducers from './RestaurantsReducer';
import * as DishSearchReducers from './DishSearchReducer';
import * as WineDetailsReducers from './WineDetailsReducer';

// Creates a monad-like structure from the app state reduction
// and a set of 1...n modules containing reducer functions.
// The structure extends the reduction object (app state) with
// a function for every reducer from every module.
// This function takes the normal arguments for the reducer, minus
// the first argument (i.e. the reduction), which is implicit.
// This function returns a new monad-like structure using the same
// process but based on the new reduction object (app state) returned
// by the reducer.
const chain = (reduction, ...reducerModules) =>
  reducerModules.reduce((current, reducers) =>
    Object.keys(reducers).reduce((obj, reducerName) =>
      Object.defineProperty(
        obj,
        reducerName,
        { value: (...args) => chain(reducers[reducerName](reduction, ...args), ...reducerModules) }
      ), current
    ), new Reduction({ appState: reduction.appState, effects: reduction.effects })
  );

export default (reduction, action) => {
  switch (action.type) {
  // App actions
  case APP_MOUNTING:
    return chain(reduction, RestaurantsReducers, DishSearchReducers, AppReducers)
      .getCurrentPosition()
      .fetchDishes()
      .bootstrapRouting();
  case APP_NOTIFICATION_ADDED:
    return AppReducers.addNotification(reduction, action.payload);
  case APP_NOTIFICATION_REMOVED:
    return AppReducers.removeNotification(reduction, action.payload);
  case HNAV_BACK:
    return AppReducers.navBack(reduction);
  case APP_ROUTER_BOOTSTRAPPED:
    return AppReducers.routerBootstrapped(reduction, action.payload);
  case APP_ROUTER_ROUTE_CHANGED:
    return chain(reduction, AppReducers)
      .clearNotifications()
      .routeChanged(action.payload);

  // Authentication actions
  case WHATWINE_AUTH_RECEIVED:
    return LoginReducers.whatWineAuthResponseReceived(reduction, action.payload);
  case USER_FB_STATUS_CHANGED:
    return LoginReducers.fbStatusChange(reduction, action.payload);
  case USER_FB_GET_LOGIN_STATUS:
    return LoginReducers.fbGetLoginStatus(reduction, action.payload);
  case USER_FB_LOGIN_PROMPT_REQUESTED:
    return LoginReducers.requestFBLoginPrompt(reduction);

  // Wine History actions
  case WINE_HISTORY_TOGGLED:
    return WineHistoryReducers.toggleWineHistory(reduction);

  // Restaurants actions
  case RS_GEOLOCATION_FAILED:
    return RestaurantsReducers.handleGeolocationError(reduction, action.payload);
  case RS_GEOLOCATION_SUCCESSFUL:
    return RestaurantsReducers.fetchRestaurants(reduction, action.payload);
  case RS_FETCH_FAILED:
    return RestaurantsReducers.restaurantsFetchFailed(reduction);
  case RS_FETCHED:
    return RestaurantsReducers.restaurantsFetched(reduction, action.payload);
  case RS_SEARCHED:
    return RestaurantsReducers.filterRestaurantsNearMe(reduction, action.payload);
  case RS_MORE_REQUESTED:
    return RestaurantsReducers.fetchMoreRestaurants(reduction, action.payload);
  case RS_MORE_FETCHED:
    return RestaurantsReducers.moreRestaurantsFetched(reduction, action.payload);
  case RS_MORE_FAILED:
    return RestaurantsReducers.moreRestaurantsFailed(reduction);
  case RS_INPUT_CLEARED:
    return RestaurantsReducers.restaurantSearchCleared(reduction);
  case RS_CLICKED:
    return RestaurantsReducers.switchToRestaurant(reduction, action.payload);

  // DishSearch actions
  case DS_FETCH_FAILED:
    return DishSearchReducers.dishesFetchFailed(reduction);
  case DS_FETCHED:
    return DishSearchReducers.dishesFetched(reduction, action.payload);
  case DS_SEARCHED:
    return DishSearchReducers.handleDishSearch(reduction, action.payload);
  case DS_INPUT_CLEARED:
    return DishSearchReducers.dishSearchCleared(reduction);
  case DS_CLICKED:
    return DishSearchReducers.handleDishClick(reduction, action.payload);
  case DS_REMOVED:
    return DishSearchReducers.removeDishSelection(reduction, action.payload);

  // WineDetails actions
  case WS_FETCH_REQUESTED:
    return WineDetailsReducers.fetchTopWines(reduction, action.payload);
  case WS_FETCHED:
    return WineDetailsReducers.gotTopWines(reduction, action.payload);
  case WS_WINE_VIEW_CHANGED:
    return WineDetailsReducers.viewOtherWine(reduction, action.payload);
  case WS_SHOW_RATING:
    return WineDetailsReducers.showRateDialog(reduction, action.payload);
  case WS_HIDE_RATING:
    return WineDetailsReducers.hideRateDialog(reduction);
  case WS_UPDATE_RATING:
    return WineDetailsReducers.updateRating(reduction, action.payload);

  default:
    return reduction;
  }
};
