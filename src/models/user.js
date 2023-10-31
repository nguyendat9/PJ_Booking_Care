'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            User.belongsTo(models.Allcodes, { foreignKey: 'positionId', targetKey: 'keyMap', as: 'positionData' })
            User.belongsTo(models.Allcodes, { foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData' })
            User.hasOne(models.Markdowns, { foreignKey: 'doctorId' })
            User.hasOne(models.Doctor_Infor, { foreignKey: 'doctorId' })

            User.hasMany(models.Schedules, { foreignKey: 'doctorId', as: 'doctorData' })
            User.hasMany(models.Bookings, { foreignKey: 'customerId', as: 'patientData' })




        }
    }
    User.init({
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        address: DataTypes.STRING,
        gender: DataTypes.STRING,
        roles: DataTypes.STRING,
        phoneNumber: DataTypes.STRING,
        positionId: DataTypes.STRING,
        image: DataTypes.BLOB('long')
    }, {
        sequelize,
        modelName: 'Users',
    });
    return User;
};