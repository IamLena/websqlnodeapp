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
	login = req.query.login;
	if (login) {
		db.query("SELECT * FROM users WHERE login = ?", login, async (err, results) => {
			if (err)
				throw err;
			authorized = req.query.authorized;
			res.render('designer/designer', {
				login : results[0].login,
				name : results[0].name,
				lan_geo : results[0].lan_geo,
				email : results[0].email,
				authorized : authorized,
			});
		});
	}
	else {
		res.render('designer/designer', {
			login : "nologin",
			name : "noname",
			lan_geo : "nogeo",
			email : "",
		});
	}
});

router.get('/create/', (req, res) => {
	const os = req.query.os;
	const device = req.query.device;

	db.query("select * from os ", async (err, results) => {
		if(err)
			throw err;
		else
			res.render("designer/create");
	});
});

module.exports = router;
