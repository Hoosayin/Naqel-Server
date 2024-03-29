var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "JobRequests",
    {
        JobRequestID:
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
        TripType:
        {
            type: databaseHelper.Sequelize.STRING(50),
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
        tableName: "JobRequests"
    }    
);