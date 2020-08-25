var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "Traders",
    {
        TraderID:
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
            type: databaseHelper.Sequelize.STRING(250),
            allowNull: false
        },
        FirstName:
        {
            type: databaseHelper.Sequelize.STRING(250),
            allowNull: false
        },
        LastName:
        {
            type: databaseHelper.Sequelize.STRING(250),
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
            allowNull: false
        },
        Address:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        Active:
        {
            type: databaseHelper.Sequelize.INTEGER(1),
            allowNull: false
        },
        Type:
        {
            type: databaseHelper.Sequelize.STRING(50),
            allowNull: false
        },
        BankName:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: true
        },
        IBAN:
        {
            type: databaseHelper.Sequelize.STRING(250),
            allowNull: true
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
        Online:
        {
            type: databaseHelper.Sequelize.INTEGER(1),
            allowNull: false
        },
    },
    {
        tableName: "Traders"
    },
    {
        timestamps: false
    }
);
