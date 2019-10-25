'user strict';

const mySql = require('mysql'); 

const connection = mySql.createConnection({
	host 	: process.env.DB_HOST,
	user 	: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DATABASE,
	"multipleStatements": true
});

connection.connect(function(err) {
	if(err) throw err;
});

module.exports=connection;