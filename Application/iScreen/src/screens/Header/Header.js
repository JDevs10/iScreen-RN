import React, { Component } from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity, BackHandler, Alert, Dimensions, AsyncStorage } from 'react-native'
import DeviceInfo from 'react-native-device-info';

export default class Header extends Component {
    constructor(props){
        super(props); 
    
        /**
         * Returns true if the screen is in portrait mode
         */
        const isPortrait = () => {
          const dim = Dimensions.get('screen');
          return dim.height >= dim.width;
        };
    
        /**
        * Returns true of the screen is in landscape mode
        */
        const isLandscape = () => {
          const dim = Dimensions.get('screen');
          return dim.width >= dim.height;
        };
    
        this.state = {
          orientation: isPortrait() ? 'portrait' : 'landscape'
        };
        
        // Event Listener for orientation changes
        Dimensions.addEventListener('change', () => {
          this.setState({
            orientation: isPortrait() ? 'portrait' : 'landscape'
          });
        });
      }
    
      componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.existPressed);
      }
      
      componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.existPressed);
      }
      
      existPressed = () => {
        Alert.alert(
          'Exit App',
          'Do you want to exit?',
          [
            {text: 'No', onPress: () => this.leaving(false)},
            {text: 'Yes', onPress: () => this.leaving(true)},
          ],
          { cancelable: false });
          return true;
      }
    
      async leaving(isLeaving){
        if(isLeaving == true){
          await AsyncStorage.removeItem('token');
          BackHandler.exitApp();
        }else{
          console.log('Cancel Pressed');
        }
      }
    
      render() {
        if (this.state.orientation === 'portrait') {
          console.log('orientation : ', this.state.orientation);
        }
        else {
          console.log('orientation : ', this.state.orientation);
        }
    
        const disconnect = () => {
          this.existPressed();
        }
    
    
        const styles = StyleSheet.create({
          body: {
              height: 50,
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
    
        return (
          <View style={styles.body}> 
    
            <View style={[styles.layout, {justifyContent: "flex-start", alignItems: "flex-start", width: "10%"}]}>
              <Text style={styles.text}>hello</Text>
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
