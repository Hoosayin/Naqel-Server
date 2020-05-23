var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "TraderRates",
    {
        TraderRateID:
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
        FeeRate:
        {
            type: databaseHelper.Sequelize.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: "TraderRates"
    }    
);