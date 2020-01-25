var databaseHelper = require('../helpers/databaseHelper');

module.exports = databaseHelper.sequelize.define(
    'Trailers',
    {
        TrailerID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        TruckID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            references:
            {
                model: 'Truck',
                key: 'TruckID'
            }
        },
        MaximumWeight:
        {
            type: databaseHelper.Sequelize.FLOAT,
            allowNull: false
        },
        PhotoLink:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        Type:
        {
            type: databaseHelper.Sequelize.STRING(50),
            allowNull: false
        }
    },
    {
        tableName: 'Trailers'
    }
);