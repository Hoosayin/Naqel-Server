var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "NaqelTransactions",
    {
        NaqelTransactionID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        DriverID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: true,
            references:
            {
                model: "Drivers",
                key: "DriverID"
            }
        },
        TraderID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: true,
            references:
            {
                model: "Traders",
                key: "TraderID"
            }
        },
        UserType:
        {
            type: databaseHelper.Sequelize.STRING(50),
            allowNull: false
        },
        BillNumber:
        {
            type: databaseHelper.Sequelize.STRING(50),
            allowNull: false
        },
        PaymentMethod:
        {
            type: databaseHelper.Sequelize.STRING(50),
            allowNull: false
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
        tableName: "NaqelTransactions"
    }    
);