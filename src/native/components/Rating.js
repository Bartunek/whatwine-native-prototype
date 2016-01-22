/**
 * Renders given number of stars
 */
import React, {
  PropTypes,
  StyleSheet,
  View,
  Image
} from 'react-native';

import Icon from 'react-native-vector-icons/Foundation';

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default class Rating extends React.Component {

  static propTypes = {
    total: PropTypes.number,
    rating: PropTypes.number.isRequired,
    size: PropTypes.number,
    color: PropTypes.string,
    activeColor: PropTypes.string,
    padding: PropTypes.number,
    callback: PropTypes.func
  };

  static defaultProps = {
    total: 5,
    rating: 0,
    size: 20,
    color: '#ccc',
    activeColor: '#333',
    padding: 0,
    style: {}
  };

  renderStars() {
    return [...Array(this.props.total)].map((x, i) => (
      <View key={i} style={{marginHorizontal: this.props.padding}}
        onClick={this.props.callback ? this.props.callback.bind(this, i + 1) : null}>
        <Icon name="star" size={this.props.size}
          color={i < this.props.rating ? this.props.activeColor : this.props.color } />
      </View>
    ));
  }

  render() {
    return (
      <View style={[style.container, this.props.style]}>
        {this.renderStars()}
      </View>
    );
  }
}
