const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth');

const redirectPersonalPage = (req, res, next) => {
	if (req.session.user)
		res.redirect('/personalpage');
	else
		next();
}

const redirectLogin = (req, res, next) => {
	if (!req.session.user)
		res.redirect('/auth/login');
	else
		next();
}

router.get('/login', redirectPersonalPage, AuthController.GETlogin);
router.post('/login', redirectPersonalPage, AuthController.POSTlogin);

router.get('/register', redirectPersonalPage, AuthController.GETregister);
router.post('/register', redirectPersonalPage, AuthController.POSTregister);

router.get('/logout', redirectLogin, AuthController.POSTlogout);

module.exports = router;
