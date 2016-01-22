import React, {
  Component,
  View,
  Image,
  Text
} from 'react-native';

import Spinner from './Spinner';
import RevealImage from './RevealImage';
import logo from '../../img/whatwine-logo.png';

import { splash as styles } from '../../styles/main';

export default class SplashScreen extends Component {

  render() {
    const style = {
      width: 332/2,
      height: 365/2
    };

    return (
      <View style={styles.container}>
        <RevealImage source={logo} style={style} duration={500} />
        <Text style={styles.text}>Loading...</Text>
        <Spinner style={styles.spinner} />
      </View>
    );
  }
};
