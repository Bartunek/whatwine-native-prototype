import React, {
  Component,
  Animated,
  View,
  Image
} from 'react-native';

import spinner from '../../img/spinner.png';

export default class Spinner extends Component {

  static defaultProps = {
    width: 50,
    height: 50
  };

  constructor(props) {
    super(props);

    this.state = {
      rotationValue: new Animated.Value(0)
    }
  }

  componentDidMount() {
    this.startAndRepeat();
  }

  render() {
    return (
      <View {...this.props}>
        <Animated.Image source={spinner} style={this.getStyle()} />
      </View>
    );
  }

  getStyle() {
    return {
      width: this.props.width,
      height: this.props.height,
      transform: [
        {rotate: this.state.rotationValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg']
        })}
      ]
    };
  }

  startAndRepeat() {
    this.state.rotationValue.setValue(0);
    this.startAnimation(this.startAndRepeat.bind(this));
  }

  startAnimation(cb) {
    Animated.timing( this.state.rotationValue, {
      toValue: 1,
      duration: 1000
    }).start(cb);
  }
}
