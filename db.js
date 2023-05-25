const pgp = require("pg-promise")();

const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
    process.env.DATABASE,
    process.env.USER,
    process.env.PASSWORD,
    {
        dialect: "postgres",
        host: process.env.HOST,
        port: process.env.DB_PORT,
    }
);

//
// const cn = {
//     host: process.env.HOST,
//     port: process.env.DB_PORT,
//     database: process.env.DATABASE,
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     allowExitOnIdle: true,
// };
//
// const db = pgp(cn);

// module.exports = db;