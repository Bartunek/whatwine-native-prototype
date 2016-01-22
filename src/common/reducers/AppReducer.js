/**
 * Reducer for the main app functions
 */

import { fromJS, List } from 'immutable';

import buildMessage from '../buildMessage';
import * as Effects from '../constants/effects';

export const addNotification = (reduction, notification) => {
  const id = reduction.getIn(['appState', 'notifications', 'nextId']);

  return reduction
    .setIn(
      ['appState', 'notifications', 'list'],
      reduction.getIn(['appState', 'notifications', 'list'])
      .push(fromJS({
        id: id,
        text: notification.text,
        level: notification.level
      }))
    )
    .setIn(['appState', 'notifications', 'nextId'], id + 1);
};

export const removeNotification = (reduction, id) => {
  let newList = reduction.getIn(['appState', 'notifications', 'list']);
  const index = newList.findIndex(
    notification => notification && notification.get('id') === id
  );

  if (index > -1) {
    newList = newList.delete(index);
  }

  return reduction.setIn(['appState', 'notifications', 'list'], newList);
};

export const clearNotifications = (reduction) => {
  return reduction.setIn(['appState', 'notifications', 'list'], new List);
};

export const navBack = reduction => {
  return reduction
    .setIn(['appState', 'wineDetails', 'currentWineIndex'], 0)
    .setIn(['appState', 'restaurants', 'doClearSearch'], false)
    .update('effects', effects => effects.push(buildMessage(Effects.ROUTER_GO_BACK)));
};

export const bootstrapRouting = reduction => reduction
  .update('effects', effects => effects.push(buildMessage(Effects.ROUTER_BOOTSTRAP_ROUTING)));

export const routerBootstrapped = (reduction, history) => reduction
  .setIn(['appState', 'router', 'history'], history);

export const routeChanged = (reduction, payload) => reduction
.setIn(['appState', 'router', 'previousTitle'], payload.previousTitle);
