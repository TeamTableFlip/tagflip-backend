const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('document', {
        d_id: {
            type:  DataTypes.INTEGER({length: 11}),
            primaryKey: true,
            autoIncrement: true
        },
        c_id: {
            type:  DataTypes.INTEGER({length: 11}),
            foreignKey: true,
            allowNull: false
        },
        filename: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        last_edited: {
            type: DataTypes.DATE,
            allowNull: true
        },
        document_hash: {
            type: DataTypes.CHAR(64),
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    })
};
