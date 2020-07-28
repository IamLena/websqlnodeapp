const express = require('express');
const { render } = require('pug');
const router = express.Router();

const mysql = require('mysql');

//create connection
const db = mysql.createConnection({
	host		: process.env.DATABASE_HOST,
	user		: process.env.DATABASE_USER,
	password	: process.env.DATABASE_PASSWORD,
	database	: process.env.DATABASE_NAME
});

//connect
db.connect((err) => {
	if (err) {
		throw err;
	}
	else {
		console.log('mysql connected auth');
	}
});

router.get('/', (req, res) => {
	res.render('designer', {
		login : "nologin",
		name : "noname",
		lan_geo : "nogeo",
		email : "",
	});
});

router.get('/:login', (req, res) => {
	db.query("SELECT * FROM users WHERE login = ?", req.params.login, async (err, results) => {
		if (err)
			throw err;
		res.render('designer', {
			login : results[0].login,
			name : results[0].name,
			lan_geo : results[0].lan_geo,
			email : results[0].email,
		});
	});
});

module.exports = router;
