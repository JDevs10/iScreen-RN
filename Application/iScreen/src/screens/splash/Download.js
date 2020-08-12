import React, { Component } from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, StatusBar, AsyncStorage} from  'react-native';
import MyFooter from '../Footer/MyFooter';
import FindCategories from '../../services/FindCategories';
import FindProduits from '../../services/FindProduits';
  

class Download extends Component {

  constructor(props){
    super(props);
    this.state = {
      loadingNotify: 'Initialiser les Téléchargements...',
    };
  }
  
  async componentDidMount() {

    //find the selected company
    const token_ = await AsyncStorage.getItem('token');
    const token = JSON.parse(token_);
    console.log('token : ', token.token);
    
    setTimeout(() => {
      this.setState({
        ...this.state,
        loadingNotify: 'Téléchargement des Categories...'
    });
    }, 3000);

    if("Request failed with status code 404".indexOf("404") >= 0){
      console.log('ok true');
    }else{
      console.log('ok false');
    }

    /*
    const res = [];

    console.log('findCategories');
    const findCategories = new FindCategories();
    const res_1 = await findCategories.getAllCategoriesFromServer(token).then(async (val) => {
      console.log('findCategories.getAllCategoriesFromServer : ');
      console.log(val);
      return val;
    });

    setTimeout(() => {
        this.setState({
          ...this.state,
          loadingNotify: 'Téléchargement des Produits...' 
      });
      }, 3000);
  
      console.log('findProduits');
      const findProduits = new FindProduits();
      const res_2 = await findProduits.getAllProduitsFromServer(token).then(async (val) => {
        console.log('findProduits.getAllProduitsFromServer : ');
        console.log(val);
        return val;
      });
      */
      this.props.navigation.navigate('home');

      /*
      res.push(res_1);
      res.push(res_2);

    const res_ = false;
    for(let x = 0; x < res.length; x++){
        if(res[x] == false){
            res_ = false;
            break;
        }
        res_ = true;
    }
    if(res_ == true){
      setTimeout(() => {
        this.props.navigation.navigate('home');
        return;
      }, 2500);
    }else{
      alert("Le serveur Big Data Consulting n'est pas joignable...\n");
    }
    */
  }

  render() {

    return (
      <View style={styles.body}>

        <StatusBar translucent={true} backgroundColor={'transparent'} barStyle="light-content"/>

        <Image style={{width: 150, height: 150 }} source={require('../../../img/loading-gif.gif')}/>

        <Text style={styles.text}>{this.state.loadingNotify}</Text>

        <MyFooter/>

      </View>
    );
  }
}

export default Download;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    backgroundColor: "#00AAFF",
    padding: 10
  },
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
    color: "#ABCDEF",
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
  }
});