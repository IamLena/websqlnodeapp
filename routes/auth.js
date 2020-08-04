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
const AuthController = require('../controllers/auth');
const e = require('express');

const redirectPersonalPage = (req, res, next) => {
	if (req.session.user_login) {
		if (req.session.user.type == 1)
			res.send('designer');
			// return res.redirect(`/designer`);
		else if (req.session.user.type == 2)
			res.send('contman');
			// return res.redirect(`/contman`);
		else if (req.session.user.type == 3)
			res.send('graphart');
			// return res.redirect(`/graphart`);
		else
			return res.redirect(`/`);
	}
	next();
}

const redirectLogin = (req, res, next) => {
	if (!req.session.user_login)
		res.redirect('/auth/login');
	else
		next();
}

router.get('/personalpage', (req, res) => {
	if (req.session.user_login) {
		if (req.session.user) {
			if (req.session.user.type == 1)
				res.send('designer');
				// return res.redirect(`/designer`);
			else if (req.session.user.type == 2)
				res.send('contman');
				// return res.redirect(`/contman`);
			else if (req.session.user.type == 3)
				res.send('graphart');
				// return res.redirect(`/graphart`);
			else
				res.redirect(`/`);
		}
		else
			res.send("no user");
	}
	else
	res.send("no login");
});

router.get('/login', redirectPersonalPage, AuthController.GETlogin);
router.get('/register', redirectPersonalPage, AuthController.POSTregister);

router.post('/login', redirectPersonalPage, AuthController.POSTlogin);
router.post('/register', redirectPersonalPage, AuthController.POSTregister);

router.post('/logout', redirectLogin, AuthController.POSTlogout);

module.exports = router;
