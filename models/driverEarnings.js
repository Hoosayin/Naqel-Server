var databaseHelper = require('../helpers/databaseHelper');

module.exports = databaseHelper.sequelize.define(
    "DriverEarnings",
    {
        DriverEarningID:
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
        CompletedJobID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            references:
            {
                model: "CompletedJobs",
                key: "CompletedJobID"
            }
        },
        DriverBillID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: true,
            references:
            {
                model: "DriverBills",
                key: "DriverBillID"
            }
        },
        Amount:
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
        tableName: "DriverEarnings"
    }    
);