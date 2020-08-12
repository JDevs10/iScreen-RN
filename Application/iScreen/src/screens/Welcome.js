import React, { Component } from 'react'
import { Text, StyleSheet, View, StatusBar, AsyncStorage } from 'react-native'
import MyFooter from './Footer/MyFooter'

export default class Welcome extends Component {

    componentDidMount() {
      setTimeout(() => {
          //this.props.navigation.navigate('loading');
          this.props.navigation.navigate('loading');
        }, 2500);
      }

    render() {
        return (
            <View style={styles.bg}>
                <StatusBar translucent={true} backgroundColor={'transparent'} barStyle="light-content"/>

                <View style={{width: '100%', height: '100%'}}>
                    <View style={{alignItems: "center", justifyContent: "center", height: "100%"}}>
                      <Text style={styles.text}>iScreen</Text>
                    </View>
                    
                    <MyFooter style={styles.footer}/>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        padding: 10
      },
      body:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
        height: '100%'
      },
      text: {
        color: "#fff",
        fontSize: 50,
      },
      bg:{
        backgroundColor: "#00AAFF",
      },
      footer:{
        flex: 1,
        color: '#fff'
      }
    });