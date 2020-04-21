var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "TraderObjectionReasons",
    {
        DriverObjectionReasonID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
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
        Reason:
        {
            type: databaseHelper.Sequelize.STRING(200),
            allowNull: false
        }
    },
    {
        tableName: "TraderObjectionReasons"
    }    
);