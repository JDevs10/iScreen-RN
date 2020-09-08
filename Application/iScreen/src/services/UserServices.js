//import liraries
import React, { Component } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, Platform, AsyncStorage } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import ServerManagement from '../Database/ServerManagement';
import SettingsManager from '../Database/SettingsManager';

// create a component
class UserServices extends Component {
    constructor(props){
        super(props);
    }

    async LogginIn(account, props){
        this.props = props;
        console.log('LogginIn');
        console.log(account);

        //find the selected company
        const sm = new ServerManagement();
        await sm.initDB();
        const server_list = await sm.GET_SERVER_LIST();

        for(let i = 0; i < server_list.length; i++){
            if(account.entreprise == server_list[i].name){
                account.serverUrl = server_list[i].url;
                break;
            }
        }

        
        

        //login
        const result = await new Promise(async (resolve) => {
            
            //navigate to download
            const token_ = {
                server: account.serverUrl,
                token: account.key
            };
            await AsyncStorage.setItem('token', JSON.stringify(token_));
            //const token__ = await AsyncStorage.getItem('token');
            console.log('token_ : ', token_);

            const sm = new SettingsManager();
            await sm.initDB();
            await sm.CREATE_SETTINGS_TABLE();
            const settings = {
                autoPlay: false, 
                showDescription: true, 
                showPrice: true, 
                showTittle: true, 
                key: token_.token, 
                server: token_.server, 
                speed: 2, 
                modifyDate: Date.now()
            };
            const res = await sm.INSERT_SETTINGS(settings).then(async (val) => {
                console.log('INSERT_SETTINGS => val: ', val);
                return await val;
            });

            await resolve(true);
        });

        if(result){
            this.props.navigation.navigate('download');
        }
        
    }

}


//make this component available to the app
export default UserServices;