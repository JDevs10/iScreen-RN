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


const TABLE_NAME = "products";
const COLUMN_ID = "id";
const COLUMN_Ref = "ref";
const COLUMN_Label = "label";
const COLUMN_Description = "description";
const COLUMN_Price = "price";
const COLUMN_Price_ttc = "price_ttc";
const COLUMN_Image = "image";


const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," +
    COLUMN_Ref + " VARCHAR(255)," +
    COLUMN_Label + " VARCHAR(255)," +
    COLUMN_Description + " VARCHAR(255)," +
    COLUMN_Price + " VARCHAR(255)," +
    COLUMN_Price_ttc + " VARCHAR(255)," +
    COLUMN_Image + " VARCHAR(255)" +
")";



export default class ProduitsManager extends Component {
    //Init database
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
                    /*
                    console.log("SQL => "+create);
                    await db.transaction(async(tx) => {
                        tx.executeSql(create);
                    }).then(async() => {
                        console.log("Table created successfully");
                    }).catch(async error => {
                        console.log(error);
                    });
                    */
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

    closeDatabase(db) {
        if (db) {
            console.log("Closing DB");
            db.close()
            .then(status => {
              console.log("Database CLOSED");
            })
            .catch(error => {
              this.errorCB(error);
            });
        } else {
          console.log("Database was not OPENED");
        }
    };


    //Create
    async CREATE_TABLE(){
        console.log("##### CREATE_TABLE #########################");

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
    async INSERT_(data_){
        console.log("##### INSERT_ #########################");
        console.log("inserting.... ", data_.length);
        return await new Promise(async (resolve) => {
            try{
                for(let x = 0; x < data_.length; x++){
                    await db.transaction(async (tx) => {
                        const ref = data_[x].ref;
                        const label = data_[x].label.replace(/'/g, "''");
                        const description = (data_[x].description.replace(/'/g, "''") == null ? '' : data_[x].description.replace(/'/g, "''"));
                        const price = data_[x].price;
                        const price_tcc = data_[x].price_tcc;
                        const image = "../../img/no-img.jpg";
                        const insert = "INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+", "+COLUMN_Ref+", "+COLUMN_Label+", "+COLUMN_Description+", "+COLUMN_Price+", "+COLUMN_Price_ttc+", "+COLUMN_Image+") VALUES (NULL, '"+ref+"', '"+label+"', '"+description+"', '"+price+"', '"+price_tcc+"', '"+image+"')";
                        await tx.executeSql(insert, []);
                    });
                }
                return await resolve(true);
            } catch(error){
                return await resolve(false);
            }
        });
    }

    //Get by id
    async GET_BY_ID(id){
        console.log("##### GET_BY_ID #########################");

        return await new Promise(async (resolve) => {
            let product = {};
            await db.transaction(async (tx) => {
                await tx.executeSql('SELECT p.id, p.ref, p.label, p.description, p.price, p.image FROM products p where p.id = '+id, []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    let row = results.rows.item(i);
                    console.log(`ID: ${row.id}, label: ${row.label}`)
                    product = row;
                    // console.log(products);
                    await resolve(product);
                });
            }).then(async (result) => {
                await this.closeDatabase(db);
            }).catch(async (err) => {
                console.log(err);
            });
        });
    }

    // get all
    async GET_LIST(){
        console.log("##### GET_LIST[Products] #########################");

        return await new Promise(async (resolve) => {
            const products = [];
            await db.transaction(async (tx) => {
                await tx.executeSql('SELECT p.id, p.ref, p.label, p.description, p.price, p.image FROM products p', []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        //console.log(`ID: ${row.id}, label: ${row.label}`)
                        const { id, ref, label, description, price, image } = row;
                        products.push({
                            id,
                            ref,
                            label,
                            description,
                            price,
                            image
                        });
                    }
                    // console.log(products);
                    await resolve(products);
                });
            }).then(async (result) => {
                await this.closeDatabase(db);
            }).catch(async (err) => {
                console.log('err: ', err);
                await resolve([]);
            });
        });
    }

    // get all
    async GET_LIST_LIMIT(limit){
        console.log("##### GET_LIST[Products] #########################");

        return await new Promise(async (resolve) => {
            const products = [];
            await db.transaction(async (tx) => {
                await tx.executeSql('SELECT p.id, p.ref, p.label, p.description, p.price, p.image FROM products p LIMIT '+limit, []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        //console.log(`ID: ${row.id}, label: ${row.label}`)
                        const { id, ref, label, description, price, image } = row;
                        products.push({
                            id,
                            ref,
                            label,
                            description,
                            price,
                            image
                        });
                    }
                    // console.log(products);
                    await resolve(products);
                });
            }).then(async (result) => {
                await this.closeDatabase(db);
            }).catch(async (err) => {
                console.log('err: ', err);
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
                return await resolve(true);

            }).then(async (result) => {
                console.error('result : ', result);
                return await resolve(false);
            });
        });
    }

}
