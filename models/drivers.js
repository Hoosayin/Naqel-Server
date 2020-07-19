var databaseHelper = require('../helpers/databaseHelper');

module.exports = databaseHelper.sequelize.define(
    'Drivers',
    {
        DriverID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        Username:
        {
            type: databaseHelper.Sequelize.STRING(250),
            allowNull: false
        },
        Password:
        {
            type: databaseHelper.Sequelize.STRING(250),
            allowNull: false
        },
        PhoneNumber:
        {
            type: databaseHelper.Sequelize.STRING(50),
            allowNull: false
        },
        FirstName:
        {
            type: databaseHelper.Sequelize.STRING(50),
            allowNull: false
        },
        LastName:
        {
            type: databaseHelper.Sequelize.STRING(50),
            allowNull: false
        },
        Nationality:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        Email:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        Gender:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        DateOfBirth:
        {
            type: databaseHelper.Sequelize.DATEONLY,
            allowNull: false
        },
        Created:
        {
            type: databaseHelper.Sequelize.DATEONLY,
            defaultValue: databaseHelper.Sequelize.NOW,
            allowNull: false
        },
        Address:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        MangopayID:
        {
            type: databaseHelper.Sequelize.STRING(50),
            allowNull: true
        },
        WalletID:
        {
            type: databaseHelper.Sequelize.STRING(50),
            allowNull: true
        },
        Active:
        {
            type: databaseHelper.Sequelize.INTEGER(1),
            allowNull: false
        },
        TokenID:
        {
            type: databaseHelper.Sequelize.STRING(50),
            allowNull: true
        }
    },
    {
        tableName: "Drivers"
    },
    {
        timestamps: false
    }
);