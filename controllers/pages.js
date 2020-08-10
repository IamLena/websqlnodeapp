const bcrypt = require('bcryptjs')
const Database = require('../db');

exports.GEThomepage = async (req, res) => {
	res.render("index");
}

exports.GETpersonalpage = async (req, res) => {
	if (req.session.user) {
		const db = new Database( {
			host		: process.env.DATABASE_HOST,
			user		: process.env.DATABASE_USER,
			password	: process.env.DATABASE_PASSWORD,
			database	: process.env.DATABASE_NAME
		} );

		try {
			if (!req.query.id)
			{
				const user = req.session.user;
				const lans = await db.query("select * from lan_geo where lan_geo = ?", user.lan_geo);
				const language = `${lans[0].language} (${lans[0].country})`;
				let img = await db.query("select img from users where id = ?", user.id);
				img = img[0].img;
				if (!img) img = '/images/anon.png';
				res.render('userpage', {
					fullname : user.fullname,
					lan_geo : language,
					image_path : img,
					userpagetype : user.type,
					type : user.type,
				});
			}
			else {
				const user_id = req.query.id;
				const users = await db.query('select * from users where id = ?', user_id)
				const user = users[0];
				const lans = await db.query("select * from lan_geo where lan_geo = ?", user.lan_geo);
				const language = `${lans[0].language} (${lans[0].country})`;
				const page_config = {
					fullname : `${user.firstname} ${user.lastname}`,
					lan_geo : language,
					image_path : (user.img ? user.img : '/images/anon.png'),
					userpagetype : user.type,
					type : req.session.user.type
				};
				res.render('userpage', page_config);
			}
		} catch ( err ) {
			res.send(err);
		} finally {
			await db.close();
		}
	}
	else
		res.redirect("/");
}

exports.GETfindscreenshot = async (req, res) => {
	const db = new Database( {
		host		: process.env.DATABASE_HOST,
		user		: process.env.DATABASE_USER,
		password	: process.env.DATABASE_PASSWORD,
		database	: process.env.DATABASE_NAME
	} );

	try {
		const os_results = await db.query('select * from os');
		const sqlquery = `
		select devices.name as dev_name, os_name, language, country, firstname, lastname, preview, create_time, psd_id, designer_id
		from
		devices inner join (
		select os.name as os_name, language, country, firstname, lastname, preview, create_time, device, psd_id, designer_id
		from os
		inner join (
		select language, country, firstname, lastname, preview, create_time, os, device, psd_id, designer_id
		from
		lan_geo inner join (
		select firstname, lastname, preview, create_time, tif_lan_geo, os, device, psd_id, designer_id
		from
		users inner join (
		select tif.id as tif_id, psd_id, tif.preview, designer_id, lan_geo as tif_lan_geo, create_time,  os, device
		from
		tif inner join psd
		on tif.psd_id = psd.id
		) tmp1
		on users.id = tmp1.designer_id
		) tmp2
		on lan_geo.lan_geo = tmp2.tif_lan_geo
		) tmp3
		on os.nickname = tmp3.os
		) tmp4
		on devices.nickname = tmp4.device`
		// const desc = true;
		// if (desc)
		// 	sqlquery = sqlquery.concat(`order by create_time desc`);
		const results = await db.query(sqlquery);
		res.render("content/findscreen", {
			rows : results,
			oss : os_results
		});
	}
	catch(err) {

	}
	finally {
		await db.close();
	}
}

exports.GETscreenshot = async (req, res) => {
	if (!req.query.psd_id)
	{
		res.redirect('/findscreenshot')
		return;
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
}

exports.GETdownloadpsd = async (req, res) => {
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
}

exports.GETdownloadtif = async (req, res) => {
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
}
