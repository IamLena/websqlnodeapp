const express = require('express');
const router = express.Router();
const DesignerController = require("../controllers/designer")

const redirectLogin = (req, res, next) => {
	if (!req.session.user)
		res.redirect('/auth/login');
	else
		next();
}

router.get('/create', redirectLogin, DesignerController.GETCreateRecord);
router.post('/create', redirectLogin, DesignerController.POSTCreateRecord);

router.get('/localize', redirectLogin, DesignerController.GETLocalizeRecord);
router.post('/localize', redirectLogin, DesignerController.POSTLocalizeRecord);

router.get('/modify', redirectLogin, DesignerController.GETModifyRecord);
router.post('/modify', redirectLogin, DesignerController.POSTModifyRecord);

module.exports = router;
