/**
 * Reducer for the restaurant loader functions
 */

import {
  LIMIT_RESTAURANTS_RESULTS,

  ERROR_TEXT_RESTAURANTS,
  ERROR_TEXT_MORE_RESTAURANTS,

  FOURSQUARE_API_NEARME,
  FOURSQUARE_REQUEST_LIMIT,
  FOURSQUARE_RESPONSE_LIMIT,
  FOURSQUARE_CLIENTID,
  FOURSQUARE_CLIENT_SECRET,
  FOURSQUARE_RADII,
  FOURSQUARE_MAX_RADIUS,
  FOURSQUARE_THUMBNAIL_SIZE,

  GEOLOC_ERROR_NOT_SUPPORTED,
  GEOLOC_ERROR_PERMISSION_DENIED,
  GEOLOC_ERROR_POSITION_UNAVAILABLE,
  GEOLOC_ERROR_TIMEOUT,
  GEOLOC_ERROR_UNKNOWN_ERROR,

  CUISINE_TYPE_VENUE,
  getCuisineFromItem
} from '../config/general';

import { List, Map as map, fromJS } from 'immutable';
import querystring from 'querystring';

import buildMessage from '../buildMessage';

import {
  ERROR_HANDLER,

  API_FETCH_RESTAURANTS,
  API_FETCH_MORE_RESTAURANTS,
  ROUTER_CHANGE_URL,
  GEOLOC_GET_POSITION
} from '../constants/effects';

// TODO: should be inside effect handler
const getFoursquareRequest = (latitude, longitude, radius, term) => {
  const url = FOURSQUARE_API_NEARME;

  return url + querystring.stringify({
    ll: `${latitude.toString()},${longitude.toString()}`,
    radius: radius || FOURSQUARE_MAX_RADIUS,
    venuePhotos: 1,
    query: (term ? term + ' ' : '') + 'restaurant',

    client_id: FOURSQUARE_CLIENTID,
    client_secret: FOURSQUARE_CLIENT_SECRET,
    limit: FOURSQUARE_REQUEST_LIMIT,
    v: 20131016
  });
};

// TODO: should be inside effect handler
const checkFoursquareError = response => {
  const haveCode = response.body && response.body.meta && response.body.meta.code;

  let error = false;

  if (!haveCode) {
    error = 'Unknown response code';
  } else if (response.body.meta.code !== 200) {
    error = response.body.meta.errorDetail
      ? response.body.meta.errorDetail
      : 'Unknown error details';
  } else {
    const haveGroups = response.body.response && response.body.response.groups;

    if (!haveGroups || !Array.isArray(response.body.response.groups)) {
      error = 'groups is either undefined or non-array';
    }
  }

  return error;
};

const getVenue = (venue) => {
  const photo = venue.getIn(['photos', 'groups', 0, 'items', 0]);
  const invalidPhoto = photo && !(photo.get('prefix') && photo.get('suffix'));

  const small = photo
    ? `${photo.get('prefix')}${FOURSQUARE_THUMBNAIL_SIZE}${photo.get('suffix')}`
    : '';

  const header = photo
    ? `${photo.get('prefix')}original${photo.get('suffix')}`
    : '';

  const haveRating = !!venue.get('rating');
  const stars = haveRating ? Math.floor(Math.ceil(venue.get('rating')) / 1) : 0;

  // get the cuisine for each category that this venue fits
  const venueCuisines = venue.get('categories').map(category => {
    const name = category.get('shortName').replace(' Restaurant', '');

    // getCuisineFromItem() returns the first matched cuisine, or
    // null if no cuisine was matched.
    return getCuisineFromItem(name, CUISINE_TYPE_VENUE);
  }).filter(cuisine => cuisine !== null);

  // use the first cuisine found out of the categories associated with this venue
  const venueCuisine = venueCuisines.size > 0 ? venueCuisines.first() : null;

  return !invalidPhoto && map({
    _id: venue.get('id'),
    name: venue.get('name'),
    nameLowerCase: venue.get('name').toLowerCase(),
    description: venue.get('description') || '',
    url: venue.get('url') || '',
    cuisine: venueCuisine,

    thumbnails: map({ small, header }),

    geo: map({
      address: venue.getIn(['location', 'address']),
      latitude: venue.getIn(['location', 'lat']),
      longitude: venue.getIn(['location', 'lng']),
      distance: venue.getIn(['location', 'distance'])
    }),

    rating: map({
      stars: stars,
      value: haveRating ? venue.get('rating') : 0
    })
  });
};

