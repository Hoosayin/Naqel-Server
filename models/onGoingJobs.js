var databaseHelper = require('../helpers/databaseHelper');

module.exports = databaseHelper.sequelize.define(
    "OnGoingJobs",
    {
        OnGoingJobID:
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
                model: "Drivers",
                key: "DriverID"
            }
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
        JobNumber:
        {
            type: databaseHelper.Sequelize.STRING(50),
            allowNull: false
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
            type: databaseHelper.Sequelize.TIME,
            allowNull: false
        },
        TruckModel:
        {
            type: databaseHelper.Sequelize.STRING(100),
            allowNull: true
        },
        DriverNationality:
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
        Price:
        {
            type: databaseHelper.Sequelize.FLOAT,
            allowNull: false
        },
        CompletedByDriver:
        {
            type: databaseHelper.Sequelize.INTEGER(1),
            allowNull: false
        },
        CompletedByTrader:
        {
            type: databaseHelper.Sequelize.INTEGER(1),
            allowNull: false
        },
        DriverRated:
        {
            type: databaseHelper.Sequelize.INTEGER(1),
            allowNull: false
        },
        Created:
        {
            type: databaseHelper.Sequelize.DATE,
            allowNull: false
        }
    },
    {
        tableName: "OnGoingJobs"
    }    
);