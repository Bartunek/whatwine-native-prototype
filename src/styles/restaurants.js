import { StyleSheet } from 'react-native';

import {
  $bgWhite,
  $gray,
  $black,
  $marginGeneric,
  $widthDishImage,
} from './main';

export const filter = StyleSheet.create({
  container: {
    height: 50,
    // flex: 1,
    backgroundColor: $bgWhite
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  icon: {
    marginTop: -6,
    marginHorizontal: $marginGeneric / 2,
    width: $marginGeneric,
    height: $marginGeneric
  },
  input: {
    flex: 1,
    color: $black,
    lineHeight: 55
  }
});

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  heading: {
    height: 60,
    // flex: 1,
    alignItems: 'center'
  },
  scroll:{
    flex: 1
  },
  list: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: $bgWhite
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: $marginGeneric,
    borderBottomWidth: 1,
    borderBottomColor: $gray
  },
  image: {
    marginRight: $marginGeneric,
    width: $widthDishImage,
    height: $widthDishImage
  },
  text: {
    flex: 1,
    marginTop: -5
  },
  name: {
    color: $black,
    fontSize: 14
  },
  address: {
    marginTop: 3,
    fontSize: 12,
    fontStyle: 'italic'
  },
  distance: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 3
  },
  distanceText: {
    fontSize: 10,
    color: $black
  },
  distanceIcon: {
    width: 14 / 2,
    height: 18 / 2,
    marginRight: 5
  },
  arrow: {
    alignSelf: 'flex-end',
    position: 'relative',
    top: -20,
    width: 8,
    height: 13
  }
});
