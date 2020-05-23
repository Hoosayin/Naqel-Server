var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "PriceRanges",
    {
        PriceRangeID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        StartRange:
        {
            type: databaseHelper.Sequelize.FLOAT,
            allowNull: false
        },
        EndRange:
        {
            type: databaseHelper.Sequelize.FLOAT,
            allowNull: false
        },
        FeeRate:
        {
            type: databaseHelper.Sequelize.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: "PriceRanges"
    }    
);