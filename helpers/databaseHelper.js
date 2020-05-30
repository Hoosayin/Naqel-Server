const Sequelize = require("sequelize");
const database = {};

database.Sequelize = Sequelize;
//database.sequelize = new Sequelize("Naqel", "NaqelServer@naqel-database-server", "LP1twigs", {
//    host: "naqel-database-server.mysql.database.azure.com",
//    port: 3306,
//    dialect: "mysql",
//    operatorsAliases: 0,
//    define: {
//        timestamps: false
//    },
//    pool: {
//        max: 5,
//        min: 0,
//        acquire: 30000,
//        idle: 10000
//    }
//});
database.sequelize = new Sequelize("TransportJobDB", "dev", "pakistan@123", {
    host: "166.62.30.147",
    port: 3306,
    dialect: "mysql",
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
    console.log("Database tables have been created.");
});

module.exports = database;