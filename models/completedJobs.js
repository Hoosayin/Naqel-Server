var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "CompletedJobs",
    {
        CompletedJobID:
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
        TruckID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: true,
            references:
            {
                model: "Trucks",
                key: "TruckID"
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
        Created:
        {
            type: databaseHelper.Sequelize.DATE,
            allowNull: false
        }
    },
    {
        tableName: "CompletedJobs"
    }    
);