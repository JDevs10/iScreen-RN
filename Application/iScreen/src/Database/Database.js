import React, { Component } from 'react'
import { Text, View } from 'react-native'
import SQLite from 'react-native-sqlite-storage'
SQLite.DEBUG(true);
SQLite.enablePromise(true);

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

export default class Database extends Component {
    async initDB() {
        let db;
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
                    console.log("SQL => "+create);
                    await db.transaction(async(tx) => {
                        tx.executeSql(create);
                    }).then(async() => {
                        console.log("Table created successfully");
                    }).catch(async error => {
                        console.log(error);
                    });
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

    initDB() {
        let db;
        return new Promise((resolve) => {
          console.log("Plugin integrity check ...");
          SQLite.echoTest()
            .then(() => {
                console.log("Integrity check passed ...");
                console.log("Opening database ...");
                SQLite.openDatabase(
                    DATABASE_NAME,
                    DATABASE_VERSION,
                    DATABASE_DISPLAY_NAME,
                    DATABASE_SIZE
                )
                .then(DB => {
                    db = DB;
                    console.log("Database OPEN");
                    console.log("SQL => "+create);
                    db.transaction((tx) => {
                        tx.executeSql(create);
                    }).then(() => {
                        console.log("Table created successfully");
                    }).catch(error => {
                        console.log(error);
                    });
                    resolve(db);
                })
                .catch(error => {
                    console.log(error);
                });
            })
            .catch(error => {
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

    listCategory() {
        return new Promise((resolve) => {
          const categories = [];
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('SELECT c.id, c.ref, c.label FROM categories c', []).then(([tx,results]) => {
                console.log("Query completed");
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                  let row = results.rows.item(i);
                  console.log(`ID: ${row.id}, label: ${row.label}`)
                  const { id, ref, label } = row;
                  categories.push({
                    id,
                    ref,
                    label
                  });
                }
                console.log(categories);
                resolve(categories);
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
    }
}
