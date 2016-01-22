import buildMessage from '../buildMessage';

import {
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
  RS_CLICKED
} from '../constants/actions';

export const handleGeolocationError = error => buildMessage(RS_GEOLOCATION_FAILED, error);
export const fetchRestaurants = position => buildMessage(RS_GEOLOCATION_SUCCESSFUL, position);

export const restaurantsFetchFailed = () => buildMessage(RS_FETCH_FAILED);
export const restaurantsFetched = response => buildMessage(RS_FETCHED, response);
export const fetchMoreRestaurants = searchTerm => buildMessage(RS_MORE_REQUESTED, searchTerm);
export const moreRestaurantsFetched = response => buildMessage(RS_MORE_FETCHED, response);
export const moreRestaurantsFailed = () => buildMessage(RS_MORE_FAILED);

export const filterRestaurantsNearMe = searchTerm => buildMessage(RS_SEARCHED, searchTerm);
export const restaurantSearchCleared = () => buildMessage(RS_INPUT_CLEARED);

export const switchToRestaurant = index => buildMessage(RS_CLICKED, index);
