const express = require('express');
const mysql = require('mysql');

const db = mysql.createConnection({
	host		: process.env.DATABASE_HOST,
	user		: process.env.DATABASE_USER,
	password	: process.env.DATABASE_PASSWORD,
	database	: process.env.DATABASE_NAME
});

db.connect((err) => {
	if (err) throw err;
	else console.log('mysql connected auth'); //console loging!
});

const router = express.Router();
const AuthController = require('../controllers/auth')

router.get('/login', (req, res) => {
	res.render('auth/login');
});

router.get('/register', (req, res) => {
	db.query("SELECT * FROM lan_geo", async (err, results) => {
		if (err) throw error;
		else res.render('auth/register', { lans : results});
	});
});

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

module.exports = router;
