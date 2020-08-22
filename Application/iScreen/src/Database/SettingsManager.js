import React, { Component } from 'react'
import { Text, View } from 'react-native'
import SQLite from 'react-native-sqlite-storage'
SQLite.DEBUG(true);
SQLite.enablePromise(true);

let db;

const DATABASE_NAME = "iScreen.db";
const DATABASE_VERSION = "1.0";
const DATABASE_DISPLAY_NAME = "iScreen_db";
const DATABASE_SIZE = "200000";

const TABLE_NAME = "settings";
const COLUMN_ID = "id";
const COLUMN_autoPlay = "autoPlay";
const COLUMN_isShowTittle = "isShowTittle";
const COLUMN_isShowDescription = "isShowDescription";
const COLUMN_isShowPrice = "isShowPrice";
const COLUMN_Speed = "speed";
const COLUMN_Server = "server";
const COLUMN_Key = "key";
const COLUMN_ModifyDate = "modifyDate";


const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," +
    COLUMN_autoPlay + " INT(2)," +
    COLUMN_isShowTittle + " INT(2)," +
    COLUMN_isShowDescription + " INT(2)," +
    COLUMN_isShowPrice + " INT(2)," +
    COLUMN_Speed + " INT(200)," +
    COLUMN_Server + " VARCHAR(255)," +
    COLUMN_Key + " VARCHAR(255)," +
    COLUMN_ModifyDate + " INT(255)"+
")";


export default class SettingsManager extends Component {
    async initDB() {
        return await new Promise(async (resolve) => {
          console.log("Plugin integrity check ...");
          await SQLite.echoTest()
            .then(async() => {
                console.log("Integrity check passed ...");
                console.log("Opening database ...");
                await SQLite.openDatabase(
                    DATABASE_NAME,
                    DATABASE_VERSION,
                    DATABASE_DISPLAY_NAME,
                    DATABASE_SIZE
                )
                .then(async DB => {
                    db = DB;
                    console.log("Database OPEN");
                    await resolve(db);
                })
                .catch(async error => {
                    console.log(error);
                });
            })
            .catch(async error => {
              console.log("echoTest failed - plugin not functional");
            });
        });
    };

    async closeDatabase(db) {
        if (db) {
            console.log("Closing DB");
            await db.close()
            .then(async status => {
              console.log("Database CLOSED");
            })
            .catch(async error => {
              await this.errorCB(error);
            });
        } else {
          console.log("Database was not OPENED");
        }
    };


