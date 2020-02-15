var databaseHelper = require('../helpers/databaseHelper');

module.exports = databaseHelper.sequelize.define(
    "DriverEntryExitCards",
    {
        EntryExitCardID:
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
                model: 'Drivers',
                key: 'DriverID'
            }
        },
        EntryExitNumber:
        {
            type: databaseHelper.Sequelize.STRING(250),
            allowNull: false
        },
        Type:
        {
            type: databaseHelper.Sequelize.STRING(50),
            allowNull: false
        },
        ReleaseDate:
        {
            type: databaseHelper.Sequelize.DATEONLY,
            allowNull: false
        },
        NumberOfMonths:
        {
            type: databaseHelper.Sequelize.INTEGER(11),
            allowNull: false
        }
    },
    {
        tableName: "DriverEntryExitCards"
    }    
);