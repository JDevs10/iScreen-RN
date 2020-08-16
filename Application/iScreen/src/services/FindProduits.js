import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import axios from 'axios';
import ProduitsManager from '../Database/ProduitsManager';

export default class FindProduits extends Component {
    constructor(props) {
        super(props);
      }
    

      async getAllProduitsFromServer(token){
        const produitsManager = new ProduitsManager();
        produitsManager.CREATE_TABLE();
    
        //const token = await AsyncStorage.getItem('token');
        console.log('ProduitsManager', 'getAllProduitsFromServer()');
        console.log('token', token);
        
        let i_ = 0;
        let ind = 0;
    
        return await new Promise(async (resolve)=> {
          while(i_ < 600){
            console.log(`${token.server}/api/index.php/products?sortfield=t.rowid&sortorder=ASC&limit=50&page=${i_}&DOLAPIKEY=${token.token}`);
            await axios.get(`${token.server}/api/index.php/products?sortfield=t.rowid&sortorder=ASC&limit=50&page=${i_}`, 
                { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
            .then(async (response) => {
                if(response.status == 200){
                    console.log('Status == 200');
                    console.log(response.data);
    
                    produitsManager.INSERT_(response.data);
                    i_++;
                }else{
                    console.log('Status != 200');
                    console.log(response.data);
                }
    
            }).catch(async (error) => {
                // handle error
                console.log('error : ', error);
                if ((error.Error+"".indexOf("404") > -1) || (error.response.status === 404)) {
                  console.log('zzzzz');
                  ind += 1;
                  if (ind === 1) {
                      i_ = 11;
                      console.log('vvvvvvvvv');
                      await resolve(true);
                  }
                  await resolve(false);
                }
                await resolve(false);
            });
            console.log('index => ' + i_);
          }
        });
    }
}
