import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer } from '@react-navigation/native';
import RouterNavigation from './router/routers';

class App extends Component {
  render() {
    return(
      <NavigationContainer>
          <RouterNavigation />
      </NavigationContainer>
    );
  }
}


export default App;