const _getRestaurants = (venues) => venues
  .map(getVenue) // this gets relevant info from the foursquare venue object
  .sort((a, b) => a.getIn(['geo', 'distance']) - b.getIn(['geo', 'distance']));

const _getVenuesFromResponse = response =>
  response.status !== 200 || checkFoursquareError(response)
    ? List.of()
    : fromJS(response.body.response.groups)
        .filter(group => group.get('items').size)
        .flatMap(group => group.get('items').map(item => item.get('venue')));

export const getCurrentPosition = reduction =>
  reduction.update('effects', effects => effects.push(buildMessage(GEOLOC_GET_POSITION)));

export const handleGeolocationError = (reduction, error) => {
  let errorString;

  switch (error.code) {
  case 'ERROR_UNSUPPORTED_BROWSER':
    errorString = GEOLOC_ERROR_NOT_SUPPORTED;
    break;
  case error.PERMISSION_DENIED:
    errorString = GEOLOC_ERROR_PERMISSION_DENIED;
    break;
  case error.POSITION_UNAVAILABLE:
    errorString = GEOLOC_ERROR_POSITION_UNAVAILABLE;
    break;
  case error.TIMEOUT:
    errorString = GEOLOC_ERROR_TIMEOUT;
    break;
  case error.UNKNOWN_ERROR:
  default:
    errorString = GEOLOC_ERROR_UNKNOWN_ERROR;
  }

  return reduction
    .setIn(['appState', 'loaded', 'location'], true)
    .setIn(['appState', 'loaded', 'restaurants'], true)
    .setIn(['appState', 'location', 'geolocationError'], errorString);
};

export const fetchRestaurants = (reduction, position) => {
  const cached = reduction.getIn(['appState', 'loaded', 'location']);

  let effects = reduction.get('effects');

  let latitude = reduction.getIn(['appState', 'location', 'latitude']);
  let longitude = reduction.getIn(['appState', 'location', 'longitude']);

  if (!cached) {
    // the app has just fixed the user's location, so we
    // need to load "near me" restaurants from foursquare
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    const queries = FOURSQUARE_RADII.map(
      radius => getFoursquareRequest(latitude, longitude, radius)
    );

    effects = effects.push(buildMessage(API_FETCH_RESTAURANTS, queries));
  }

  return reduction
    .setIn(['appState', 'location', 'latitude'], latitude)
    .setIn(['appState', 'location', 'longitude'], longitude)
    .setIn(['appState', 'loaded', 'location'], true)
    .set('effects', effects);
};

export const restaurantsFetchFailed = reduction =>
  reduction
    .setIn(['appState', 'loaded', 'restaurants'], true)
    .set('effects', reduction.get('effects').push(buildMessage(
      ERROR_HANDLER, ERROR_TEXT_RESTAURANTS
    )));

export const restaurantsFetched = (reduction, responses) => {
  // this is run by the initial API call to foursquare,
  // for "near me" restaurants
  const restaurants = _getRestaurants(
    fromJS(responses)
      .flatMap(_getVenuesFromResponse)
      .toSet()
      .toList()
  ).take(FOURSQUARE_RESPONSE_LIMIT);

  return reduction
    .setIn(['appState', 'loaded', 'restaurants'], true)
    .setIn(['appState', 'restaurants', 'nearMe'], restaurants)
    .setIn(['appState', 'restaurants', 'results'], restaurants);
};

