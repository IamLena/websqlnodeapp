const express = require('express');
const router = express.Router();
const ContmanController = require("../controllers/contman")
const Database = require("../db");

const authed_contman_check = async (req, res, next) => {
	if (req.session.user) {
		if (req.session.user.type == 2)
			next();
		else
			res.redirect('/personalpage');
	}
	else
		res.redirect('/auth/login');
}

router.get('/create', authed_contman_check, ContmanController.GETCreateMatrix);
router.post('/create', authed_contman_check, ContmanController.POSTCreateMatrix);

router.get('/modify', authed_contman_check, ContmanController.GETmodifypage);
router.post('/addplaceholder', authed_contman_check, ContmanController.POSTaddplaceholder);
router.post('/publish', authed_contman_check, ContmanController.POSTpublish);

router.get('/findtomodify', authed_contman_check, ContmanController.GETfindtomodify);
router.post('/findtomodify', authed_contman_check, ContmanController.POSTfindtomodify);

router.post('/localizeplace', authed_contman_check, ContmanController.POSTlocalizeplace)

module.exports = router;
