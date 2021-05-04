import mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: 3306
});

db.connect((err: any) => {
    if (!err) {
    console.log('Database is connected!');
    } else {
    console.log('Error connecting database!');
    }
});

module.exports = db;