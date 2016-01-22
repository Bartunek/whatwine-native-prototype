/**
 * Reducer for the login functions
 */

import {
  LOGIN_STATUS_NOT_LOGGED_IN,
  LOGIN_STATUS_FB_LOGGED_IN,
  LOGIN_STATUS_APP_LOGGED_IN
} from '../config/general';

import buildMessage from '../buildMessage';

import {
  API_AUTH_WHATWINE,
  API_FACEBOOK_AUTH,
  API_FACEBOOK_DO_LOGIN_PROMPT
} from '../constants/effects';

export const whatWineAuthResponseReceived = (reduction, response) => {
  return reduction.setIn(['appState', 'auth', 'whatWineAuth'], response);
};

export const fbGetLoginStatus = reduction => {
  return reduction.set(
    'effects',
    reduction.get('effects').push(buildMessage(API_FACEBOOK_AUTH))
  );
};

export const requestFBLoginPrompt = reduction => {
  return reduction.set(
    'effects',
    reduction.get('effects').push(buildMessage(API_FACEBOOK_DO_LOGIN_PROMPT))
  );
};

export const fbStatusChange = (reduction, response) => {
  let loginStatus = LOGIN_STATUS_NOT_LOGGED_IN;
  let accessToken = null;
  let userID = null;

  let effects = reduction.get('effects');

  if (response.status === 'connected') {
    // logged in to app + facebook
    loginStatus = LOGIN_STATUS_APP_LOGGED_IN;

    accessToken = response.authResponse.accessToken;
    userID = response.authResponse.userID;

    // contact the WhatWine api to say we've logged in
    effects = effects.push(buildMessage(API_AUTH_WHATWINE, {
      accessToken, userID
    }));
  } else if (response.status === 'not_authorized') {
    // logged in to facebook but not app
    loginStatus = LOGIN_STATUS_FB_LOGGED_IN;
  }

  return reduction.setIn(
    ['appState', 'auth', 'loginStatus'], loginStatus
  ).setIn(
    ['appState', 'auth', 'fbAccessToken'], accessToken
  ).setIn(
    ['appState', 'auth', 'fbUserID'], userID
  ).setIn(
    ['appState', 'loaded', 'fbLoginStatus'], true
  ).set('effects', effects);
};
