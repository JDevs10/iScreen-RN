//import liraries
import React, { Component } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, Platform, AsyncStorage } from 'react-native';
import DeviceInfo from 'react-native-device-info';

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

                    //navigate to download
                    const token_ = {
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
                    await resolve(false);
                }
            }).catch(async (error) => {
                // handle error
                console.log('error 1 : ');
                console.log(error);
                console.log( error.response.request._response);
                await resolve(false);
            });
        });

        if(result){
            this.props.navigation.navigate('download');
        }
        
    }

}


//make this component available to the app
export default UserServices;