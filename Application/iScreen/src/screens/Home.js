import React, { Component } from 'react'
import CategoriesManager from '../Database/CategoriesManager'
import ProduitsManager from '../Database/ProduitsManager'
import {StatusBar, StyleSheet, ScrollView, TouchableOpacity, View, Text, TextInput, FlatList, Image, Dimensions, Alert, ImageBackground} from  'react-native';
import { Card, Button } from 'react-native-elements'
import DeviceInfo from 'react-native-device-info'

import SettingsManager from '../Database/SettingsManager';
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
            settings: {},
            data: [],
            oldSettings: {},
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
        await this.settings();
        await this.getData();
        console.log('Back 1');
        this.listener = await this.props.navigation.addListener('focus', async () => {
            // Prevent default action
            await console.log('Back to Home screen!');
            await this.settings();
            await console.log('Done settings update!');
            console.log('new settings : ', this.state.settings);
            return;
        });
        console.log('Back 2');
    }

    async componentWillMount(){
        // await this.settings();r
        // await this.getData();
        await this.listener.remove();
    }

    async getData(){
        this.setState({notif: "Chargement des données...."})
        const produitsManager = new ProduitsManager();
        await produitsManager.initDB();
        await produitsManager.GET_LIST_LIMIT(30).then(async (data_) => {
            console.log('produitsManager.GET_LIST_LIMIT(30) : ');
            console.log(data_.length);
            this.setState({
                data: data_
            });
        });
    }

    async settings(){
        const sm = new SettingsManager()
        await sm.initDB();
        const _settings = await sm.GET_SETTINGS_BY_ID(1).then(async (val) => {
            return await val;
        });

        this.setState({
            settings: {
                autoPlay: _settings.autoPlay,
                showTittle: _settings.isShowTittle,
                showDescription: _settings.isShowDescription,
                showPrice: _settings.isShowPrice,
                speed: _settings.speed,
                server: _settings.server,
                key: _settings.key,
            }
        });
        console.log('Home | settings: ', this.state.settings);
    }

    async settings_(){
        const sm = new SettingsManager()
        await sm.initDB();
        const _settings = await sm.GET_SETTINGS_BY_ID(1).then(async (val) => {
            return await val;
        });
        console.log('Home | settings: ', _settings);
        return _settings
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
                {/* <Header navigation={ this.props } /> */}
                { this.state.data.length > 0 ? null : <Text>{this.state.notif}</Text> }
                { this.state.data.length > 0 ? 
                    <Carousel settings={this.state.settings} data={this.state.data} HW={{MyDeviceWidth: MyDeviceWidth, MyDeviceHeight: (MyDeviceHeight-50)}}/>
                :
                    null
                }
            </View>
        )
    }
}

