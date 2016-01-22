import buildMessage from '../buildMessage';

import {
  // Authentication actions
  WHATWINE_AUTH_RECEIVED,
  USER_FB_STATUS_CHANGED,
  USER_FB_LOGIN_PROMPT_REQUESTED,
  USER_FB_GET_LOGIN_STATUS
} from '../constants/actions';

export const whatWineAuthResponseReceived = response => buildMessage(
  WHATWINE_AUTH_RECEIVED, response
);

export const fbGetLoginStatus = callback => buildMessage(
  USER_FB_GET_LOGIN_STATUS, callback
);

export const requestFBLoginPrompt = () => buildMessage(USER_FB_LOGIN_PROMPT_REQUESTED);

export const fbStatusChange = response => buildMessage(
  USER_FB_STATUS_CHANGED, response
);
