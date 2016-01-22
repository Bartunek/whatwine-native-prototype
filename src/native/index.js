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
        loading: true,
        showSplash: false
      };
    }

    render() {
      const restaurants = <Restaurants />;
      const wines = <Wines />;
      const splash = this.state.showSplash ? <SplashScreen /> : false;
      const view = this.state.loading ? splash : wines;

      const { width, height } = Dimensions.get('window');

      return (
        <View style={styles.container}>
          <Image source={bg}
            style={[styles.bg, { width, height }]}
            onLoad={this.showSplash.bind(this)} />
          {view}
        </View>
      );
    }

    showSplash() {
      this.setState({showSplash: true});
      setTimeout(() => this.setState({loading: false}), 3000);
    }
  }

  AppRegistry.registerComponent('WhatwineAppNative', () => WhatwineAppNative);
}