export const filterRestaurantsNearMe = (reduction, searchTerm) => {
  const term = searchTerm.toLowerCase();

  return reduction
    .setIn(['appState', 'restaurants', 'searchTerm'], searchTerm)
    .setIn(['appState', 'restaurants', 'moreLoading'], searchTerm.length > 0)
    .setIn(
      ['appState', 'restaurants', 'results'],
      term.length > 0
      ? reduction.getIn(['appState', 'restaurants', 'nearMe'])
        .filter(restaurant =>
          restaurant.get('nameLowerCase').indexOf(term) > -1
        ).take(LIMIT_RESTAURANTS_RESULTS)
      : reduction.getIn(['appState', 'restaurants', 'nearMe'])
    );
};

export const fetchMoreRestaurants = (reduction, searchTerm) => {
  const term = searchTerm.toLowerCase();

  let effects = reduction.get('effects');

  let moreLoading = reduction.getIn(['appState', 'restaurants', 'moreLoading']);

  if (term.length > 0) {
    const query = getFoursquareRequest(
      reduction.getIn(['appState', 'location', 'latitude']),
      reduction.getIn(['appState', 'location', 'longitude']),
      null,
      term
    );

    effects = effects.push(buildMessage(API_FETCH_MORE_RESTAURANTS, query));
  } else {
    moreLoading = false;
  }

  // set off a side effect for searching foursquare
  return reduction
    .set('effects', effects)
    .setIn(['appState', 'restaurants', 'moreLoading'], moreLoading);
};

export const moreRestaurantsFetched = (reduction, response) => {
  // this is run by the API call to foursquare,
  // for "more" restaurants (as-you-type)
  const searchTerm = reduction.getIn(
    ['appState', 'restaurants', 'searchTerm']
  ).toLowerCase();

  const results = reduction.getIn(['appState', 'restaurants', 'results']);

  const fetched = _getRestaurants(_getVenuesFromResponse(response))
    .filter(restaurant => {
      const name = restaurant.get('nameLowerCase');
      const _id = restaurant.get('_id');

      return name.indexOf(searchTerm) > -1 &&
        results.every(venue => venue.get('_id') !== _id);
    }).sort((venue1, venue2) => {
      const index1 = venue1.get('nameLowerCase').indexOf(searchTerm);
      const index2 = venue2.get('nameLowerCase').indexOf(searchTerm);

      return index1 - index2;
    });

  return reduction
    .setIn(['appState', 'restaurants', 'moreLoading'], false)
    .setIn(['appState', 'restaurants', 'results'], results.concat(fetched));
};

export const moreRestaurantsFailed = reduction =>
  reduction
    .setIn(['appState', 'restaurants', 'moreLoading'], false)
    .set('effects', reduction.get('effects').push(buildMessage(
      ERROR_HANDLER, ERROR_TEXT_MORE_RESTAURANTS
    )));

export const restaurantSearchCleared = reduction =>
  reduction
    .setIn(['appState', 'restaurants', 'searchTerm'], '')
    .setIn(
      ['appState', 'restaurants', 'results'],
      reduction.getIn(['appState', 'restaurants', 'nearMe'])
    )
    .setIn(['appState', 'restaurants', 'moreLoading'], false);

export const switchToRestaurant = (reduction, index) => {
  const restaurant = reduction
    .getIn(['appState', 'restaurants', 'results', index]);

  return reduction
    .setIn(['appState', 'dishSearch', 'restaurant'], restaurant)
    .setIn(['appState', 'dishSearch', 'searchTerm'], null)
    .setIn(['appState', 'dishSearch', 'searchResults'], List.of())
    .setIn(['appState', 'dishSearch', 'selectedDishes'], List.of())
    .update('effects', effects => effects.push(buildMessage(ROUTER_CHANGE_URL, 'DishSearch')));
};
