/**
 * Rendering just text value so far, I didn't figured out
 * some simple way how to render circle graph
 */
import React, {
  PropTypes,
  StyleSheet,
  View,
  Text,
  Animated
} from 'react-native';

import Dimensions from 'Dimensions';
import { $marginGeneric, $starGray } from '../../styles/main';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: $marginGeneric * 3,
    left: 0,
    right: 0
  },
  points: {
    color: '#fff',
    fontSize: 48,
    fontFamily: 'sans-serif-thin',
    textAlign: 'center'
  }
});

export default class ScoreGraph extends React.Component {

  static propTypes = {
    score: PropTypes.number
  };

  static defaultProps = {
    score: 0
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.points}>
          {this.props.score}%
        </Text>
      </View>
    );
  }
}

