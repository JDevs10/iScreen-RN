import React, { Component } from 'react'
import { Text, View } from 'react-native'
import axios from 'axios';
import RNBackgroundDownloader from 'react-native-background-downloader';
import ProduitsManager from '../Database/ProduitsManager';

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
        const produitsManager = new ProduitsManager();
        await produitsManager.initDB();
        await produitsManager.CREATE_TABLE();
    
        //const token = await AsyncStorage.getItem('token');
        console.log('ProduitsManager', 'getAllProduitsImagesFromServer()');
        console.log('token', token);
        
        
        //get image from server
        let result = "";
        var RNFS = require('react-native-fs');
        const ImagesPath = RNFS.DocumentDirectoryPath + '/iScreen/produits/images/';
        console.log('ImagesPath : ', ImagesPath);
        console.log('======>  file://' + RNFS.DocumentDirectoryPath + '/iScreen/produits/images/my.png')
        
        await RNFS.unlink(ImagesPath)
            .then(async () => {
                console.log('OLD Repertory deleted');
            })
            .catch((err) => {
                console.log(err.message);
            });
        await RNFS.mkdir(ImagesPath).then(async (success) => {
            let lg = this.state.RefData.length;
            for (let i = 0; i < lg; i++) {
                console.log(`url => ${token.server}/api/ryimg/product_v2.php?server=${token.server}&DOLAPIKEY=${token.token}&modulepart=product&ref=${this.state.RefData[i].ref}`);

                RNBackgroundDownloader.download({
                    id: String(i),
                    url: `${token.server}/api/ryimg/product_v2.php?server=${token.server}&DOLAPIKEY=${token.token}&modulepart=product&ref=${this.state.RefData[i].ref}`,
                    destination: `${RNFS.DocumentDirectoryPath}/iScreen/produits/images/${this.state.RefData[i].ref}.jpg`,
                    headers: {
                        DOLAPIKEY: token.token,
                        Accept: 'application/json',
                    }
                }).begin(async (expectedBytes) => {
                    console.log(`Going to download ${expectedBytes} bytes!`);

                    if (expectedBytes <= 100) {
                        console.log('Image : ' + i + ' - ' + this.state.RefData[i].ref + ' <= EMPTY [WILL BE DELETED]');
                        await RNFS.unlink(RNFS.DocumentDirectoryPath + '/iScreen/produits/images/' + this.state.RefData[i].ref + '.jpg');
                    }
                }).done(async () => {
                    console.log(`${RNFS.DocumentDirectoryPath}/iScreen/produits/images/${this.state.RefData[i].ref}.jpg`);
                    result = `${RNFS.DocumentDirectoryPath}/iScreen/produits/images/${this.state.RefData[i].ref}.jpg`;
                    console.log('Image : ' + i + ' - ' + this.state.RefData[i].ref + ' => DOWNLOADED');
                }).error(async (error) => {
                    console.log('error');
                    if ((lg - 1) === i) {
                        console.log('telechargement complet');
                        this.props.navigation.navigate('Dashboard');
                    }
                });
            }
        });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

        
        // require the module
        // var RNFS = require('react-native-fs');
        // var path = RNFS.DocumentDirectoryPath + '/iScreen/test____.txt';

        // console.log('FILE WRITTEN! => ', RNFS.CachesDirectoryPath);
        // console.log('FILE WRITTEN! => ', RNFS.DocumentDirectoryPath);
        // console.log('FILE WRITTEN! => ', RNFS.DownloadDirectoryPath);
        // console.log('FILE WRITTEN! => ', RNFS.ExternalDirectoryPath);
        // console.log('FILE WRITTEN! => ', RNFS.ExternalStorageDirectoryPath);
        // console.log('FILE WRITTEN! => ', RNFS.ExternalCachesDirectoryPath);

        // // write the file
        // await RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
        //     .then(async (success) => {
        //         console.log('FILE WRITTEN! at => ', path);
        //     })
        //     .catch(async (err) => {
        //         console.log(err.message);
        // });

        
        const list___ = await RNFS.readDir(RNFS.DocumentDirectoryPath + "/iScreen/produits/images") // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
        .then(async (result) => {
            console.log('GOT RESULT : ', result);

            // let dossier;
            // for(let x = 0; x < result.length; x++){
            //     if(result[x].name == "iScreen"){
            //         dossier = result[x];
            //     }
            // }

            // stat the first file
            return await result;
        })
        .then(async (statResult) => {
            console.log('GOT statResult :', statResult[0]);

            if (statResult[0].isFile()) {
                // if we have a file, read it
                return await RNFS.readFile(statResult[0].path, 'utf8');
            }

            return await 'no file';
        })
        .then(async (contents) => {
            // log the file contents
            console.log('contents : ', contents);
            return await contents;
        })
        .catch(async (err) => {
            console.log(err.message, err.code);
        });

        console.log('list___ : ', list___);

        return await result;
    }
}
