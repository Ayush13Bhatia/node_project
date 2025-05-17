
const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = new Sequelize("postgres", "postgres", "123", {
    host: "localhost",
    port: 5431,
    dialect:
        "postgres" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
});
sequelize
    .authenticate()
    .then(() => console.log("Connection has been established successfully."))
    .catch((error) => console.error("Unable to connect to the database:", error));

module.exports = sequelize;

