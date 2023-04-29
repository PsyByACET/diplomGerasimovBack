const pgp = require("pg-promise")();
const cn = {
    host: process.env.HOST,
    port: process.env.DB_PORT,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    allowExitOnIdle: true,
};

const db = pgp(cn);

module.exports = db;