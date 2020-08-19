//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'iStock.db' });

const TABLE_NAME = "servers";
const COLUMN_ID = "id";
const COLUMN_NAME = "name";
const COLUMN_URL = "url";

const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," +
    COLUMN_NAME + " VARCHAR(255)," +
    COLUMN_URL + " VARCHAR(255)" +
")";


// create a component
class ServerManagement extends Component {

    //Create
    async CREATE_SERVER_TABLE(){
        console.log("##### CREATE_SERVER_TABLE #########################");

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

    //Insert an obj
    async INSERT_SERVER_O(data_){
        console.log("##### INSERT_SERVER - Obj #########################");

        console.log("inserting.... ", data_);
        return await new Promise(async (resolve) => {
            try{
                await db.transaction(async (tx) => {
                    await tx.executeSql("INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+", "+COLUMN_NAME+", "+COLUMN_URL+") VALUE (NULL, "+data_.name+", "+data_.url+")");
                    return resolve(true);
                });
            } catch(error){
                return resolve(false);
            }
        });
    }

    //Insert a list
    async INSERT_SERVER_L(data_){
        console.log("##### INSERT_SERVER - List #########################");

        console.log("inserting.... ", data_.length);
        return await new Promise(async (resolve) => {
            try{
                await db.transaction(async (tx) => {
                    let check = 0;
                    for(let x = 0; x < data_.length; x++){
                        await tx.executeSql("INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+", "+COLUMN_NAME+", "+COLUMN_URL+") VALUE (NULL, "+data_[x].name+", "+data_[x].url+")");
                        check++;
                    }

                    if(check == data_.length){
                        return resolve(true);
                    }
                    return resolve(true);
                });
            } catch(error){
                return resolve(false);
            }
        });
    }

    //Get by id
    async GET_SERVER_BY_ID(id){
        console.log("##### GET_SERVER_BY_ID #########################");

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
    async GET_SERVER_LIST(){
        console.log("##### GET_SERVER_LIST #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT * FROM " + TABLE_NAME, []).then(async (tx, result) => {
                    console.log('Query completed, found ' + result.rows.length + ' rows');
                    
                    let servers = [];
                    let size = result.rows.length;
                    for(let x = 0; x < size; x++){
                        let row = result.rows.item(x);
                        console.log("ID : ", row);
                        servers.push(row);
                    }
                    console.log('servers : ', servers);
                    resolve(servers);
                });
            }).then(async (result) => {
                console.error('result : ', result);
                resolve([]);
            });
        });

    }

    //Update
    async UPDATE_SERVER_BY_ID(data_){
        console.log("##### UPDATE_SERVER_BY_ID #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("UPDATE " + TABLE_NAME + " SET " + COLUMN_NAME + " = "+data_.name+", "+COLUMN_URL+" = "+data_.url+" WHERE " + COLUMN_ID + " = " + data_.id, []);
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

//make this component available to the app
export default ServerManagement;