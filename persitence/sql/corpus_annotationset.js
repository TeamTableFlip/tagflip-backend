const { DataTypes } = require('sequelize');

/**
 * Function to create join Table between Corpus Model and AnnotationSet Model
 *
 * @param connection: sequelize connection object
 * @returns {Model|void}
 */
let corpus_annotationset = (connection) => {
    return connection.define('corpus_annotationset', {
        c_id: {
            type:  DataTypes.INTEGER({length: 11}),
            foreignKey: true,
            primaryKey: true,
            allowNull: false
        },
        s_id: {
            type:  DataTypes.INTEGER({length: 11}),
            foreignKey: true,
            primaryKey: true,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
};

module.exports =  {
    corpus_annotationset
};
