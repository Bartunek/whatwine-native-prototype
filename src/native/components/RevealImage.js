import React, {
  Component,
  PropTypes,
  Animated,
  Image
} from 'react-native';

export default class RevealImage extends Component {

  static propTypes = {
    source: PropTypes.oneOfType([
      PropTypes.object.isRequired,
      PropTypes.number.isRequired,
    ]),
    duration: PropTypes.number
  };

  static defaultProps = {
    duration: 250
  };

  constructor(props) {
    super(props);

    this.state = {
      revealValue: new Animated.Value(0)
    }
  }

  render() {
    return (
      <Animated.Image source={this.props.source}
        style={this.getStyle()}
        onLoad={this.reveal.bind(this)} />
    );
  }

  getStyle() {
    return [
      this.props.style,
      {
        opacity: this.state.revealValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1]
        }),
        transform: [
          {
            scale: this.state.revealValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.15, 1]
            })
          }
        ]
      }
    ];
  }

  reveal() {
    Animated.timing( this.state.revealValue, {
      toValue: 1,
      duration: this.props.duration
    }).start();
  }
}
