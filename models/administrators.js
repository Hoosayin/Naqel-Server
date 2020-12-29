var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "Administrators",
    {
        AdministratorID:
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
        Email:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        PhoneNumber:
        {
            type: databaseHelper.Sequelize.STRING(50),
            allowNull: false
        },
        Password:
        {
            type: databaseHelper.Sequelize.STRING(250),
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
        PhotoURL:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: true
        },
        Created:
        {
            type: databaseHelper.Sequelize.DATEONLY,
            defaultValue: databaseHelper.Sequelize.NOW,
            allowNull: false
        },
        IsSuperAdmin:
        {
            type: databaseHelper.Sequelize.INTEGER(1),
            allowNull: false
        },
    },
    {
        tableName: "Administrators"
    },
    {
        timestamps: false
    }
);