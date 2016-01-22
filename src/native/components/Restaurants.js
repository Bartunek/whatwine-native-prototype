import React, {
  Component,
  View,
  Text,
  Image,
  ListView,
  ToolbarAndroid,
  ScrollView,
  TouchableHighlight,
  TextInput,
  Alert
} from 'react-native';

import Color from 'color';

// Styles
import styles, { filter } from '../../styles/restaurants';

// Color values and dimensions imported from "stylesheet"
import {
  $gray,
  $bgWhite,
  $widthDishImage
} from '../../styles/main';

// Image resources
import logo from '../../img/whatwine-logo.png';
import iconBack from '../../img/icons/icon-chevron-left.png';
import iconNext from '../../img/icons/icon-chevron-right.png';
import iconHistory from '../../img/icons/icon-history.png';
import iconPlace from '../../img/icons/icon-place-black.png';
import iconSearch from '../../img/icons/icon-search.png';

// Mock data
import data from '../../common/mockRestaurants';

export default class Restaurants extends Component {

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });

    this.state = {
      ds: ds,
      data: ds.cloneWithRows(
        data.sort((a, b) => a.location.distance < b.location.distance )
      )
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <ToolbarAndroid style={styles.heading}
          title="WhatWine"
          titleColor={$bgWhite}
          subtitle="Restaurants"
          subtitleColor={$bgWhite}
          navIcon={iconBack}
          actions={[
            {title: 'Wine History', show: 'always', icon: iconHistory, showWithText: false},
          ]} />
        <View style={filter.container}>
          <View style={filter.inner}>
            <Image source={iconSearch} style={filter.icon}/>
            <TextInput style={filter.input}
              autoCorrect={false}
              onChange={this.onFilterChange.bind(this)}
              placeholder="Filter these results"
              placeholderTextColor={$gray}
              underlineColorAndroid={$bgWhite} />
          </View>
        </View>
        <ScrollView style={styles.scroll}>
          <ListView style={styles.list}
            pageSize={5}
            initialListSize={1}
            dataSource={this.state.data}
            renderRow={this.renderRow.bind(this)} />
        </ScrollView>
      </View>
    );
  }

  renderRow(restaurant) {
    const { address, city, distance } = restaurant.location;
    const photo = restaurant.photos.groups[0].items[0];
    const img = {
      uri: `${photo.prefix}100x100${photo.suffix}`,
      width: $widthDishImage,
      height: $widthDishImage
    }

    return (
      <TouchableHighlight key={restaurant.id}
        onPress={this.onPressItem.bind(this, restaurant.name)}
        underlayColor={Color($bgWhite).darken(0.05).hexString()}>
        <View style={styles.item}>
          <Image source={img} style={styles.image} />
          <View style={styles.text}>
            <Text style={styles.name}>{restaurant.name}</Text>
            <Text style={styles.address}>{address}, {city}</Text>
            <View style={styles.distance}>
              <Image source={iconPlace} style={styles.distanceIcon} />
              <Text style={styles.distanceText}>{distance}m</Text>
            </View>
          </View>
          <Image source={iconNext} style={styles.arrow} />
        </View>
      </TouchableHighlight>
    );
  }

  onPressItem(name) {
    Alert.alert(
      'WhatWine message',
      `Restaurant ${name} selected.`,
      [
        {text: 'Cancel'},
        {text: 'OK'}
      ]
    );
  }

  onFilterChange(event) {
    const term = event.nativeEvent.text;
    const results = term.length > 0 ?
      data
        .filter(restaurant => restaurant.name.indexOf(term) > -1)
        .sort((a, b) => a.location.distance > b.location.distance ) :
      data;

    this.setState({data: this.state.ds.cloneWithRows(results)});
  }

};
