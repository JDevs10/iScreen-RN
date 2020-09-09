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

            const RNFS = require('react-native-fs');
            // get a list of files and directories in the main bundle
            await RNFS.readDir(RNFS.DocumentDirectoryPath + '/iScreen/produits/images')
                .then((result) => {
                    const paths = [];

                    for(let index = 0; index < result.length; index++){
                        paths.push({uri: result[index].path});
                    }
                    console.log('GOT RESULT : ', paths);
            
                    // stat the first file
                    return paths;
                })
                .then((statResult) => {
                    console.log('GOT statResult : ', statResult.length);
                    
                    if(statResult.length > 0){
                        isChecked.push(true);
                    }else{
                        isChecked.push(false);
                    }
            
                    return 'no file';
                })
                .then((contents) => {
                    // log the file contents
                    console.log('NOT reading contents!');
                })
                .catch((err) => {
                    console.log(err.message, err.code);
                });

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
