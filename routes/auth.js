const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth');

const redirectPersonalPage = (req, res, next) => {
	if (req.session.user)
		res.redirect('/auth/personalpage');
	else
		next();
}

const redirectLogin = (req, res, next) => {
	if (!req.session.user)
		res.redirect('/auth/login');
	else
		next();
}

router.get('/personalpage', redirectLogin, AuthController.personalPage);

router.get('/login', redirectPersonalPage, AuthController.GETlogin);
router.get('/register', redirectPersonalPage, AuthController.GETregister);

router.post('/login', redirectPersonalPage, AuthController.POSTlogin);
router.post('/register', redirectPersonalPage, AuthController.POSTregister);

router.get('/logout', redirectLogin, AuthController.POSTlogout);

module.exports = router;
