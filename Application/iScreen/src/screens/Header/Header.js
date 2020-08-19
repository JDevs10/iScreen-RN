import React, { Component } from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import { useIsDrawerOpen } from '@react-navigation/drawer';

export default class Header extends Component {
  constructor(props){
    super(props);
  }

  openSideMenu(navigation_){
    alert('hello');
    navigation_.openDrawer();
  }
  
  render() {
    const { navigation } = this.props;
    console.log('navigation : ', navigation);

    return (
      <View style={styles.body}> 

        <View style={[styles.layout, {justifyContent: "flex-start", alignItems: "flex-start", width: "10%"}]}>
          {/* <TouchableOpacity onPress={() => {this.openSideMenu(navigation)}}>
            <Image style={{height: 10, width: 10, padding: 15, marginLeft: 10}} source={require('../../../img/menu-ico.png')}/>
          </TouchableOpacity> */}
        </View>

        <View style={[styles.layout, {flex: 1, width: "50%"}]}>
          <Text style={styles.text}></Text>
        </View>

        <View style={[styles.layout, {justifyContent: "flex-end", alignItems: "flex-end", width: "10%"}]}>
            <Text style={styles.text}></Text>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
      height: 30,
      width: "100%",
      flexDirection: 'row',
      backgroundColor: '#00AAFF'
  },
  layout:{
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    flex: 1,
      color: "#000",
  }
});