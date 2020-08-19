import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'iScreen.db' });

const TABLE_NAME = "settings";
const COLUMN_ID = "id";
const COLUMN_Produit_Aleatoir = "p_aleatoir";
const COLUMN_Aleatoir_Category = "a_category";
const COLUMN_Category_X = "category_x";
const COLUMN_Produit_Recente = "p_recente";

const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," +
    COLUMN_Produit_Aleatoir + " INT(2)," +
    COLUMN_Aleatoir_Category + " INT(2)," +
    COLUMN_Category_X + " INT(2)," +
    COLUMN_Produit_Recente + " INT(2)" +
")";


export default class SettingsManager extends Component {

    //Create
    async CREATE_SETTINGS_TABLE(){
        console.log("##### CREATE_SETTINGS_TABLE #########################");

        return await new Promise(async (resolve) => {
            try{
                await db.transaction(async function (txn) {
                    await txn.executeSql('DROP TABLE IF EXISTS ' + TABLE_NAME, []);
                    await txn.executeSql(
                        create,
                        []
                    );
                    console.log("table '"+TABLE_NAME+"' Created/Existe ");
                    return resolve(true);
                });
            } catch(error){
                return resolve(false);
            }
        });
    }

    //Insert
    async INSERT_SETTINGS(data_){
        console.log("##### INSERT_SETTINGS #########################");

        console.log("inserting.... ", data_);
        return await new Promise(async (resolve) => {
            try{
                await db.transaction(async (tx) => {
                    await tx.executeSql("INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+", "+COLUMN_Produit_Aleatoir+", "+COLUMN_Aleatoir_Category+", "+COLUMN_Category_X+", "+COLUMN_Produit_Recente+") VALUE (NULL, "+data_.p_aleatoir+", "+data_.a_cateroty+", "+data_.category_x+", "+data_.p_recente+")");
                    return resolve(true);
                });
            } catch(error){
                return resolve(false);
            }
        });
    }

    //Get by id
    async GET_SETTINGS_BY_ID(id){
        console.log("##### GET_SETTINGS_BY_ID #########################");

        return await new Promise(async (resolve) => {
            try{
                await db.transaction(async (tx) => {
                    await tx.executeSql("SELECT * FROM " + TABLE_NAME + " WHERE " + COLUMN_ID + " = " + id, [], async (tx, results) => {
                        var temp = {};
                        temp = results.rows.item(i);
                        return resolve(temp);                           
                    });
                });
            } catch(error){
                return resolve(false);
            }
        });
    }

    // get all
    async GET_SETTINGS_LIST(){
        console.log("##### GET_SETTINGS_LIST #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT * FROM " + TABLE_NAME, []).then(async (tx, result) => {
                    console.log('Query completed, found ' + result.rows.length + ' rows');
                    
                    let settings = [];
                    let size = result.rows.length;
                    for(let x = 0; x < size; x++){
                        let row = result.rows.item(x);
                        console.log("ID : ", row);
                        settings.push(row);
                    }
                    console.log('settings : ', settings);
                    resolve(settings);
                });
            }).then(async (result) => {
                console.error('result : ', result);
                resolve([]);
            });
        });
    }

    //Update
    async UPDATE_SETTINGS_BY_ID(data_){
        console.log("##### UPDATE_SETTINGS_BY_ID #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("UPDATE " + TABLE_NAME + " SET "+COLUMN_Produit_Aleatoir+" = "+data_.p_aleatoir+", "+COLUMN_Aleatoir_Category+" = "+data_.a_cateroty+", "+COLUMN_Category_X+" = "+data_.category_x+", "+COLUMN_Produit_Recente+" = "+data_.p_recente+" WHERE " + COLUMN_ID + " = " + data_.id, []);
                resolve(true);

            }).then(async (result) => {
                console.error('result : ', result);
                resolve(false);
            });
        });
    }

    //Delete
    async DELETE_SERVER_LIST(){
        console.log("##### DELETE_SERVER_LIST #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("DELETE FROM " + TABLE_NAME, []);
                resolve(true);

            }).then(async (result) => {
                console.error('result : ', result);
                resolve(false);
            });
        });
    }
}
