import React, { Component } from 'react'
import { View, Text, StyleSheet, Platform, AsyncStorage, Alert } from 'react-native'
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import SettingsManagement from '../Database/SettingsManager';

export default class SettingsServices extends Component {
    constructor(props){
        super(props);
    }

    async LogginIn(account, props){
        this.props = props;
        console.log('LogginIn');
        console.log(account);

        //find the selected company
        const servers_ = await AsyncStorage.getItem('server_list');
        console.log('server_list : ', servers_);

        const server = JSON.parse(servers_);
        for(let i = 0; i < server.length; i++){
            if(account.entreprise == server[i].name){
                account.serverUrl = server[i].url;
                break;
            }
        }

        // console.log('end: ', account);

        //login
        const result = await new Promise(async (resolve) => {
            await axios.post(`${account.serverUrl}/api/index.php/login`, 
            {
                login: account.identifiant,
                password: account.password
            }, 
            { headers: { 'Accept': 'application/json' } })
        .then(async (response) => {
            if(response.status == 200){
                console.log('Status == 200');
                // console.log(response.data);
                account.key = response.data.success.token;
                
                await axios.post(`${account.serverUrl}/api/index.php/istockapi/login`, 
                    {
                        login: account.identifiant,
                        password: account.password
                    }, 
                    { headers: { 'DOLAPIKEY': account.key, 'Accept': 'application/json' } })
                .then(async (response) => {
                    if(response.status == 200){
                        console.log('Status == 200');
                        console.log(response.data);

                        //navigate to download
                        const token_ = {
                            userName: response.data.success.identifiant,
                            server: account.serverUrl,
                            token: account.key
                        };
                        await AsyncStorage.setItem('token', JSON.stringify(token_));
                        //const token__ = await AsyncStorage.getItem('token');
                        console.log('token_ : ', token_);

                        await resolve(true);
                    }else{
                        console.log('Status != 200');
                        console.log(response.data);
                    }
                }).catch(async (error) => {
                    // handle error
                    console.log('error 1 : ');
                    console.log(error);
                    console.log( error.response.request._response);
                });
                
            }else{
                console.log('Status != 200');
                console.log(response.data);
            }
        }).catch(async (error) => {
            // handle error
            console.log('error 1 : ');
            console.log(error);
            console.log( error.response.request._response);
        });
        });

        if(result){
            this.props.navigation.navigate('download');
        }
        
    }

    async Save(settings){
        return await new Promise(async (result) => {
            console.log('settings: ', settings);
            const sm = new SettingsManagement();
            await sm.initDB();
            // await sm.CREATE_SETTINGS_TABLE();
            // await sm.INSERT_SETTINGS(settings);
            // console.log('Settings saved!');
            await sm.DROP_SERVER();
            await result(true);
        });
    }

    async Save_v2(){
        let isConfig = false;
        console.log('Init app to module');
        console.log(account);

        axios.get(`${account.server}/api/index.php/iscreen/configuration/all`, 
            { headers: { 'DOLAPIKEY': account.key, 'Accept': 'application/json' } })
        .then(async (response) => {
            if(response.status == 200){
                console.log('Status == 200');

                const filtered_data = [];

                console.log("Data : ", response.data);
                for(let x=0; x < response.data.length; x++){
                    filtered_data[x] = {
                        p_aleatoir: response.data[x].p_aleatoir, 
                        a_category: response.data[x].a_category, 
                        category_x: response.data[x].category_x, 
                        p_recente: response.data[x].p_recente
                    };
                }

                console.log('filtered_data :');
                console.log(filtered_data);

                const settings = new SettingsManagement();
                const creation = await settings.CREATE_SETTINGS_TABLE();
                if(creation){
                    const res = await settings.INSERT_SETTINGS(filtered_data);
                }
                else{
                    alert("Echec a la sauvegarde des configurations.");
                    return;
                }

            }else{
                console.log('Status != 200');
                console.log(response.data);
                
            }
        }).catch(async (error) => {
            // handle error
            console.log('catch error : ', error);
        });
    }

}
