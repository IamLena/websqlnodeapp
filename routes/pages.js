const express = require('express');
const router = express.Router();
const PagesController = require("../controllers/pages")
const Database = require("../db");

router.get('/', PagesController.GEThomepage)
router.get('/personalpage', PagesController.GETpersonalpage);

router.get('/findscreenshot', PagesController.GETfindscreenshot);
router.post('/findscreenshot', (req, res) => {
	res.send(res.body);
}); //not working

router.get('/screenshot', PagesController.GETscreenshot);
router.get('/download_psd', PagesController.GETdownloadpsd);
router.get('/download_tif', PagesController.GETdownloadtif);

router.get('/listoflocals', PagesController.GETlistoflocals);
router.get('/listofversions', PagesController.GETlistofversions);

router.post('/filtering', PagesController.POSTfindscreenshot);

module.exports = router;
