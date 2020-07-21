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
        LoadingLat:
        {
            type: databaseHelper.Sequelize.DOUBLE,
            allowNull: false
        },
        LoadingLng:
        {
            type: databaseHelper.Sequelize.DOUBLE,
            allowNull: false
        },
        UnloadingPlace:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        UnloadingLat:
        {
            type: databaseHelper.Sequelize.DOUBLE,
            allowNull: false
        },
        UnloadingLng:
        {
            type: databaseHelper.Sequelize.DOUBLE,
            allowNull: false
        },
        LoadingDate:
        {
            type: databaseHelper.Sequelize.DATEONLY,
            allowNull: false
        },
        LoadingTime:
        {
            type: databaseHelper.Sequelize.TIME,
            allowNull: false
        },
        DriverNationalities:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: true
        },
        TruckSizes:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: true
        },
        TruckTypes:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: true
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
        PermitType:
        {
            type: databaseHelper.Sequelize.STRING(100),
            allowNull: false
        },
        JobOfferType:
        {
            type: databaseHelper.Sequelize.STRING(250),
            allowNull: false
        },
        Price:
        {
            type: databaseHelper.Sequelize.FLOAT,
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