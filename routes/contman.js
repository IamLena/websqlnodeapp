const express = require('express');
const router = express.Router();
const ContmanController = require("../controllers/contman")
const Database = require("../db");

const authed_designer_check = async (req, res, next) => {
	if (req.session.user) {
		if (req.session.user.type == 2)
			next();
		else
			res.redirect('/personalpage');
	}
	else
		res.redirect('/auth/login');
}

router.get('/create', authed_designer_check, ContmanController.GETCreateMatrix);
router.post('/create', authed_designer_check, ContmanController.POSTCreateMatrix);

module.exports = router;
