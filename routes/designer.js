const express = require('express');
const router = express.Router();
const DesignerController = require("../controllers/designer")
const mysql = require('mysql');

const db = mysql.createConnection({
	host		: process.env.DATABASE_HOST,
	user		: process.env.DATABASE_USER,
	password	: process.env.DATABASE_PASSWORD,
	database	: process.env.DATABASE_NAME
});

db.connect((err) => {
	if (err) throw err;
	else console.log('mysql connected designer'); //console logging !!!
});

const redirectLogin = (req, res, next) => {
	if (!req.session.user_login)
		res.redirect('/auth/login');
	else
		next();
}

// router.get('/', redirectLogin, DesignerController.personalPage); IT SHOULD BE THIS WAY
router.get('/', DesignerController.personalPage);

router.get('/create', DesignerController.GETCreateRecord);
router.post('/create', DesignerController.POSTCreateRecord);

// router.get('/localize', DesignerController.GETLocalizeRecord);
// router.post('/localize', DesignerController.POSTLocalizeRecord);

// router.get('/modify', DesignerController.GETModifyRecord);
// router.post('/modify', DesignerController.POSTModifyRecord);

module.exports = router;
