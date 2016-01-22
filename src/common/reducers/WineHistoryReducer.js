import * as Effects from '../constants/effects';
import buildMessage from '../buildMessage';

/**
 * Reducer for the wine history functions
 */

export const toggleWineHistory = reduction => {
  const showingWineHistory = reduction.getIn(['appState', 'router', 'showingWineHistory']);

  if (showingWineHistory) {
    return reduction
      .setIn(['appState', 'router', 'showingWineHistory'], false)
      .update('effects', effects => effects.push(buildMessage(Effects.ROUTER_GO_BACK)));
  }

  return reduction
    .setIn(['appState', 'router', 'showingWineHistory'], true)
    .update('effects', effects => effects.push(buildMessage(Effects.ROUTER_CHANGE_URL, 'WineHistory')));
};
