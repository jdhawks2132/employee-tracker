const mysql = require('./mysql2');

const db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	database: 'tracker',
});

module.exports = db;
