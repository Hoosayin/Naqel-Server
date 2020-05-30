var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "TransportCompanyResponsibles",
    {
        TransportCompanyResponsibleID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        Email:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
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
        Name:
        {
            type: databaseHelper.Sequelize.STRING(250),
            allowNull: false
        },
        PhoneNumber:
        {
            type: databaseHelper.Sequelize.STRING(250),
            allowNull: false
        },
        InternalNumber:
        {
            type: databaseHelper.Sequelize.STRING(50),
            allowNull: true
        },
        CommercialRegisterNumber:
        {
            type: databaseHelper.Sequelize.STRING(50),
            allowNull: true
        },
        Active:
        {
            type: databaseHelper.Sequelize.INTEGER(1),
            allowNull: false
        },
        Created:
        {
            type: databaseHelper.Sequelize.DATEONLY,
            allowNull: false
        }
    },
    {
        tableName: "TransportCompanyResponsibles"
    },
    {
        timestamps: false
    }
);
