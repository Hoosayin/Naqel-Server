var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "DriverPermitLicences",
    {
        PermitLicenceID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        DriverID: {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            references:
            {
                model: "Drivers",
                key: "DriverID"
            }
        },
        PermitNumber:
        {
            type: databaseHelper.Sequelize.STRING(250),
            allowNull: false
        },
        PhotoURL:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        ExpiryDate:
        {
            type: databaseHelper.Sequelize.DATEONLY,
            allowNull: false
        },
        Code:
        {
            type: databaseHelper.Sequelize.STRING(250),
            allowNull: false
        },
        Place:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        }
    },
    {
        tableName: "DriverPermitLicences"
    }    
);