/**
 * config parameters
 */

import React from 'react';
import { DEPLOY_ENV } from 'environment';
import CUISINES from './cuisines';

export const CUISINE_TYPE_DISH = 1;
export const CUISINE_TYPE_VENUE = 2;

// gets the region/cuisine of Foursquare restaurants
export const getCuisineFromItem = (name, type) => {
  const cuisines = CUISINES.filter(
    cuisine => cuisine.get(type).indexOf(name) > -1
  ).map(cuisine => cuisine.first());

  return cuisines.size > 0 ? cuisines.first() : null;
};

export const NOTIFICATION_LEVEL_DEFAULT = 'notify';
export const NOTIFICATION_LEVEL_WARNING = 'warning';
export const NOTIFICATION_LEVEL_ERROR = 'error';

// API config
const BACKEND_URL = `https://whatwine-${DEPLOY_ENV}-backend.herokuapp.com`;
const API_URL = `${BACKEND_URL}/api/v1`;

export const AUTH_WHATWINE_API_URL = `${BACKEND_URL}/login/facebook`;

export const DISHES_API_URL = `${API_URL}/dishes`;
export const DISH_ALIASES_API_URL = `${DISHES_API_URL}/aliases`;
export const TOPWINE_API_URL = `${API_URL}/topwines`;

// foursquare settings
export const FOURSQUARE_API_URL = 'https://api.foursquare.com/v2/venues';
export const FOURSQUARE_API_NEARME = `${FOURSQUARE_API_URL}/explore?`;
export const FOURSQUARE_API_SUGGEST = `${FOURSQUARE_API_URL}/suggestcompletion?`;
export const FOURSQUARE_CLIENTID = 'PGHMRHWA1HSAYNNAKMP3UISHDVEPZLNR1GXERJW05KIOG2YF';
export const FOURSQUARE_CLIENT_SECRET = 'O0OMB02RZN13PWV5MIYLNB5CLRK0WUCQT1DPUTK1YU154DEG';
export const FOURSQUARE_MAX_RADIUS = 80000;
export const FOURSQUARE_SORT_BY_DISTANCE = true;
export const FOURSQUARE_THUMBNAIL_SIZE = '75x75';
export const FOURSQUARE_REQUEST_LIMIT = 50;
export const FOURSQUARE_RESPONSE_LIMIT = 50;
export const FOURSQUARE_RADII = [250, 1000, 5000];

export const RESTAURANTS_API_URL = `${API_URL}/foursquare/by_geo`;

export const LOADING_TEXT = {
  location: 'Getting your location',
  restaurants: 'Finding restaurants near you',
  dishSearch: 'Loading dishes'
};

export const LOGIN_FORM_ABOVE_TEXT = (
  <header>
    <h2>By logging into Facebook<br/> you&#39;ll be able to:</h2>
    <ul>
      <li>Track your wine history</li>
      <li>Rate and comment on wines</li>
      <li>Share wines with your friends</li>
    </ul>
  </header>
);
export const LOGIN_FORM_BELOW_TEXT = 'We\'ll never post to your wall without your permission.';
export const LOGIN_BUTTON_TEXT = 'Log in with Facebook';
export const LOGIN_CANCEL_TEXT = 'Thanks, but maybe later';

// result count limiting
export const LIMIT_DISHES_RESULTS = 50;
export const LIMIT_RESTAURANTS_RESULTS = 20;

// default input values
export const DISH_SEARCH_INPUT_TEXT = 'Enter the name of the food';
export const RESTAURANT_SEARCH_INPUT_TEXT = 'Filter these results';

// general error messages
export const ERROR_TEXT_RESTAURANTS = 'Error fetching list of restaurants';
export const ERROR_TEXT_MORE_RESTAURANTS = 'Error fetching as-you-type results';
export const ERROR_TEXT_DISHES = 'Error fetching list of dishes';

// geolocation error messages
export const GEOLOC_ERROR_NOT_SUPPORTED = 'your browser is too old.';
export const GEOLOC_ERROR_PERMISSION_DENIED = 'please allow this app to find your location.';
export const GEOLOC_ERROR_POSITION_UNAVAILABLE = 'location information unavailable.';
export const GEOLOC_ERROR_TIMEOUT = 'timeout.';
export const GEOLOC_ERROR_UNKNOWN_ERROR = 'unknown error.';

export const geolocationErrorText = error => (
  <span>There was a problem finding your location: {error}</span>
);

// page titles
export const TITLE_WINE_DETAILS = 'WhatWine Picks';
export const TITLE_RESTAURANTS = 'Restaurants';
export const TITLE_DISH_SEARCH = 'Dishes';
export const TITLE_WINE_HISTORY = 'Wine History';

export const WINE_HISTORY_NO_HISTORY_TEXT = 'Wine history is great ' +
  'because it helps you remember which wines you had. Save some ' +
  'wines to your history today and live a long and healthy life!';

export const NO_DATA_TEXTS = {
  headings: {
    dish: 'No Dish Found',
    restaurant: 'No Restaurant Found',
    nearby: 'Sorry...'
  },
  messages: {
    dish: term => (
      <p>
        Sorry, there are no dishes matching "<strong>{term}</strong>".
        <br/>
        Please try to refine your search.
      </p>
    ),
    restaurant: term => (
      <p>
        Sorry, there are no restaurants matching "<strong>{term}</strong>".
        <br/>
        Maybe you could try searching for something else?
      </p>
    ),
    nearby: () => (<p>We couldn&#39;t find any restaurants near you!</p>)
  }
};

// magic numbers
export const LOGIN_STATUS_LOADING = -1;
export const LOGIN_STATUS_NOT_LOGGED_IN = 0;
export const LOGIN_STATUS_FB_LOGGED_IN = 1;
export const LOGIN_STATUS_APP_LOGGED_IN = 2;

export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

