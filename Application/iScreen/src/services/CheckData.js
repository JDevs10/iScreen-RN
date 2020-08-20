import React, { Component } from 'react'
import { Text, View } from 'react-native'
import CategoriesManager from '../Database/CategoriesManager';
import ProduitsManager from '../Database/ProduitsManager';

export default class CheckData extends Component {
    
    async checkData(){
        return await new Promise(async (resolve) => {
            const isChecked = [];
            const categoriesManager = new CategoriesManager();
            await categoriesManager.initDB();
            const cm = await categoriesManager.GET_LIST();

            const produitsManager = new ProduitsManager();
            await produitsManager.initDB();
            const pm = await produitsManager.GET_LIST();

            console.log('cm size => ' + cm.length);
            console.log('pm size => ' + pm.length);

            if(cm.length > 0 ){
                isChecked.push(true);
            }else {
                isChecked.push(false);
            }
            if(pm.length > 0 ){
                isChecked.push(true);
            }else {
                isChecked.push(false);
            }

            let res = false;
            for(let x = 0; x < isChecked.length; x++){
                if(isChecked[x] == false){
                    res = false;
                    break;
                }
                res = true;
            }
            await resolve(res);
        });
    }
}