    //Create
    async CREATE_SETTINGS_TABLE(){
        console.log("##### CREATE_SETTINGS_TABLE #########################");
        return await new Promise(async (resolve) => {
            try{
                await db.transaction(async function (txn) {
                    await txn.executeSql('DROP TABLE IF EXISTS ' + TABLE_NAME, []);
                    console.log("table '"+TABLE_NAME+"' Dropped!");
                });
                await db.transaction(async function (txn) {
                    await txn.executeSql(create, []);
                    console.log("table '"+TABLE_NAME+"' Created!");
                });
                return await resolve(true);
            } catch(error){
                return await resolve(false);
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
                    await tx.executeSql("INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+", "+COLUMN_autoPlay+", "+COLUMN_isShowTittle+", "+COLUMN_isShowDescription+", "+COLUMN_isShowPrice+", "+COLUMN_Speed+", "+COLUMN_Server+", "+COLUMN_Key+", "+COLUMN_ModifyDate+") VALUES (1, "+(data_.autoPlay ? 1 : 0)+", "+(data_.showTittle ? 1 : 0)+", "+(data_.showDescription ? 1 : 0)+", "+(data_.showPrice ? 1 : 0)+", "+data_.speed+", '"+data_.server+"', '"+data_.key+"', "+data_.modifyDate+")");
                });
                return await resolve(true);
            } catch(error){
                return await resolve(false);
            }
        });
    }

    //Get by id
    async GET_SETTINGS_BY_ID(id){
        console.log("##### GET_SETTINGS_BY_ID #########################");

        return await new Promise(async (resolve) => {
            let settings = {};
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT s."+COLUMN_ID+", s."+COLUMN_autoPlay+", s."+COLUMN_isShowTittle+", s."+COLUMN_isShowDescription+", s."+COLUMN_isShowPrice+ ", s."+COLUMN_Speed+" ,s."+COLUMN_Server+", s."+COLUMN_Key+", s."+COLUMN_ModifyDate+" FROM "+TABLE_NAME+" s WHERE s."+COLUMN_ID+" = "+id, []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        const {autoPlay, isShowTittle, isShowDescription, isShowPrice, speed, server, key, modifyDate} = row;
                        settings = {
                            autoPlay: (autoPlay == 1 ? true : false), 
                            isShowTittle: (isShowTittle == 1 ? true : false), 
                            isShowDescription: (isShowDescription == 1 ? true : false), 
                            isShowPrice: (isShowPrice == 1 ? true : false), 
                            speed: speed, 
                            server: server, 
                            key: key,
                            modifyDate: modifyDate
                        };
                    }
                    console.log('settings: ', settings);
                    await resolve(settings);
                });
            }).then(async (result) => {
                await this.closeDatabase(db);
            }).catch(async (err) => {
                console.log(err);
                // await resolve({});
            });
        });
    }

    // get all
    async GET_SETTINGS_LIST(){
        console.log("##### GET_SETTINGS_LIST #########################");

        return await new Promise(async (resolve) => {
            const settings = [];
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT s."+COLUMN_ID+", s."+COLUMN_autoPlay+", s."+COLUMN_isShowTittle+", s."+COLUMN_isShowDescription+", s."+COLUMN_isShowPrice+ ", s."+COLUMN_Speed+" ,s."+COLUMN_Server+", s."+COLUMN_Key+" FROM " + TABLE_NAME +" s", []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        const {autoPlay, isShowTittle, isShowDescription, isShowPrice, speed, server, key, modifyDate} = row;
                        settings.push({
                            autoPlay: (autoPlay == 1 ? true : false), 
                            isShowTittle: (isShowTittle == 1 ? true : false), 
                            isShowDescription: (isShowDescription == 1 ? true : false), 
                            isShowPrice: (isShowPrice == 1 ? true : false), 
                            speed: speed, 
                            server: server, 
                            key: key,
                            modifyDate: modifyDate
                        });
                    }
                    console.log(settings);
                    await resolve(settings);
                });
            }).then(async (result) => {
                await this.closeDatabase(db);
            }).catch(async (err) => {
                console.log(err);
            });
        });
    }

    async CHECK_DATA(){        
        console.log("##### CHECK_DATA #########################");
        return await new Promise(async (resolve) => {
            let check = '';
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT (CASE WHEN (SELECT COUNT(*) as res FROM sqlite_master WHERE type='table' AND name='"+TABLE_NAME+"') > 0 THEN 'true' ELSE 'false' END) as res", []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    let row = results.rows.item(0);
                    console.log('results.row: ', row);
                    if(row.res == 'true'){
                        check = true;
                    }else if (row.res == 'false'){
                        check = false;
                    }else{
                        check = false;
                    }
                    await resolve(check);
                });
            }).then(async (result) => {
                await this.closeDatabase(db);
            }).catch(async (err) => {
                console.log(err);
                await resolve(false);
            });
        });
    }

    //Update
    async UPDATE_SETTINGS_BY_ID(data_){
        console.log("##### UPDATE_SETTINGS_BY_ID #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("UPDATE " + TABLE_NAME + " SET "+COLUMN_autoPlay+" = "+data_.autoPlay+", "+COLUMN_isShowTittle+" = "+data_.showTittle+", "+COLUMN_isShowDescription+" = "+data_.showDescription+", "+COLUMN_isShowPrice+ " = "+data_.showPrice+", "+COLUMN_Speed+" = "+data_.speed+", "+COLUMN_Server+" = "+data_.server+", "+COLUMN_Key+" = "+data_.key+", "+COLUMN_ModifyDate+" = "+data_.modifyDate+" WHERE " + COLUMN_ID + " = " + data_.id, []);
            });
            return await resolve(true);
        });
    }

    //Delete
    async DELETE_SERVER_LIST(){
        console.log("##### DELETE_SERVER_LIST #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("DELETE FROM " + TABLE_NAME, []);
            });
            return await resolve(true);
        });
    }

    //Delete
    async DROP_SERVER(){
        console.log("##### DELETE_SERVER_LIST #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async function (txn) {
                await txn.executeSql('DROP TABLE IF EXISTS ' + TABLE_NAME, []);
                console.log("table '"+TABLE_NAME+"' Dropped!");
            });
            return await resolve(true);
        });
    }
}
