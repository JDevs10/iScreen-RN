import React, { Component } from 'react'
import CategoriesManager from '../Database/CategoriesManager'
import ProduitsManager from '../Database/ProduitsManager'
import {StatusBar, StyleSheet, ScrollView, TouchableOpacity, View, Text, TextInput, FlatList, Image, Dimensions, Alert, ImageBackground} from  'react-native';
import { Card, Button } from 'react-native-elements'
import DeviceInfo from 'react-native-device-info'

import Carousel from './customs/Carousel';
import Header from './Header/Header';


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
            data: [],
            orientation: isPortrait() ? 'portrait' : 'landscape',
        };
        
        // Event Listener for orientation changes
        Dimensions.addEventListener('change', () => {
          this.setState({
            orientation: isPortrait() ? 'portrait' : 'landscape'
          });
        });
    }

    async componentDidMount(){
        await this.getData();
    }

    async getData(){
        this.setState({notif: "Chargement des données...."})
        const produitsManager = new ProduitsManager();
        await produitsManager.initDB();
        await produitsManager.GET_LIST_LIMIT(10).then(async (data_) => {
            console.log('produitsManager.GET_LIST_LIMIT(10) : ');
            console.log(data_.length);
            this.setState({
                data: data_
            });
        });
    }

    componentWillUnmount(){
        this.setState({
            notif: "componentWillUnmount....",
            data: []
        });
    }

    render() {
        const MyDeviceWidth = Dimensions.get('window').width;
        const MyDeviceHeight = Dimensions.get('window').height;
        const data = [
            {label: "Hello 1", price: 0.99, description: "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page.", image: require("../../img/no-img.jpg")},
            {label: "Hello 2", price: 0.99, description: "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page.", image: require("../../img/loading-gif.gif")},
            {label: "Hello 3", price: 0.99, description: "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page.", image: require("../../img/no-img.jpg")},
            {label: "Hello 4", price: 0.99, description: "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page.", image: require("../../img/no-img.jpg")},
            {label: "Hello 5", price: 0.99, description: "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page.", image: require("../../img/no-img.jpg")},
            {label: "Hello 6", price: 0.99, description: "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page.", image: require("../../img/no-img.jpg")},
        ];

        return (
            <View>
                {/* <StatusBar translucent={true} backgroundColor={'transparent'} barStyle="light-content"/> */}
                <Header navigation={ this.props } />
                { this.state.data.length > 0 ? null : <Text>{this.state.notif}</Text> }
                { this.state.data.length > 0 ? 
                    <Carousel data={this.state.data} HW={{MyDeviceWidth: MyDeviceWidth, MyDeviceHeight: (MyDeviceHeight-50)}}/>
                :
                    null
                }
            </View>
        )
    }
}

