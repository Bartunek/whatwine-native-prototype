import { Record, List, fromJS } from 'immutable';

import { LOGIN_STATUS_LOADING } from './config/general';

export default new Record({
  appState: fromJS({
    router: {
      history: null,
      previousTitle: null,
      showingWineHistory: false
    },
    loaded: {
      location: false,
      restaurants: false,
      dishSearch: false
    },
    previousView: null, // used to handle closing "popup" views
    notifications: {
      nextId: 1, // each new notification increases this by 1
      list: [] // list of notifications
    },
    auth: {
      loginStatus: LOGIN_STATUS_LOADING,
      fbAccessToken: null,
      fbUserID: null,
      whatWineAuth: false
    },
    location: {
      latitude: 0,
      longitude: 0,
      geolocationError: ''
    },
    wineHistory: {
      history: []
    },
    restaurants: {
      nearMe: List.of(), // all of the restaurants near me
      results: List.of(),
      searchTerm: '',
      moreLoading: false
    },
    dishSearch: {
      restaurant: null, // currently selected restaurant
      allDishes: {},
      searchTerm: null,
      searchResults: [],
      selectedDishes: []
    },
    WineDetails: {
      wines: [], // recommended wines
      // of the wines that are recommended, which one is in view
      currentWineIndex: 0,
      rating: null
    }
  }),
  effects: List.of()
});

