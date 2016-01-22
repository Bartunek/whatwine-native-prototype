import { StyleSheet } from 'react-native';

import {
  $bgWhite,
  $bgBlack,
  $gray,
  $purple,
  $marginGeneric
} from './main';

import Color from 'color';

const $borderColor = Color($bgBlack).lighten(0.75).hexString();

export const typo = StyleSheet.create({
  heading: {
    marginVertical: $marginGeneric,
    color: $bgWhite,
    fontSize: 14
  },
  title: {
    color: '#46464a',
    fontSize: 16
  },
  value: {
    color: '#aaa',
    fontSize: 14
  },
  button: {
    fontSize: 16,
    fontWeight: '100',
    color: 'white'
  }
});

export const rating = StyleSheet.create({
  container: {
    backgroundColor: $bgBlack,
    paddingHorizontal: $marginGeneric
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: $marginGeneric,
    borderColor: $borderColor
  },
  textContainer: {
    flex: 1
  },
  image: {
    width: 50,
    height: 50,
    marginRight: $marginGeneric,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: $gray
  },
  rating: {
    width: 60,
    position: 'absolute',
    top: $marginGeneric,
    right: 0
  },
  text: {
    color: $gray
  },
  name: {
    fontWeight: 'bold'
  },
  date: {
    fontSize: 10
  },
  comment: {
    marginTop: $marginGeneric / 2,
    flex: 1
  }
});

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: $bgBlack
  },
  scrollContainer: {
    padding: 0
  },
  scrollView: {
    position: 'relative'
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  pager: {
    flex: 1
  },
  page: {
    flex: 1,
    alignItems: 'center',
    // paddingHorizontal: 20,
    alignItems: 'stretch',
  },
  oval: {
    position: 'absolute',
    top: $marginGeneric * 9,
    backgroundColor: $bgWhite,
    transform: [{scaleX: 4}]
  },
  label: {
    marginTop: $marginGeneric * 11,
    marginBottom: $marginGeneric * 2,
    marginHorizontal: $marginGeneric,
    backgroundColor: $bgWhite,
    borderWidth: 10,
    borderColor: $bgWhite,
    borderRadius: 5,
    shadowColor: $bgBlack,
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 50
  },
  labelText: {
    marginHorizontal: 50,
    textAlign: 'center',
    fontSize: 18
  },
  price: {
    fontWeight: 'bold',
    color: '#000'
  },
  rating: {
    alignSelf: 'center',
    marginTop: $marginGeneric / 3
  },
  dishes: {
    marginTop: 10,
  },
  dish: {
    borderTopColor: Color($gray).lighten(0.15).hexString(),
    borderTopWidth: .5,
    borderStyle: 'solid',
    justifyContent: 'center',
    height: 40
  },
  info: {
    flexDirection: 'column'
  },
  buttonContainer: {
    padding: $marginGeneric,
    justifyContent: 'center'
  },
  button: {
    justifyContent: 'center'
  }
});
