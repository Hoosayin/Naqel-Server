var databaseHelper = require('../helpers/databaseHelper');

module.exports = databaseHelper.sequelize.define(
    "DriverBills",
    {
        DriverBillID:
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
        BillNumber:
        {
            type: databaseHelper.Sequelize.STRING(50),
            allowNull: true
        },
        FeeRate:
        {
            type: databaseHelper.Sequelize.INTEGER,
            allowNull: true
        },
        Created:
        {
            type: databaseHelper.Sequelize.DATE,
            allowNull: false
        }
    },
    {
        tableName: "DriverBills"
    }    
);