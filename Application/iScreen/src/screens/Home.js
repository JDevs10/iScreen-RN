import React, { Component } from 'react'
import CategoriesManager from '../Database/CategoriesManager'
import ProduitsManager from '../Database/ProduitsManager'
import {StatusBar, StyleSheet, ScrollView, TouchableOpacity, View, Text, TextInput, FlatList, Image, Dimensions, Alert, ImageBackground} from  'react-native';
import { Card, Button } from 'react-native-elements'
import DeviceInfo from 'react-native-device-info';

import { openDatabase } from 'react-native-sqlite-storage';
import Carousel from './customs/Carousel';
import Header from './Header/Header';
var db = openDatabase({ name: 'iScreen.db' });

export default class Home extends Component {
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
            notif: '....',
            orientation: isPortrait() ? 'portrait' : 'landscape',
        };
        
        // Event Listener for orientation changes
        Dimensions.addEventListener('change', () => {
          this.setState({
            orientation: isPortrait() ? 'portrait' : 'landscape'
          });
        });
    }

    componentDidMount(){
        /*
        const cm = new CategoriesManager();
        const pm = new ProduitsManager();
        const cm_ = await cm.GET_LIST().then(async (val) => {
            console.log('val', val);
            return val;
        });
        const pm_ = await pm.GET_LIST().then(async (val) => {
            console.log('val', val);
            return val;
        });
        */
        /*
        db.transaction(async (tx) => {
            tx.executeSql('SELECT * FROM categories', [], async (tx, results) => {
                const rows = results.rows;
                let categories = [];

                console.log('Query completed, found ' + rows.length + ' rows');

                for (let i = 0; i < rows.length; i++) {
                    console.log("row : ", rows.item(x));
                    categories.push(rows.item(x));
                }

                this.setState({
                    notif: 'nbr '+categories.length+' Categories'
                });
            });
        });
        */

        //et selectQuery = await new Promise((resolve, reject) => {
            /*
            db.transaction((trans) => {
                trans.executeSql('SELECT * FROM categories', [], (trans, results) => {
                    resolve(results);

                },(error) => {
                    reject(error);
                });
            });
            */
           db.transaction(tx => {
            tx.executeSql('SELECT * FROM categories', [], (tx, results) => {
              var temp = [];
              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
              }
              console.log('TABLE_NAME', temp)
          
            });
          });
           
        //});

        //console.log('selectQuery: ', selectQuery);

        /*
        var rows = selectQuery.rows;
        for (let i = 0; i < rows.length; i++) {
            var item = rows.item(i);
            console.log(item);
        }
        */

    }


    render() {
        const MyDeviceWidth = Dimensions.get('window').width;
        const MyDeviceHeight = Dimensions.get('window').height;
        const data = [
            {label: "Hello 1", prix: 0.99, description: "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page.", pic: require("../../img/no-img.jpg")},
            {label: "Hello 2", prix: 0.99, description: "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page.", pic: require("../../img/loading-gif.gif")},
            {label: "Hello 3", prix: 0.99, description: "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page.", pic: require("../../img/no-img.jpg")},
            {label: "Hello 4", prix: 0.99, description: "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page.", pic: require("../../img/no-img.jpg")},
            {label: "Hello 5", prix: 0.99, description: "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page.", pic: require("../../img/no-img.jpg")},
            {label: "Hello 6", prix: 0.99, description: "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page.", pic: require("../../img/no-img.jpg")},
        ];
        return (
            <View>
                {/* <StatusBar translucent={true} backgroundColor={'transparent'} barStyle="light-content"/> */}
                <Header navigation={ this.props }/>
                <Carousel data={data} HW={{MyDeviceWidth,MyDeviceHeight}}/>
                {/* { data.length > 0 ? 
                    <View style={{width: MyDeviceWidth, height: MyDeviceHeight,}}>
                        <ScrollView style={{flex: 1}}>
                        {
                            data.map((item, index) => (
                                <TouchableOpacity key={index} onPress={() => this.productSelected(item)}>
                                    <View style={{alignItems: "center", justifyContent: "center", marginTop: 20, marginBottom: 20}}>
                                        <ImageBackground style={{width: (MyDeviceWidth * .9), height: (MyDeviceHeight * .9),}} source={item.pic}>

                                            <View style={{width: (MyDeviceWidth * .9), position: "absolute", padding: 40, top: 0}}>
                                                <Text style={{fontSize: 35, fontWeight: "bold"}}>{item.label}</Text>
                                                <Text style={{width: ((MyDeviceWidth * .9) * 0.25), fontSize: 20}}>{item.description}</Text>
                                            </View>
                                            <View style={{width: (MyDeviceWidth * .9), position: "absolute", padding: 10, bottom: 0, left: (MyDeviceWidth * .6)}}>
                                                <ImageBackground style={{width: DeviceInfo.isTablet() ? 300 : 50, height: DeviceInfo.isTablet() ? 250 : 20, alignItems: "center", justifyContent: "center"}} source={require('../../img/price-tag.png')}>
                                                    <Text style={{fontSize: 60, fontWeight: "bold"}}>{item.prix}</Text>
                                                </ImageBackground>
                                            </View>
                                        </ImageBackground>
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                        </ScrollView>
                    </View>
                :
                    null
                } */}
            </View>
        )
    }
}

