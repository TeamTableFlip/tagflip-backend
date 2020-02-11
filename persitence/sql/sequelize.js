/**
 * Entry point for database connection.
 * DDL (data models use this connection and create them self in the model classes).
 *
 * Created by Max Kuhmichel at 6.2.2020
 */

const {Sequelize} = require('sequelize');
const config = require('../../config/config');
/* create connection: */
const connection= new Sequelize(config.db.name, config.db.user, config.db.password, {
    host: config.db.host,
    dialect: config.db.dialect
    // pool: {
    //     max: 10,
    //     min: 0,
    //     acquire: 30000,
    //     idle: 10000
    // }
});

/* test connection: */
connection.authenticate()
    .then(() => {
        console.info('Connection has been established successfully.');
        connection.sync({
            //force: true /* recreates db on startup */
        })
            .then(() => {
                console.log('Database synchronized')
            });
    });




/* make connection available: */
module.exports = {
    connection
};
