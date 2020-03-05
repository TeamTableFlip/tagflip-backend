/**
 * Entry point for database connection.
 * DDL (data models use this connection and create them self in the model classes).
 *
 * Form here the ORM models can be imported and used in the app.
 *
 * Created by Max Kuhmichel at 6.2.2020
 */

const {Sequelize: Models} = require('sequelize');
const config = require('../../config/Config');
/* create connection: */
const connection= new Models(config.db.name, config.db.user, config.db.password, {
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
connection.authenticate().then(() => {
    console.info('Connection has been established successfully.');
});

/* make models with connection available: */
let {annotation} = require('./annotation');
let {annotationset} = require('./annotationset');
let {corpus_annotationset} = require('./corpus_annotationset');
let {document} = require('./document');
let {corpus} = require('./corpus');
let {tag} = require('./tag');

let tagModel = tag(connection);
let corpusModel = corpus(connection);
let documentModel = document(connection);
let corpus_annotationsetModel = corpus_annotationset(connection);
let annotationsetModel = annotationset(connection);
let annotationModel = annotation(connection);

/* setup associations between model classes */
annotationModel.belongsTo(annotationsetModel, {
    as: 'annotationset',
    foreignKey: 's_id',
    sourceKey: 'a_id',
    onDelete: 'CASCADE'
});

annotationsetModel.hasMany(annotationModel, {
    as: 'annotations',
    sourceKey: 's_id',
    foreignKey: 's_id'
});


annotationsetModel.belongsToMany(corpusModel, {
    through: corpus_annotationsetModel,
    sourceKey: 's_id',
    foreignKey: 's_id',
    onDelete: 'CASCADE'
});

corpusModel.belongsToMany(annotationsetModel, {
    through: corpus_annotationsetModel,
    sourceKey: 'c_id',
    foreignKey: 'c_id',
    onDelete: 'CASCADE'
});


documentModel.belongsTo(corpusModel, {
    as: 'corpus',
    foreignKey: 'c_id',
    sourceKey: 'd_id',
    onDelete: 'CASCADE'
});

corpusModel.hasMany(documentModel, {
    as: 'documents',
    sourceKey: 'c_id',
    foreignKey: 'c_id'
});

tagModel.belongsTo(annotationModel, {
    as: 'annotation',
    onDelete: 'CASCADE',
    sourceKey: 't_id',
    foreignKey: 'a_id'
});

annotationModel.hasMany(tagModel, {
    as: 'tags',
    sourceKey: 'a_id',
    foreignKey: 'a_id'
});

tagModel.belongsTo(documentModel, {
    as: 'document',
    foreignKey: 'd_id',
    sourceKey: 't_id',
    onDelete: 'CASCADE'
});

documentModel.hasMany(tagModel,  {
    as: 'tags',
    sourceKey: 'd_id',
    foreignKey: 'd_id'
});

/* make sure database is synced */
connection.sync({
    //force: true /* recreates db on startup */
}).then(() => {
    console.log('Database synchronized')
});

module.exports = {
    connection,
    annotationsetModel,
    annotationModel,
    documentModel,
    corpusModel,
    tagModel,
    corpus_annotationsetModel
};
