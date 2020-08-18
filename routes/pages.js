const express = require('express');
const router = express.Router();
const PagesController = require("../controllers/pages")
const Database = require("../db");

const redirectLogin = (req, res, next) => {
	if (!req.session.user)
		res.redirect('/auth/login');
	else
		next();
}

const redirectPersonalPage = (req, res, next) => {
	if (req.session.user)
		res.redirect('/personalpage');
	else
		next();
}

router.get('/', redirectPersonalPage, PagesController.GEThomepage)
router.get('/personalpage', redirectLogin, PagesController.GETpersonalpage);

// router.get('/findscreenshot', redirectLogin, PagesController.GETfindscreenshot);
// router.post('/findscreenshot', redirectLogin, PagesController.POSTfindscreenshot);

// router.get('/findpage', redirectLogin, PagesController.GETfindpage);
// router.post('/findpage', redirectLogin, PagesController.POSTfindpage);

// router.get('/screenshot', redirectLogin, PagesController.GETscreenshot);
// router.get('/page', redirectLogin, PagesController.GETpage);

// router.get('/download_psd', redirectLogin, PagesController.GETdownloadpsd);
// router.get('/download_tif', redirectLogin, PagesController.GETdownloadtif);

// router.get('/listofscreenlocals', redirectLogin, PagesController.GETlistoflocals);
// router.get('/listofscreenversions', redirectLogin, PagesController.GETlistofversions);
// router.get('/listofpageversions', redirectLogin, PagesController.GETlistofversions);

module.exports = router;
