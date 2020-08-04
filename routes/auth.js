const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth');


const redirectPersonalPage = (req, res, next) => {
	if (req.session.user) {
		if (req.session.user.type == 1)
			return res.send('designer');
			// return res.redirect(`/designer`);
		else if (req.session.user.type == 2)
			return res.send('contman');
			// return res.redirect(`/contman`);
		else if (req.session.user.type == 3)
			return res.send('graphart');
			// return res.redirect(`/graphart`);
		else
			return res.redirect(`/`);
	}
	next();
}

const redirectLogin = (req, res, next) => {
	if (!req.session.user)
		res.redirect('/auth/login');
	else
		next();
}

router.get('/personalpage', redirectPersonalPage, (req, res) => {
	res.redirect("/");
});

router.get('/login', redirectPersonalPage, AuthController.GETlogin);
router.get('/register', redirectPersonalPage, AuthController.GETregister);

router.post('/login', redirectPersonalPage, AuthController.POSTlogin);
router.post('/register', redirectPersonalPage, AuthController.POSTregister);

router.post('/logout', redirectLogin, AuthController.POSTlogout);

module.exports = router;
