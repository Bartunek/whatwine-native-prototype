import React, {
  Component,
  AppRegistry,
  Text,
  View,
  Image
} from 'react-native';
import Dimensions from 'Dimensions';

import styles from '../styles/main';
import SplashScreen from './components/SplashScreen';
import Restaurants from './components/Restaurants';
import Wines from './components/Wines';

import bg from '../img/ww-bg.png';

export default function index() {

  class WhatwineAppNative extends Component {

    constructor(props) {
      super(props);

      this.state = {
        showSplash: false,
        screen: ''
      };
    }

    render() {
      const { width, height } = Dimensions.get('window');

      return (
        <View style={styles.container}>
          <Image source={bg}
            style={[styles.bg, { width, height }]}
            onLoad={this.showSplash.bind(this)} />
          {this.renderView()}
        </View>
      );
    }

    renderView() {
      switch (this.state.screen) {
        case 'wines':
          return <Wines />;
        case 'restaurants':
          return <Restaurants onSelect={this.showWines.bind(this)} />;
        default:
          return this.state.showSplash ? <SplashScreen /> : false;
      }
    }

    showSplash() {
      this.setState({ showSplash: true });
      setTimeout(() => this.setState({ screen: 'restaurants' }), 3000);
    }

    showWines() {
      this.setState({ screen: 'wines' });
    }
  }

  AppRegistry.registerComponent('WhatwineAppNative', () => WhatwineAppNative);
}

