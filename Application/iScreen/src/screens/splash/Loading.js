import React, { Component } from 'react'
import { StyleSheet, StatusBar, Image, Text, View, AsyncStorage } from 'react-native'
import MyFooter from '../Footer/MyFooter'
import FindServers from '../../services/FindServers'


export default class Loading extends Component {
  constructor(props){
    super(props);
    this.state = {
      loadingNotify: 'chargement...',
      isServers: false
    };
  }
  
  async componentDidMount() {
    setTimeout(() => {
      this.setState({
        ...this.state,
        loadingNotify: 'Téléchargement des configs du serveur...'
    });
    }, 3000);


    //check if tocken exist already
    if(await AsyncStorage.getItem('token') != null && await AsyncStorage.getItem('token') != ""){
      // console.log('smt', await AsyncStorage.getItem('token'));
      this.props.navigation.navigate('download');
      return;
    }

    const server = new FindServers();
    const res = await server.getAllServerUrls().then(async (val) => {
      //console.log('servers 2 : ');
      //console.log(val);
      return val;
    });

    //console.log('servers 3 : ');
    //console.log(res);

    if(res == true){
      setTimeout(() => {
        this.props.navigation.navigate('settings_v1');
      }, 2500);
    }else{
      alert("Le serveur Big Data Consulting n'est pas joignable...\n");
    }
  }

    render() {
        return (
            <View style={styles.body}>

                <StatusBar translucent={true} backgroundColor={'transparent'} barStyle="light-content"/>

                <Image style={{width: 150, height: 150 }} source={require('../../../img/loading-gif.gif')}/>

                <Text style={styles.text}>{this.state.loadingNotify}</Text>

                <MyFooter/>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    body:{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      width: '100%', 
      height: '100%',
      backgroundColor: "#fff",
    },
    text:{
      fontSize: 20,
      color: "#00AAFF",
      fontWeight: "bold",
      alignItems: "center",
      justifyContent: "center",
    }
  });