const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env._HOST,
    user: process.env._USER,
    password: process.env._PASSWORD,
    database: process.env._DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();

