import React, {
  View,
  Text,
  Image,
  ScrollView,
  ViewPagerAndroid,
  StyleSheet
} from 'react-native';
import Color from 'color';

import Icon from 'react-native-vector-icons/Foundation';
import Dimensions from 'Dimensions';
import Rating from './Rating';
import RevealImage from './RevealImage';
import ScoreGraph from './ScoreGraph';

import wines from '../../common/mockWines';
import ratings from '../../common/mockRatings';
import info from '../../common/mockWineInfo';
import dishes from '../../common/mockDishes';

import bgWhite from '../../img/bg-wine-white.jpg';
import bgRed from '../../img/bg-wine-red.jpg';

import styles, { rating, typo } from '../../styles/wines';
import { $starGray, $yellow, $purple, $marginGeneric } from '../../styles/main';

export default class Wines extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  static defaultProps = {
    wines: wines
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <ViewPagerAndroid
          style={styles.pager}
          initialPage={0}
          onPageSelected={this.onPageChanged.bind(this)}>
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

    return this.props.wines.map((wine, i) =>
      <View style={styles.page} key={i}>
        <Image source={ wine.color === 'red' ? bgRed : bgWhite }
          style={[styles.bg, { width, height: width * 1.09333 }]} />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          style={styles.scrollView}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <ScoreGraph ref={'score' + i} score={Math.round(Math.random() * 100)} />
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
              {dishes.map( (dish, i) =>
                <View style={styles.dish} key={i}>
                  <Text>{dish.name}</Text>
                  <Text style={{color: this.getValueColor(dish.compliance)}}>
                    {dish.compliance}%
                  </Text>
                </View>
              )}
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

  onPageChanged(event) {
    const {position} = event.nativeEvent;
    console.log(`Showing wine #${position}`);
  }

  getValueColor(val) {
    return Color()
      .hsl(Math.round(val * 1.2), 90, 50)
      .hexString();
    // return `hsl(${Math.round(val * 1.2)} , 90%, 50%)`;
  }
}


