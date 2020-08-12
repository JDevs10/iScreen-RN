import React, { Component } from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Welcome from '../screens/Welcome';
import Loading from '../screens/splash/Loading';
import Settings_v1 from '../screens/Settings_v1';
import Download from '../screens/splash/Download';
import Home from '../screens/Home';

import { DrawerContent } from '../screens/side-bar-custom/DrawerContent';


class RouterNavigation extends Component {
    render() {

      // when user is logged in
      //DrawerContent={props => new DrawerContent(props)}
      const Drawer = createDrawerNavigator();

      function DrawerNavigation(){
        return (
          <Drawer.Navigator drawerContent={props => <DrawerContent {...props}/>} initialRouteName="Home">
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Settings_v1" component={Settings_v1} />
          </Drawer.Navigator>
        );
      }

      // when user is logged out
      const Navigation = createAppContainer(createSwitchNavigator(
        {
          welcome: Welcome,
          loading: Loading,
          download: Download,
          settings_v1: Settings_v1,
          home: DrawerNavigation
        },
        {
          initialRouteName: 'welcome',
        }
      ));
      return (
        <Navigation />
      );
    }
}
export default RouterNavigation;