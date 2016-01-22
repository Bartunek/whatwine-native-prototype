import buildMessage from '../buildMessage';

import {
  // App actions
  APP_MOUNTING,
  APP_NOTIFICATION_ADDED,
  APP_NOTIFICATION_REMOVED,
  APP_ROUTER_BOOTSTRAPPED,
  APP_ROUTER_ROUTE_CHANGED,
  HNAV_BACK
} from '../constants/actions';

export const applicationMounting = () => buildMessage(APP_MOUNTING);

export const addNotification = (text, level) => buildMessage(
  APP_NOTIFICATION_ADDED, { text, level }
);
export const removeNotification = id => buildMessage(APP_NOTIFICATION_REMOVED, id);
export const navBack = () => buildMessage(HNAV_BACK);

export const routerBootstrapped = history => buildMessage(APP_ROUTER_BOOTSTRAPPED, history);

export const routeChanged = previousTitle => buildMessage(APP_ROUTER_ROUTE_CHANGED, { previousTitle });
