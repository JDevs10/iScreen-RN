import React, { Component } from 'react'
import { Text, View, AsyncStorage } from 'react-native'
import axios from 'axios';
import RNBackgroundDownloader from 'react-native-background-downloader';
import ProduitsManager from '../Database/ProduitsManager';

const RNFS = require('react-native-fs');
const IMAGE_PATH = RNFS.DocumentDirectoryPath + '/iScreen/produits/images';
const PREFIX = "jpg";

export default class FindImages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            RefData: [
                {ref: "PRO-9999999"}
            ]
        }
    }

    async getAllProduitsImagesFromServer(token){
        let result = false;
        const produitsManager = new ProduitsManager();
        await produitsManager.initDB();
        
        // get a list of products
        const productList = await produitsManager.GET_LIST().then(async (value) => {
            return await value;
        });
        console.log("productList => "+productList.length);
        
        if(productList.length > 0){
            // get image from server
            // and save on devices then update image file location in db
            
            console.log('IMAGE_PATH : ', IMAGE_PATH);
            
            await RNFS.unlink(IMAGE_PATH)
                .then(async () => {
                    console.log('OLD Repertory deleted');
                })
                .catch(async (err) => {
                    console.log(err.message);
                });
            await RNFS.mkdir(IMAGE_PATH).then(async (success) => {
                let lg = productList.length;
                for (let i = (lg-20); i < lg; i++) {
                    let expectedBytes__ = 0;
                    console.log(`url => ${token.server}/api/ryimg/product_v2.php?server=${token.server}&DOLAPIKEY=${token.token}&modulepart=product&ref=${productList[i].ref}`);

                    await RNBackgroundDownloader.download({
                        id: String(i),
                        url: `${token.server}/api/ryimg/product_v2.php?server=${token.server}&DOLAPIKEY=${token.token}&modulepart=product&ref=${productList[i].ref}`,
                        destination: `${IMAGE_PATH}/${productList[i].ref}.${PREFIX}`,
                        headers: {
                            DOLAPIKEY: token.token,
                            Accept: 'application/json',
                        }
                    }).begin(async (expectedBytes) => {
                        expectedBytes__ = expectedBytes;
                        console.log(`Going to download ${expectedBytes} bytes!`);

                        if (expectedBytes <= 20) {
                            console.log('Image : ' + i + ' - ' + productList[i].ref + ' => EMPTY [WILL BE DELETED]');
                            await RNFS.unlink(IMAGE_PATH+'/' + productList[i].ref + '.${PREFIX}');
                        }
                    }).done(async () => {
                        productList[i].image = `${IMAGE_PATH}/${productList[i].ref}.${PREFIX}`;
                        console.log('Image : ' + i + ' - ' + productList[i].ref + ' => DOWNLOADED');
                        
                        // Update image path on device in db
                        const res = await produitsManager.UPDATE_IMAGE(productList[i]).then(async (value) => {
                            return await value;
                        });

                        console.log("i => " +(i+1) +" == "+lg);
                        if((i+1) == lg){
                            console.log("DOWNLOADS DONE P1!");
                            return await true;
                        }
                    }).error(async (error) => {
                        console.log('error => ', error);
                        if ((lg - 1) === i) {
                            result = true;
                            console.log('telechargement complet');
                            return await result;
                        }
                    });
                }
            });
        }

        return await result;
    }
}
