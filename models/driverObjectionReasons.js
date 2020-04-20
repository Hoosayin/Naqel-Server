var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "DriverObjectionReasons",
    {
        DriverObjectionReasonID:
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
        Reason:
        {
            type: databaseHelper.Sequelize.STRING(200),
            allowNull: false
        }
    },
    {
        tableName: "DriverObjectionReasons"
    }    
);