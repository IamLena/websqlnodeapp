const express = require('express');
const router = express.Router();
const fs = require("fs")

router.get('/upload', (req, res) => {
	res.render('fileupload');
});

router.post('/upload', (req, res) => {
	let myfile = req.files.myfile;
	fs.mkdir("uploads", function(err) {
		if (err && err.code != "EEXIST") {
			res.send(err);
		} else {
			myfile.mv(`uploads/${req.files.myfile.name}`, (err) => {
				if (err)
				  return res.status(500).send(err);
				res.send('File uploaded!');
			});
		}
	});

	let myfile2 = req.files.myfile2;
	fs.mkdir("uploads", function(err) {
		if (err && err.code != "EEXIST") {
			res.send(err);
		} else {
			myfile2.mv(`uploads/${req.files.myfile2.name}`, (err) => {
				if (err)
				  return res.status(500).send(err);
				res.send('File uploaded!');
			});
		}
	});
});

module.exports = router;
