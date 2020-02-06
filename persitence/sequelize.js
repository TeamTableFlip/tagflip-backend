/**
 * Primary entry point for database connection and persistence layer.
 * Consolidates and forges DDL models together (using sequelize.js v5).
 *
 * Created by Max Kuhmichel at 6.2.2020
 */

let Sequelize = require('sequelize');
/* create connection: */
const connection= new Sequelize('tagflip', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
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
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

/* instantiate models: */
let corpusModel = require('./models/corpus');
let annotationModel = require('./models/annotation');
let annotationsetModel = require('./models/annotationset');
let corpus_annotationsetModel = require('./models/corpus_annotationset');
let documentModel = require('./models/document');
let tagModel = require('./models/tag');

let corpus = corpusModel(connection);
let annotation = annotationModel(connection);
let annotationset = annotationsetModel(connection);
let corpus_annotationset = corpus_annotationsetModel(connection);
let document = documentModel(connection);
let tag = tagModel(connection);

/* set up model associations: */



/* recreates db on startup: */
// seqDB.sync({ force: true })
//     .then(() => {
//         console.log(`Database & tables created!`)
//     });


/* make connected models available: */
module.exports = {
    corpus,
    annotation,
    annotationset,
    corpus_annotationset,
    document,
    tag
};
