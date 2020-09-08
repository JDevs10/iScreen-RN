import React, { Component } from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, StatusBar, BackHandler, Alert, AsyncStorage} from  'react-native';
import MyFooter from '../Footer/MyFooter';
import FindCategories from '../../services/FindCategories';
import FindProduits from '../../services/FindProduits';
import FindImages from '../../services/FindImages';
import CheckData from '../../services/CheckData';

import SettingsManager from '../../Database/SettingsManager';
import ServerManagement from '../../Database/ServerManagement';
import CategoriesManager from '../../Database/CategoriesManager';
import ProduitsManager from '../../Database/ProduitsManager';
  

class Download extends Component {

  constructor(props){
    super(props);
    this.state = {
      loadingNotify: 'Initialisation...',
    };
  }

  componentWillMount() {
      BackHandler.addEventListener('hardwareBackPress', this.existPressed);
  }
    
  componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.existPressed);
  }

  async existPressed() {
    await Alert.alert(
      'Configuration',
      "Les données de configuration sont corrompues.\n"+
      "Veuillez nettoyer le cache et les données de cette application dans son stockage.\n"+
      "En faisant cette action, vous devrez entrer la clé de licence.",
      [
        {text: 'Ok', onPress: async () => await this.leaving()},
      ],
      { cancelable: false }
    );
  }

  async leaving(){
    await AsyncStorage.removeItem('token');
    BackHandler.exitApp();
  }
  
  async componentDidMount() {

    await setTimeout(async () => {
      this.setState({
        ...this.state,
        loadingNotify: 'Vérification des données...'
    });
    }, 3000);

    //check settings data
    const sm = new SettingsManager();
    await sm.initDB(); // open db
    const checkSettings = await sm.CHECK_DATA().then(async (val) => {
      console.log('checkSettings: ', val);
      return await val;
    });

    console.log('checkSettings: CHECK_DATA =====> Done!');

    //Setting check error, 
    //insert default settings
    //if error in insert then display message
    if(!checkSettings){
      console.log('!checkSettings....');
      const token_ = await AsyncStorage.getItem('token');
      const token = await JSON.parse(token_);

      // await sm.initDB(); // open db
      await sm.CREATE_SETTINGS_TABLE();
      const settings = {
        autoPlay: false, 
        isShowDescription: true, 
        isShowPrice: true, 
        isShowTittle: true, 
        key: token.token, 
        server: token.server, 
        speed: 2,
        modifyDate: Date.now()
      };
      const res = await sm.INSERT_SETTINGS(settings).then(async (val) => {
        console.log('INSERT_SETTINGS => val: ', val);
        return await val;
      });

      //await sm.closeDatabase();

      if(!res){
        await this.existPressed();
      }
      
    }

    //check if categories, products and images existe
    const checkData = new CheckData();
    console.log('#######################################################');
    console.log('##### CheckData: CheckData');
    const data_check = await checkData.checkData().then(async (val) => {
      return await val;
    });

    console.log('data_check : ', data_check);

    //skipe download to home screen
    if(data_check){
      this.props.navigation.navigate('home');
      return;
    }
    //find the selected company
    const token_ = await AsyncStorage.getItem('token');
    const token = JSON.parse(token_);
    console.log('token : ', token.token);
    
    
    await setTimeout(async () => {
      this.setState({
        ...this.state,
        loadingNotify: 'Téléchargement des Categories...'
    });
    }, 3000);


    const res = [];

    console.log('findCategories');
    const findCategories = new FindCategories();
    const res_1 = await findCategories.getAllCategoriesFromServer(token).then(async (val) => {
      console.log('findCategories.getAllCategoriesFromServer : ');
      console.log(val);
      return await val;
    });


    await setTimeout(async () => {
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
      return await val;
    });


    await setTimeout(async () => {
      this.setState({
        ...this.state,
        loadingNotify: 'Téléchargement des images...' 
      });
    }, 3000);

    // console.log('findImages');
    // const findImages = new FindImages();
    // const res_3 = await findImages.getAllProduitsImagesFromServer(token).then(async (val) => {
    //   console.log('findImages.getAllProduitsImagesFromServer : ');
    //   console.log(val);
    //   return await val;
    // });
    
    await res.push(res_1);
    await res.push(res_2);
    // await res.push(res_3);

    let res_ = false;
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
      this.setState({
        ...this.state,
        loadingNotify: "Le serveur Big Data Consulting n'est pas joignable..."
      });

      const SettingsManager_ = new SettingsManager();
      await SettingsManager_.initDB();
      await SettingsManager_.DROP_SERVER();

      const ServerManagement_ = new ServerManagement();
      await ServerManagement_.initDB();
      await ServerManagement_.DROP_SERVER();

      const CategoriesManager_ = new CategoriesManager();
      await CategoriesManager_.initDB();
      await CategoriesManager_.DROP_SERVER();

      const ProduitsManager_ = new ProduitsManager();
      await ProduitsManager_.initDB();
      await ProduitsManager_.DROP_SERVER();

      alert("Le serveur Big Data Consulting n'est pas joignable...");
      
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