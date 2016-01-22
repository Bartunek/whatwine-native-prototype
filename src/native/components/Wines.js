import React, {
  View,
  Text,
  Image,
  ScrollView,
  ViewPagerAndroid,
  StyleSheet
} from 'react-native';

import Icon from 'react-native-vector-icons/Foundation';
import Dimensions from 'Dimensions';
import Rating from './Rating';
import RevealImage from './RevealImage';

import bgWhite from '../../img/bg-wine-white.jpg';
import bgRed from '../../img/bg-wine-red.jpg';

import styles, { rating, typo } from '../../styles/wines';
import { $starGray, $yellow, $purple, $marginGeneric } from '../../styles/main';

const wines = [
  { name: 'Cabernet Sauvignon' , rating: 4, price: '139', color: 'red'},
  { name: 'Merlot'             , rating: 5, price: '158', color: 'red'},
  { name: 'Sauvignon Blanc'    , rating: 3, price: '99' , color: 'white'},
  { name: 'Burgundy'           , rating: 2, price: '199', color: 'red'},
  { name: 'Margaret River'     , rating: 4, price: '176', color: 'white'}
];

const ratings = [
  { name: 'Cedric M.', date: '29. 10. 2014', rating: 4, comment: 'This elegant medium-bodied wine offers aromas of cherry and spice.'},
  { name: 'Mathew G.', date: '31. 11. 2014', rating: 1, comment: 'This wine is absolute garbage.'},
  { name: 'Jiri S.', date: '2. 3. 2015', rating: 3, comment: 'Not worth to even think about this piece of shit. I think that the producer of this shit should kill himself with shotgun.'},
  { name: 'Jan B.', date: '5. 10. 2015', rating: 2, comment: 'Taste like shit, looks like piss.'},
];

const info = [
  { title: 'GRAPE', value: 'Sauvignon Blanc' },
  { title: 'COUNTRY', value: 'New Zealand' },
  { title: 'REGION', value: 'Marlborough' },
  { title: 'SUBREGION', value: null },
  { title: 'VILLAGE', value: null },
  { title: 'STYLE', value: 'Light & Crisp' },
]

export default class Wines extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <ViewPagerAndroid style={styles.pager} initialPage={0}>
          {this.renderItems()}
        </ViewPagerAndroid>
        <View style={styles.buttonContainer}>
          <Icon.Button name="plus"
            backgroundColor={$purple}
            borderRadius={5}
            style={styles.button}>
            <Text style={typo.button}>ADD TO MY WINE HISTORY</Text>
          </Icon.Button>
        </View>
      </View>
    );
  }

  renderItems() {
    const { width } = Dimensions.get('window');
    const ovalWidth = (width / 4) - ($marginGeneric / 2);

    return wines.map((wine, i) =>
      <View style={styles.page} key={i}>
        <Image source={ wine.color === 'red' ? bgRed : bgWhite }
          style={[styles.bg, { width, height: width * 1.09333 }]} />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          style={styles.scrollView}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <View style={[styles.oval, {
            width: ovalWidth,
            height: ovalWidth,
            borderRadius: ovalWidth,
            left: (3 * ovalWidth) / 2 + $marginGeneric
          }]}/>
          <View style={styles.label}>
            <Text style={[styles.labelText]}>{wine.name}</Text>
            <Text style={[styles.labelText, styles.price]}>${wine.price}</Text>
            <Rating rating={wine.rating} size={20} padding={3}
              color={$starGray}
              activeColor={$yellow}
              style={styles.rating} />
            <View style={styles.dishes}>
              <View style={styles.dish}>
                <Text>Beef meatballs in tomato sauce with...</Text>
              </View>
              <View style={styles.dish}>
                <Text>Crispy aromatic lamb</Text>
              </View>
              <View style={styles.dish}>
                <Text>Crab raviolli</Text>
              </View>
            </View>
          </View>
          <View style={rating.container}>
            <Text style={typo.heading}>RATINGS & NOTES</Text>
            {ratings.map( (item, i) =>
              <View key={i} style={[rating.itemContainer, {
                  borderTopWidth: i > 0 ? .5 : 0
                }]}>
                <Rating rating={item.rating} size={10} padding={2}
                  color={$starGray}
                  activeColor={$yellow}
                  style={rating.rating} />
                <RevealImage
                  style={rating.image}
                  source={{uri: `http://lorempixel.com/100/100/people/${i}`}} />
                <View style={rating.textContainer}>
                  <Text style={[rating.text, rating.name]}>{item.name}</Text>
                  <Text style={[rating.text, rating.date]}>{item.date}</Text>
                  <Text style={[rating.text, rating.comment]}
                    numberOfLines={4}>"{item.comment}"</Text>
                </View>
              </View>
            )}
            <Text style={typo.heading}>WINE INFORMATION</Text>
            {info.map( (info, i) =>
              <View key={i} style={[
                  rating.itemContainer,
                  styles.info,
                  { borderTopWidth: i > 0 ? .5 : 0 }
                ]}>
                <Text style={typo.title}>{info.title}</Text>
                <Text style={typo.value}>{info.value ? info.value : '-'}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}


