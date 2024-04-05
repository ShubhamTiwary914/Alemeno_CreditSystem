const mysql = require('mysql');
const DB = process.env.DB_NAME
const HOST = process.env.DB_HOST

const db = mysql.createConnection({
    host: HOST,
    user: 'root',
    password: 'root',
    database: DB
});


db.connect(function(err) {
    if(err) 
        throw err;
});


module.exports = db;


