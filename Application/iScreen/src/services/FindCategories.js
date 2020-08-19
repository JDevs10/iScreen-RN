import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import axios from 'axios';
import CategoriesManager from '../Database/CategoriesManager';
import Database from '../Database/Database';

export default class FindCategories extends Component {
  constructor(props) {
    super(props);
  }

  async getAllCategoriesFromServer(token){
    const categoriesManager = new CategoriesManager();
    categoriesManager.CREATE_TABLE();

    //const token = await AsyncStorage.getItem('token');
    console.log('FindCategories', 'getAllCategoriesFromServer()');
    console.log('token', token);

    let i_ = 0;
    let ind = 0;

    return await new Promise(async (resolve)=> {
      while(i_ < 10){
        await axios.get(`${token.server}/api/index.php/categories?sortfield=t.rowid&sortorder=ASC&limit=50&page=${i_}`, 
            { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
        .then(async (response) => {
            if(response.status == 200){
                console.log('Status == 200');
                console.log(response.data);

                await categoriesManager.initDB();
                const res = await categoriesManager.INSERT_(response.data);
                if(res){
                  i_++;
                  console.log('xxxx');
                }
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
      }
    });
  }

}