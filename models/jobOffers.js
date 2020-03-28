var databaseHelper = require('../helpers/databaseHelper');

module.exports = databaseHelper.sequelize.define(
    "JobOffers",
    {
        JobOfferID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        TraderID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            references:
            {
                model: "Traders",
                key: "TraderID"
            }
        },
        TripType:
        {
            type: databaseHelper.Sequelize.STRING(50),
            allowNull: false
        },
        CargoType:
        {
            type: databaseHelper.Sequelize.STRING(250),
            allowNull: false
        },
        CargoWeight:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false
        },
        LoadingPlace:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        UnloadingPlace:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        LoadingLocation:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: true
        },
        UnloadingLocation:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: true
        },
        LoadingDate:
        {
            type: databaseHelper.Sequelize.DATEONLY,
            allowNull: false
        },
        LoadingTime:
        {
            type: databaseHelper.Sequelize.DATE,
            allowNull: false
        },
        TruckModel:
        {
            type: databaseHelper.Sequelize.STRING(100),
            allowNull: false
        },
        DriverNationality:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        EntryExit:
        {
            type: databaseHelper.Sequelize.INTEGER(1),
            allowNull: false
        },
        AcceptedDelay:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false
        },
        JobOfferType:
        {
            type: databaseHelper.Sequelize.STRING(250),
            allowNull: false
        },
        WaitingTime:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false
        },
        TimeCreated:
        {
            type: databaseHelper.Sequelize.DATE,
            allowNull: false
        }
    },
    {
        tableName: "JobOffers"
    }    
);