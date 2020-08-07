const express = require('express');
const router = express.Router();
const Database = require("../db");

router.get('/', (req, res) => {
	res.render('index');
});

router.get('/screenshot', async (req, res) => {
	if (!req.query.psd_id)
	{
		res.send('finding');
		return;
		// res.redirect('/findscreenshot')
	}

	const db = new Database( {
		host		: process.env.DATABASE_HOST,
		user		: process.env.DATABASE_USER,
		password	: process.env.DATABASE_PASSWORD,
		database	: process.env.DATABASE_NAME
	} );

	try {
		const psds = await db.query("select * from psd where id = ?", req.query.psd_id)
		const screen = psds[0];
		const author = await db.query("select * from users where id = ?", screen.designer_id);
		const author_fullname = `${author[0].firstname} ${author[0].lastname}`;
		const osnames = await db.query("select * from os where nickname = ?", screen.os);
		const devicenames = await db.query("select * from devices where nickname = ?", screen.device);
		const languages = await db.query("select * from lan_geo where lan_geo = ?", screen.lan_geo);
		res.render('content/screenshot', {
			m_screen : screen,
			m_author_fullname : author_fullname,
			m_author_id : screen.designer_id,
			m_os_name : osnames[0],
			m_device_name : devicenames[0],
			m_language : `${languages[0].language} (${languages[0].country})`
		});
	}
	catch(err)
	{
		res.send(res);
	}
	finally{
		await db.close();
	}
});

router.get('/download_psd', async (req, res) => {
	const db = new Database({
		host		: process.env.DATABASE_HOST,
		user		: process.env.DATABASE_USER,
		password	: process.env.DATABASE_PASSWORD,
		database	: process.env.DATABASE_NAME
	});

	try {
		const psd_id = req.query.psd_id;
		if (psd_id)
		{
			const psds = await db.query("select * from psd where id = ?", psd_id);
			const psdfilename = psds[0].filename;
			res.download(psdfilename);
		}
	}
	catch(err) {
		res.send(err);
	}
	finally {
		await db.close();
	}
});

router.get('/download_tif', async (req, res) => {
	const db = new Database({
		host		: process.env.DATABASE_HOST,
		user		: process.env.DATABASE_USER,
		password	: process.env.DATABASE_PASSWORD,
		database	: process.env.DATABASE_NAME
	});

	try {
		const psd_id = req.query.psd_id;
		if (psd_id)
		{
			const tifs = await db.query("select * from tif where psd_id = ?", psd_id);
			const tiffilename = tifs[0].filename;
			res.download(tiffilename);
		}
	}
	catch(err) {
		res.send(err);
	}
	finally {
		await db.close();
	}
});

module.exports = router;
