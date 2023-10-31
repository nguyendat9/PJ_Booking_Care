'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Handbooks extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Handbooks.init({
        name: DataTypes.STRING,
        image: DataTypes.BLOB('long'),
        descriptionHTML: DataTypes.TEXT,
        descriptionMarkdown: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Handbooks',
    });
    return Handbooks;
};