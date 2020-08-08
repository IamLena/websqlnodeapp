const express = require('express');
const router = express.Router();
const PagesController = require("../controllers/pages")
const Database = require("../db");

router.get('/', PagesController.GEThomepage)
router.get('/personalpage', PagesController.GETpersonalpage);

router.get('/screenshot', PagesController.GETscreenshot);
router.get('/download_psd', PagesController.GETdownloadpsd);
router.get('/download_tif', PagesController.GETdownloadtif);

module.exports = router;
