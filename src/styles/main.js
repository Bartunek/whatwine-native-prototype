import { StyleSheet } from 'react-native';

// Layout
export const $heightHeader      = 45;
export const $widthButtonRemove = 20;
export const $widthDishImage    = 50;
export const $marginGeneric     = 15;

// Colors
export const $black             = '#111';
export const $purple            = '#68152a';
export const $red               = '#da4746';
export const $gray              = '#c8c7c4';
export const $bgWhite           = '#fbfaf7';
export const $bgBlack           = '#18181d';
export const $buttonPurple      = '#811b34';
export const $yellow            = '#e0cf13';
export const $starGray          = '#dcdcd9';

export const $colorError        = $red;
export const $colorWarning      = 'orange';
export const $colorNotify       = 'green';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#561e30',
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  wrap: {
    flex: 1,
    flexDirection: 'row'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export const splash = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    marginTop: 20,
    color: 'white'
  },
  spinner: {
    marginTop: 20
  }
});
