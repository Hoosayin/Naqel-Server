const Sequelize = require('sequelize');
const database = {};

database.Sequelize = Sequelize;
database.sequelize = new Sequelize("TransportJobDB", "dev", "pakistan@123", {
    host: "166.62.30.147",
    port: 3306,
    dialect: 'mysql',
    operatorsAliases: 0,
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

database.sequelize.sync().then(() => {
    console.log('Database tables have been created');
});

module.exports = database;