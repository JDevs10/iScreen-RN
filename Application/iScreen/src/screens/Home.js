import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import CategoriesManager from '../Database/CategoriesManager'
import ProduitsManager from '../Database/ProduitsManager'

import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'iScreen.db' });

export default class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            notif: '....',
        };
    }

    async componentDidMount(){
        /*
        const cm = new CategoriesManager();
        const pm = new ProduitsManager();
        const cm_ = await cm.GET_LIST().then(async (val) => {
            console.log('val', val);
            return val;
        });
        const pm_ = await pm.GET_LIST().then(async (val) => {
            console.log('val', val);
            return val;
        });
        */
        /*
        db.transaction(async (tx) => {
            tx.executeSql('SELECT * FROM categories', [], async (tx, results) => {
                const rows = results.rows;
                let categories = [];

                console.log('Query completed, found ' + rows.length + ' rows');

                for (let i = 0; i < rows.length; i++) {
                    console.log("row : ", rows.item(x));
                    categories.push(rows.item(x));
                }

                this.setState({
                    notif: 'nbr '+categories.length+' Categories'
                });
            });
        });
        */

        let selectQuery = await new Promise((resolve, reject) => {
            db.transaction((trans) => {
                trans.executeSql('SELECT * FROM categories', [], (trans, results) => {
                    resolve(results);

                },(error) => {
                    reject(error);
                });
            });
        });

        console.log('selectQuery: ', selectQuery);

        /*
        var rows = selectQuery.rows;
        for (let i = 0; i < rows.length; i++) {
            var item = rows.item(i);
            console.log(item);
        }
        */

    }


    render() {
        return (
            <View>
                <Text> Notify : {this.state.notif} </Text>
            </View>
        )
    }
}

