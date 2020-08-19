import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'iScreen.db' });

const TABLE_NAME = "categories";
const COLUMN_ID = "id";
const COLUMN_Ref = "ref";
const COLUMN_Label = "label";
const COLUMN_Description = "description";
const COLUMN_Price = "price";
const COLUMN_Price_ttc = "price_ttc";


const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," +
    COLUMN_Ref + " VARCHAR(255)," +
    COLUMN_Label + " VARCHAR(255)," +
    COLUMN_Description + "description VARCHAR(255)," +
    COLUMN_Price + " VARCHAR(255)," +
    COLUMN_Price_ttc + " VARCHAR(255)" +
")";



export default class ProduitsManager extends Component {
    //Create
    async CREATE_TABLE(){
        console.log("##### CREATE_TABLE #########################");

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
    async INSERT(data_){
        console.log("inserting.... ", data_.length);
        await db.transaction(async (tx) => {

            let insert = "INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+") VALUE (NULL)";
            for(let x = 0; x < data_.length; x++){
                await tx.executeSql(insert);
            }
        });
    }

    async INSERT_(data_){
        console.log("##### INSERT_ #########################");

        console.log("inserting.... ", data_.length);
        return await new Promise(async (resolve) => {
            try{
                await db.transaction(async (tx) => {
                    for(let x = 0; x < data_.length; x++){
                        const insert = "INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+", "+COLUMN_Ref+", "+COLUMN_Label+", "+COLUMN_Description+", "+COLUMN_Price+", "+COLUMN_Price_ttc+") VALUE (NULL, "+data_[x].ref+", "+data_[x].label+", "+data_[x].description+", "+data_[x].price+", "+data_[x].price_tcc+")";
                        await tx.executeSql(insert, []);
                    }
                    return resolve(true);
                });
            } catch(error){
                return resolve(false);
            }
        });
    }

    //Get by id
    async GET_BY_ID(id){
        console.log("##### GET_BY_ID #########################");

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
    async GET_LIST(){
        console.log("##### GET_LIST[Products] #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT * FROM " + TABLE_NAME, []).then(async (tx, result) => {
                    console.log('Query completed, found ' + result.rows.length + ' rows');
                    
                    let categories = [];
                    let size = result.rows.length;
                    for(let x = 0; x < size; x++){
                        let row = result.rows.item(x);
                        console.log("row : ", row);
                        categories.push(row);
                    }
                    console.log('categories : ', categories);
                    await resolve(categories);
                });
            }).then(async (result) => {
                console.error('result : ', result);
                await resolve([]);
            });
        });
    }

    //Delete
    async DELETE_LIST(){
        console.log("##### DELETE_LIST #########################");

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
