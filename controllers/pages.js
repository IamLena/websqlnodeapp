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
			throw err;
		} finally {
			await db.close();
		}
	}
	else
		res.redirect("/");
}

exports.POSTfindscreenshot = async (req, res) => {
	const {os, dev, lan, designer} = req.body;
	let picked_os, picked_dev, picked_lan, picked_designer;
	let os_results = [];
	let devices = [];
	let lans = [];
	let designers = [];

	const db = new Database( {
		host		: process.env.DATABASE_HOST,
		user		: process.env.DATABASE_USER,
		password	: process.env.DATABASE_PASSWORD,
		database	: process.env.DATABASE_NAME
	} );

	try {
		let sqlquery = `
		select os, device, psd.lan_geo as tif_lan_geo, designer_id, tif.preview, create_time, psd_id, version
		from
		tif inner join psd
		on tif.psd_id = psd.id`;

		sqlquery = `select os.nickname as os_nickname, os.name as os_name,
		device, tif_lan_geo, designer_id, preview, create_time, psd_id, version
		from
		os inner join (`.concat(sqlquery, ` ) tmp1
		on os.nickname = tmp1.os`);
		if (os)
		{
			sqlquery = sqlquery.concat(` and os.nickname = "${os}"`);
			picked_os = await db.query(`select * from os where os.nickname = "${os}"`);
			picked_os = picked_os[0];
		}

		sqlquery = `select os_nickname, os_name,
		devices.name as dev_name, devices.nickname as dev_nickname,
		tif_lan_geo, designer_id, preview, create_time, psd_id, version
		from
		devices inner join (`.concat(sqlquery, ` ) tmp2
		on devices.nickname = tmp2.device`);
		if (dev)
		{
			sqlquery = sqlquery.concat(` and devices.nickname = "${dev}"`);
			picked_dev = await db.query(`select * from devices where devices.nickname = "${dev}"`);
			picked_dev = picked_dev[0];
		}

		sqlquery = `select os_nickname, os_name, dev_name, dev_nickname,
		lan_geo.language, lan_geo.country, tif_lan_geo,
		designer_id, preview, create_time, psd_id, version
		from
		lan_geo inner join (`.concat(sqlquery, ` ) tmp3
		on lan_geo.lan_geo = tmp3.tif_lan_geo`);
		if (lan)
		{
			sqlquery = sqlquery.concat(` and lan_geo.lan_geo = "${lan}"`);
			picked_lan = await db.query(`select * from lan_geo where lan_geo.lan_geo = "${lan}"`);
			picked_lan = picked_lan[0];
		}

		sqlquery = `from
		users inner join (`.concat(sqlquery, ` ) tmp4
		on users.id = tmp4.designer_id`);

		if (designer)
		{
			sqlquery = sqlquery.concat(` and users.id = "${designer}"`);
			picked_designer = await db.query(`select id, firstname, lastname from users where id = "${designer}"`);
			picked_designer = picked_designer[0];
		}

		if (!os)
			os_results = await db.query(`select distinct os_name as name, os_nickname as nickname `.concat(sqlquery));

		if (!dev)
			devices = await db.query(`select distinct dev_name as name, dev_nickname as nickname `.concat(sqlquery));

		if (!lan)
			lans = await db.query(`select distinct language, country, tif_lan_geo as lan_geo `.concat(sqlquery));

		if (!designer)
			designers = await db.query(`select distinct firstname, lastname, designer_id as id `.concat(sqlquery));

		sqlquery = `select os_name, dev_name, language, country, designer_id, firstname, lastname, preview, create_time, psd_id, version `.concat(sqlquery, ` order by create_time desc`);
		const results = await db.query(sqlquery);

		res.render("content/findscreen", {
			rows : results,
			m_os : os_results,
			m_dev : devices,
			m_lan : lans,
			m_designer : designers,
			picked_os : picked_os,
			picked_dev : picked_dev,
			picked_lan : picked_lan,
			picked_designer : picked_designer
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
		select os_name, dev_name, language, country, users.id as designer_id, tif_lan_geo, users.firstname, users.lastname, preview, create_time, psd_id, version
		from users inner join
		(select os_name, dev_name, lan_geo.language, lan_geo.country, tif_lan_geo, designer_id, preview, create_time, psd_id, version
			from lan_geo inner join
			(select os_name, devices.name as dev_name, tif_lan_geo, designer_id, preview, create_time, psd_id, version
				from devices inner join (select os.name as os_name, device, tif_lan_geo, designer_id, preview, create_time, psd_id, version
					from os inner join
					( select os, device, lan_geo as tif_lan_geo, designer_id, tif.preview, create_time, psd_id, version
						from tif inner join psd
						on tif.psd_id = psd.id ) tmp1
					on os.nickname = tmp1.os) tmp2
				on devices.nickname = tmp2.device ) tmp3
			on lan_geo.lan_geo = tmp3.tif_lan_geo ) tmp4
		on users.id = tmp4.designer_id
		order by create_time desc`;

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

		let sqlquery = `
		select os_name, dev_name, language, country, users.id, users.firstname, users.lastname, preview, create_time, psd_id, version
		from users inner join
		(select os_name, dev_name, lan_geo.language, lan_geo.country, designer_id, preview, create_time, psd_id, version
			from lan_geo inner join
			(select os_name, devices.name as dev_name, tif_lan_geo, designer_id, preview, create_time, psd_id, version
				from devices inner join (select os.name as os_name, device, tif_lan_geo, designer_id, preview, create_time, psd_id, version
					from os inner join
					( select os, device, lan_geo as tif_lan_geo, designer_id, tif.preview, create_time, psd_id, version
						from tif inner join psd
						on tif.psd_id = psd.id and psd.code = "${cur.code}") tmp1
					on os.nickname = tmp1.os) tmp2
				on devices.nickname = tmp2.device ) tmp3
			on lan_geo.lan_geo = tmp3.tif_lan_geo and tmp3.tif_lan_geo = "${cur.lan_geo}") tmp4
		on users.id = tmp4.designer_id
		order by create_time desc`

		let versions =  await db.query(sqlquery);

		// res.send(versions);
		res.render("content/findscreen", {
			rows : versions,
			m_os : [],
			m_dev : [],
			m_lan : [],
			m_designer : []
		});
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

			let sqlquery = `
		select os_name, dev_name, language, country, users.id, users.firstname, users.lastname, preview, create_time, psd_id, version
		from users inner join
		(select os_name, dev_name, lan_geo.language, lan_geo.country, designer_id, preview, create_time, psd_id, version
			from lan_geo inner join
			(select os_name, devices.name as dev_name, tif_lan_geo, designer_id, preview, create_time, psd_id, version
				from devices inner join (select os.name as os_name, device, tif_lan_geo, designer_id, preview, create_time, psd_id, version
					from os inner join
					( select os, device, lan_geo as tif_lan_geo, designer_id, tif.preview, create_time, psd_id, version
						from tif inner join psd
						on tif.psd_id = psd.id and psd.parent_id = "${id}") tmp1
					on os.nickname = tmp1.os) tmp2
				on devices.nickname = tmp2.device ) tmp3
			on lan_geo.lan_geo = tmp3.tif_lan_geo and tmp3.tif_lan_geo != "${lan_geo}") tmp4
		on users.id = tmp4.designer_id
		order by create_time desc`

			let children = await db.query(sqlquery);
			res.render("content/findscreen", {
				rows : children,
				m_os : [],
				m_dev : [],
				m_lan : [],
				m_designer : []
			});
		}
	}
	catch(err) {
		throw err;
	}
	finally {
		await db.close();
	}
}

exports.POSTmatrix = async (req, res) => {
	const page_id =  req.query.page_id;
	if (!page_id)
	{
		res.send('will find it!');
	}
	else {
		const db = new Database({
			host		: process.env.DATABASE_HOST,
			user		: process.env.DATABASE_USER,
			password	: process.env.DATABASE_PASSWORD,
			database	: process.env.DATABASE_NAME
		});

		try {
			let lan = req.body.lan;
			let picked_lan;

			if (lan) {
				picked_lan = await db.query('select * from lan_geo where lan_geo = ?', lan);
				picked_lan = picked_lan[0];
			}

			let lans = await db.query('select * from lan_geo');

			let page = await db.query('select * from pages where id = ?', page_id);
			let rows = await db.query(`select psd_id, place_id, page_id, link, place_preview as preview, comment, tif_id
			from tif right join (
			select id as place_id, page_id, link, preview as place_preview, comment, tif_id from placeholder left join (
			select place_id, tif_id, lan_geo from local_placeholder where lan_geo = "${lan}"
			) tmp on placeholder.id = tmp.place_id where page_id = "${page_id}") tmp2
			on tif.id = tmp2.tif_id`);

			if (page.length > 0)
			{
				page = page[0];
				let author = await db.query('select * from users where id = ?', page.cm_id);
				if (author.length > 0) {
					author = author[0];
					res.render('content/matrix', {
						type : req.session.user.type,
						m_page : page,
						m_author_id : author.id,
						m_author_fullname : `${author.firstname} ${author.lastname}`,
						m_rows : rows,
						m_lan : lans,
						picked_lan : picked_lan
					});
				}
			}
		}
		catch(err) {
			res.send(err);
			throw(err);
		}
		finally {
			await db.close();
		}
	}
}

exports.GETmatrix = async (req, res) => {
	const page_id =  req.query.page_id;
	if (!page_id)
	{
		res.send('will find it!');
	}
	else {
		const db = new Database({
			host		: process.env.DATABASE_HOST,
			user		: process.env.DATABASE_USER,
			password	: process.env.DATABASE_PASSWORD,
			database	: process.env.DATABASE_NAME
		});

		try {
			let page = await db.query('select * from pages where id = ?', page_id);
			let rows = await db.query('select * from placeholder where page_id = ?', page_id);
			let lans = await db.query('select * from lan_geo');

			if (page.length > 0)
			{
				page = page[0];
				let author = await db.query('select * from users where id = ?', page.cm_id);
				if (author.length > 0) {
					author = author[0];
					res.render('content/matrix', {
						type : req.session.user.type,
						m_page : page,
						m_author_id : author.id,
						m_author_fullname : `${author.firstname} ${author.lastname}`,
						m_rows : rows,
						m_lan : lans
					});
				}
			}
		}
		catch(err) {
			res.send(err);
			throw(err);
		}
		finally {
			await db.close();
		}
	}
}


exports.GETfindmatrix = async (req, res) => {
	const db = new Database({
		host		: process.env.DATABASE_HOST,
		user		: process.env.DATABASE_USER,
		password	: process.env.DATABASE_PASSWORD,
		database	: process.env.DATABASE_NAME
	});

	try {
		const contman_id = req.body.contman;
		let picked_contman;

		let pages = await db.query('select name, pages.id, link, comment, cm_id, firstname, lastname, link, version, create_time from pages inner join users on pages.cm_id = users.id where version = 1');
		let m_contman;
		if (contman_id)
		{
			picked_contman = await db.query('select * from users where id = ?', contman_id);
			picked_contman = picked_contman[0];
			m_contman = await db.query('select distinct users.id, users.firstname, users.lastname from pages inner join users on pages.cm_id = users.id where users.id != ?', contman_id);
		}
		else {
			m_contman = await db.query('select distinct users.id, users.firstname, users.lastname from pages inner join users on pages.cm_id = users.id');
		}

		res.render('content/findmatrix', {
			type : req.session.user.type,
			m_contman : m_contman,
			rows : pages,
			picked_contman : picked_contman
		});
	}
	catch(err) {
		res.send(err);
		throw(err);
	}
	finally {
		await db.close();
	}
}
