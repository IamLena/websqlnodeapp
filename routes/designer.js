const express = require('express');
const router = express.Router();
const DesignerController = require("../controllers/designer")
const Database = require("../db");

const authed_designer_check = async (req, res, next) => {
	if (req.session.user) {
		if (req.session.user.type == 1)
			next();
		else
			res.redirect('/personalpage');
	}
	else
		res.redirect('/auth/login');
}

router.get('/create', authed_designer_check, DesignerController.GETCreateRecord);
router.post('/create', authed_designer_check, DesignerController.POSTCreateRecord);

router.get('/localize', authed_designer_check, DesignerController.GETLocalizeRecord);
router.post('/localize', authed_designer_check, DesignerController.POSTLocalizeRecord);

router.get('/modify', authed_designer_check, DesignerController.GETModifyRecord);
router.post('/modify', authed_designer_check, DesignerController.POSTModifyRecord);

module.exports = router;
