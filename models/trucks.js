var databaseHelper = require('../helpers/databaseHelper');

module.exports = databaseHelper.sequelize.define(
    'Trucks',
    {
        TruckID:
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
        TransportCompanyID: {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: true,
            references:
            {
                model: 'TransportCompany',
                key: 'TCID'
            }
        },
        PlateNumber:
        {
            type: databaseHelper.Sequelize.STRING(100),
            allowNull: false
        },
        Owner:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        ProductionYear:
        {
            type: "YEAR(4)",
            allowNull: false
        },
        Brand:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        Model:
        {
            type: databaseHelper.Sequelize.STRING(100),
            allowNull: false
        },
        Type:
        {
            type: databaseHelper.Sequelize.STRING(100),
            allowNull: false
        },
        MaximumWeight:
        {
            type: databaseHelper.Sequelize.FLOAT,
            allowNull: false
        },
        PhotoURL:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        }
    },
    {
        tableName: 'Trucks'
    }
);