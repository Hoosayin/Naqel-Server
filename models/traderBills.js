var databaseHelper = require('../helpers/databaseHelper');

module.exports = databaseHelper.sequelize.define(
    "TraderBills",
    {
        TraderBillID:
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
        Amount:
        {
            type: databaseHelper.Sequelize.FLOAT,
            allowNull: false
        },
        Paid:
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
        tableName: "TraderBills"
    }    
);