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


const TABLE_NAME = "categories";
const COLUMN_ID = "id";
const COLUMN_Ref = "ref";
const COLUMN_Ref_ext = "ref_ext";
const COLUMN_Label = "label";
const COLUMN_Description = "description";
const COLUMN_Entity = "entity";
const COLUMN_Color = "color";
const COLUMN_Type = "type";
const COLUMN_Visible = "visible";
const COLUMN_Fk_parent = "fk_parent";


const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," +
    COLUMN_Ref + " VARCHAR(255)," +
    COLUMN_Ref_ext + " VARCHAR(255)," +
    COLUMN_Label + " VARCHAR(255)," +
    COLUMN_Description + " VARCHAR(255)," +
    COLUMN_Entity + " VARCHAR(255)," +
    COLUMN_Color + " VARCHAR(255)," +
    COLUMN_Type + " VARCHAR(255)," +
    COLUMN_Visible + " VARCHAR(255)," +
    COLUMN_Fk_parent + " VARCHAR(255)" +
")";


export default class CategoriesManager extends Component {
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

    //Insert
    async INSERT_(data_){
        console.log("##### INSERT_ #########################");
        console.log("inserting.... ", data_.length);
        return await new Promise(async (resolve) => {
            try{
                for(let x = 0; x < data_.length; x++){
                    await db.transaction(async (tx) => {
                        const insert = "INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+", "+COLUMN_Ref+", "+COLUMN_Ref_ext+", "+COLUMN_Label+", "+COLUMN_Description+", "+COLUMN_Entity+", "+COLUMN_Color+", "+COLUMN_Type+", "+COLUMN_Visible+", "+COLUMN_Fk_parent+") VALUES (NULL, '"+data_[x].ref+"', '"+data_[x].ref_ext+"', '"+data_[x].label+"', '"+data_[x].description+"', '"+data_[x].entity+"', '"+data_[x].color+"', '"+data_[x].type+"', '"+data_[x].visible+"', '"+data_[x].fk_parent+"')";
                        await tx.executeSql(insert, []);
                    });
                }
                return await resolve(true);
            } catch(error){
                console.log("error: ", error);
                return await resolve(false);
            }
        });
    }

    //Get by id
    async GET_BY_ID(id){
        console.log("##### GET_BY_ID #########################");

        return await new Promise(async (resolve) => {
            let categories = {};
            await db.transaction(async (tx) => {
                await tx.executeSql('SELECT c.id, c.ref, c.label FROM categories c where c.id = ' + id, []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        //console.log(`ID: ${row.id}, label: ${row.label}`)
                        categories = row;
                    }
                    console.log(categories);
                    await resolve(categories);
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
        console.log("##### GET_LIST[Categories] #########################");

        return await new Promise(async (resolve) => {
            const categories = [];
              await db.transaction(async (tx) => {
                await tx.executeSql('SELECT c.id, c.ref, c.label FROM categories c', []).then(async ([tx,results]) => {
                  console.log("Query completed");
                  var len = results.rows.length;
                  for (let i = 0; i < len; i++) {
                      let row = results.rows.item(i);
                      //console.log(`ID: ${row.id}, label: ${row.label}`)
                      const { id, ref, label } = row;
                      categories.push({
                          id,
                          ref,
                          label
                      });
                  }
                  console.log(categories);
                  await resolve(categories);
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
