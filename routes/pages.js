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

router.get('/', PagesController.GEThomepage)
router.get('/personalpage', redirectLogin, PagesController.GETpersonalpage);

router.get('/findscreenshot', redirectLogin, PagesController.GETfindscreenshot);
router.post('/findscreenshot', redirectLogin, PagesController.POSTfindscreenshot);
router.get('/findmatrix', redirectLogin, PagesController.GETfindmatrix);
// router.post('/findmatrix', redirectLogin, PagesController.POSTfindmatrix);

router.get('/screenshot', redirectLogin, PagesController.GETscreenshot);
router.get('/download_psd', redirectLogin, PagesController.GETdownloadpsd);
router.get('/download_tif', redirectLogin, PagesController.GETdownloadtif);

router.get('/matrix', redirectLogin, PagesController.GETmatrix);
router.post('/matrix', redirectLogin, PagesController.POSTmatrix);

router.get('/listoflocals', redirectLogin, PagesController.GETlistoflocals);
router.get('/listofversions', redirectLogin, PagesController.GETlistofversions);

module.exports = router;
