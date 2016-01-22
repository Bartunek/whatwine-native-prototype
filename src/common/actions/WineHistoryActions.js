import buildMessage from '../buildMessage';

import {
  // Wine History actions
  WINE_HISTORY_TOGGLED
} from '../constants/actions';

export const toggleWineHistory = () => buildMessage(WINE_HISTORY_TOGGLED);

