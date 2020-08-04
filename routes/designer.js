const express = require('express');
const router = express.Router();
const DesignerController = require("../controllers/designer")
const mysql = require('mysql');

const Database = require("../db")

const redirectLogin = (req, res, next) => {
	if (!req.session.user)
		res.redirect('/auth/login');
	else
		next();
}

router.get('/', redirectLogin, DesignerController.personalPage);

// router.get('/create', DesignerController.GETCreateRecord);
// router.post('/create', DesignerController.POSTCreateRecord);

// router.get('/localize', DesignerController.GETLocalizeRecord);
// router.post('/localize', DesignerController.POSTLocalizeRecord);

// router.get('/modify', DesignerController.GETModifyRecord);
// router.post('/modify', DesignerController.POSTModifyRecord);

module.exports = router;
