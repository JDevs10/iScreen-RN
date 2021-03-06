import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import axios from 'axios';
import CategoriesManager from '../Database/CategoriesManager';

export default class FindCategories extends Component {
  constructor(props) {
    super(props);
  }

  async getAllCategoriesFromServer(token){
    const categoriesManager = new CategoriesManager();
    await categoriesManager.initDB();
    await categoriesManager.CREATE_TABLE();

    //const token = await AsyncStorage.getItem('token');
    console.log('FindCategories', 'getAllCategoriesFromServer()');
    console.log('token', token);

    let i_ = 0;
    let ind = 0;

    return await new Promise(async (resolve)=> {
      while(i_ < 50){
        await axios.get(`${token.server}/api/index.php/categories?sortfield=t.rowid&sortorder=ASC&limit=50&page=${i_}`, 
            { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
        .then(async (response) => {
            if(response.status == 200){
                console.log('Status == 200');
                console.log(response.data);

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
            if ((error+"".indexOf("404") > -1) || (error.response.status === 404)) {
              console.log('zzzzz');
              ind += 1;
              if (ind == 1) {
                  i_ = 55; // equals higher than the loop
                  console.log('ind = '+ind);
                  return await resolve(true);
              }
              console.log('ind = 1 :: ind => '+ind);
              //return await resolve(false);
            }
            console.log('error.Error+"".indexOf("404") > -1 is different');
            //return await resolve(false);
        });
      }
    });
  }

}