var databaseHelper = require('../helpers/databaseHelper');

module.exports = databaseHelper.sequelize.define(
    "TProfilePhoto",
    {
        ProfileID:
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
                model: "TraderBroker",
                key: "TraderID"
            }
        },
        URL:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        DateUploaded:
        {
            type: databaseHelper.Sequelize.DATEONLY,
            defaultValue: databaseHelper.Sequelize.NOW,
            allowNull: false
        },
        FileName:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
    },
    {
        tableName: "TProfilePhoto"
    }    
);