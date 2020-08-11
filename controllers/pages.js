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

exports.POSTfindscreenshot = async (req, res) => {
	const {os, dev, lan, designer} = req.body;

	const db = new Database( {
		host		: process.env.DATABASE_HOST,
		user		: process.env.DATABASE_USER,
		password	: process.env.DATABASE_PASSWORD,
		database	: process.env.DATABASE_NAME
	} );

	try {

		const os_results = await db.query('select distinct os.nickname, os.name from os inner join psd where psd.os = os.nickname');
		const devices = await db.query('select distinct devices.nickname, devices.name from devices inner join psd on devices.nickname = psd.device');
		const lans = await db.query('select distinct language, country, lan_geo.lan_geo from lan_geo inner join psd on lan_geo.lan_geo = psd.lan_geo');
		const designers = await db.query('select distinct users.id, users.firstname, users.lastname from users inner join psd on users.id = psd.designer_id and users.type=1 ');


		let sqlquery = `
		select os, device, lan_geo as tif_lan_geo, designer_id, tif.preview, create_time, psd_id
		from
		tif inner join psd
		on tif.psd_id = psd.id`;

		sqlquery = `select os.name as os_name, device, tif_lan_geo, designer_id, preview, create_time, psd_id
		from
		os inner join (`.concat(sqlquery, ` ) tmp1
		on os.nickname = tmp1.os`);
		if (os)
			sqlquery = sqlquery.concat(` and os.nickname = "${os}"`);

		sqlquery = `select os_name, devices.name as dev_name, tif_lan_geo, designer_id, preview, create_time, psd_id
		from
		devices inner join (`.concat(sqlquery, ` ) tmp2
		on devices.nickname = tmp2.device`);
		if (dev)
			sqlquery = sqlquery.concat(` and devices.nickname = "${dev}"`);

		sqlquery = `select os_name, dev_name, lan_geo.language, lan_geo.country, designer_id, preview, create_time, psd_id
		from
		lan_geo inner join (`.concat(sqlquery, ` ) tmp3
		on lan_geo.lan_geo = tmp3.tif_lan_geo`);
		if (lan)
			sqlquery = sqlquery.concat(` and lan_geo.lan_geo = "${lan}"`);

		sqlquery = `select os_name, dev_name, language, country, users.id, users.firstname, users.lastname, preview, create_time, psd_id
		from
		users inner join (`.concat(sqlquery, ` ) tmp4
		on users.id = tmp4.designer_id`);
		if (designer)
			sqlquery = sqlquery.concat(` and users.id = "${designer}"`);

		const results = await db.query(sqlquery);
		res.render("content/findscreen", {
			rows : results,
			m_os : os_results,
			m_dev : devices,
			m_lan : lans,
			m_designer : designers
		});
	}
	catch(err) {
		throw err;
	}
	finally {
		await db.close();
	}
}

exports.GETfindscreenshot = async (req, res) => {
	const db = new Database( {
		host		: process.env.DATABASE_HOST,
		user		: process.env.DATABASE_USER,
		password	: process.env.DATABASE_PASSWORD,
		database	: process.env.DATABASE_NAME
	} );

	try {
		const os_results = await db.query('select distinct os.nickname, os.name from os inner join psd where psd.os = os.nickname');
		const devices = await db.query('select distinct devices.nickname, devices.name from devices inner join psd on devices.nickname = psd.device');
		const lans = await db.query('select distinct language, country, lan_geo.lan_geo from lan_geo inner join psd on lan_geo.lan_geo = psd.lan_geo');
		const designers = await db.query('select distinct users.id, users.firstname, users.lastname from users inner join psd on users.id = psd.designer_id and users.type=1 ');

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
		on devices.nickname = tmp4.device`;

		const results = await db.query(sqlquery);
		res.render("content/findscreen", {
			rows : results,
			m_os : os_results,
			m_dev : devices,
			m_lan : lans,
			m_designer : designers
		});
	}
	catch(err) {
		throw err;
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

		let cur = screen;
		while (cur.parent_id) {
			let parents = await db.query('select lan_geo, id, parent_id from psd where id = ?', cur.parent_id);
			let parent = parents[0];
			if (parent.lan_geo != cur.lan_geo)
				break;
			cur = parent;
		}
		let origin_id = cur.parent_id

		res.render('content/screenshot', {
			m_screen : screen,
			m_author_fullname : author_fullname,
			m_author_id : screen.designer_id,
			m_os_name : osnames[0],
			m_device_name : devicenames[0],
			m_language : `${languages[0].language} (${languages[0].country})`,
			origin_id : origin_id,
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

exports.GETlistofversions = async (req, res) => {
	const db = new Database({
		host		: process.env.DATABASE_HOST,
		user		: process.env.DATABASE_USER,
		password	: process.env.DATABASE_PASSWORD,
		database	: process.env.DATABASE_NAME
	});

	try {
		let id = req.query.psd_id;
		let psds = await db.query(`select * from psd where id = ${id}`);
		let cur = psds[0];

		let versions = await db.query(`select * from psd where code = "${cur.code}" && lan_geo = "${cur.lan_geo}"`);

		res.send(versions);
	}
	catch(err) {
		throw (err);
	}
	finally {
		await db.close();
	}
}

exports.GETlistoflocals = async (req, res) => {
	const db = new Database({
		host		: process.env.DATABASE_HOST,
		user		: process.env.DATABASE_USER,
		password	: process.env.DATABASE_PASSWORD,
		database	: process.env.DATABASE_NAME
	});

	try {
		let id = req.query.psd_id;
		let psds = await db.query('select * from psd where id = ?', id);
		if (psds.length > 0) {
			let lan_geo = psds[0].lan_geo;
			let children = await db.query(`select * from psd where parent_id = ${id} && lan_geo != "${lan_geo}"`);
			res.send(children);
			// res.render("content/findscreen", {
			// 	rows : children
			// });
		}
	}
	catch(err) {
		res.send(err);
	}
	finally {
		await db.close();
	}
}
