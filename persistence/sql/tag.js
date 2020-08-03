const { DataTypes } = require('sequelize');

/**
 * Function to create Tag Model
 *
 * @param connection: sequelize connection object
 * @returns {Model|void}
 */
let tag = (connection) => {
    return connection.define('tag', {
        /** ID of the tag */
        t_id: {
            type: DataTypes.INTEGER({ length: 11 }),
            primaryKey: true,
            autoIncrement: true
        },
        /** ID of the document the tag refers to */
        d_id: {
            type: DataTypes.INTEGER({ length: 11 }),
            foreignKey: true,
            allowNull: false
        },
        /** ID of the annotation used by the tag */
        a_id: {
            type: DataTypes.INTEGER({ length: 11 }),
            foreignKey: true,
            allowNull: false
        },
        /** start index of the tag */
        start_index: {
            type: DataTypes.INTEGER({ length: 11 }),
            allowNull: false
        },
        /** end index of the tag */
        end_index: {
            type: DataTypes.INTEGER({ length: 11 }),
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
};

module.exports = {
    tag
};
