var databaseHelper = require('../helpers/databaseHelper');

module.exports = databaseHelper.sequelize.define(
    "DrivingLicences",
    {
        DrivingLicenceID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        DriverID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            references:
            {
                model: 'Drivers',
                key: 'DriverID'
            }
        },
        LicenceNumber:
        {
            type: databaseHelper.Sequelize.STRING(250),
            allowNull: false
        },
        Type:
        {
            type: databaseHelper.Sequelize.STRING(50),
            allowNull: false
        },
        ReleaseDate:
        {
            type: databaseHelper.Sequelize.DATEONLY,
            allowNull: false
        },
        ExpiryDate:
        {
            type: databaseHelper.Sequelize.DATEONLY,
            allowNull: false
        },
        PhotoURL:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        Created:
        {
            type: databaseHelper.Sequelize.DATEONLY,
            defaultValue: databaseHelper.Sequelize.NOW,
            allowNull: false
        }
    },
    {
        tableName: "DrivingLicences"
    }    
);