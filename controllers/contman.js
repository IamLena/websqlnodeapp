const mysql = require('mysql');
const fs = require("fs");
const Database = require('../db');
const PSD = require('psd');
const { execPath } = require('process');

exports.GETCreateMatrix = async (req, res) => {
	res.render('contman/create', {
		type : req.session.user.type
	});
}

exports.POSTCreateMatrix = async (req, res) => {
	let {name, comment, link} = req.body;
	if (!name || !link) {
		res.render('contman/create', {
			type : req.session.user.type,
			m_name : name,
			m_link : link,
			m_comment : comment,
			message : "provide data"
		});
		return;
	}
	if (!comment) comment = "";
	const db = new Database({
		host		: process.env.DATABASE_HOST,
		user		: process.env.DATABASE_USER,
		password	: process.env.DATABASE_PASSWORD,
		database	: process.env.DATABASE_NAME
	});

	try {
		let id = await db.query('select uuid() as id');
		id = id[0].id;
		let now = await db.query('select now() as now');
		now = now[0].now;
		const newpage = {
			id : id,
			name : name,
			link : link,
			comment : comment,
			cm_id : req.session.user.id,
			create_time : now
		}
		await db.query('INSERT INTO pages SET ?', newpage);
		res.redirect(`/modify/?page_id=${id}`);
	}
	catch(err) {
		res.send(err);
		throw(err);
	}
	finally {
		await db.close();
	}
}

exports.POSTaddplaceholder = async (req, res) => {
	const db = new Database({
		host		: process.env.DATABASE_HOST,
		user		: process.env.DATABASE_USER,
		password	: process.env.DATABASE_PASSWORD,
		database	: process.env.DATABASE_NAME
	});

	try {
		const page_id = req.body.id;
		let link = req.body.link;
		let comment = req.body.comment;
		if (!comment) comment =  "";
		let tif_id = req.body.tif_id;

		if (link && tif_id) {
			// tif_id = parseInt(tif_id);
			const screens = await db.query('select tif.id, device, os from tif inner join psd on tif.psd_id = psd.id and tif.id = ?', tif_id);
			if (screens.length == 0) {
				// invalid id
				res.send('invalid id');
				throw 'invalid id';
			}
			const screen = screens[0];

			const ids = await db.query('select uuid() as id');
			let newplaceholder = {
				id: ids[0].id,
				page_id : page_id,
				link : link,
				comment : comment,
				os : screen.os,
				device : screen.device,
				tif_id : screen.id
			}
			await db.query('insert into placeholder set ?', newplaceholder)
			res.redirect(`/contman/modify/?page_id=${page_id}`);
		}
		else {
			const pages = await db.query('select * from pages where id = ?', page_id);
			if (pages.length == 0) {
				// invalid id
				res.send('invalid id');
				throw 'invalid id';
			}
			const page = pages[0];

			const author_lans = await db.query('select lan_geo from users where id = ?', page.cm_id);
			const lan = author_lans[0].lan_geo;
			let sqlquery = `select tif.id as tif_id, psd_id, designer_id, tif.preview as tif_preview, version, create_time, os, device from tif inner join psd on tif.psd_id = psd.id and lan_geo = "${lan}"`;

			let os_results = await db.query(`select distinct os.nickname, os.name from os inner join ( `.concat(sqlquery, ` ) tmp on os.nickname = tmp.os`));
			let dev_results = await db.query(`select distinct devices.nickname, devices.name from devices inner join ( `.concat(sqlquery, ` ) tmp on devices.nickname = tmp.device`));
			let designer_results =  await db.query(`select distinct users.id, concat(users.firstname, " ", users.lastname) as fullname from users inner join ( `.concat(sqlquery, ` ) tmp on users.id = tmp.designer_id`));

			sqlquery = `select os.name as os_name, tif_id, psd_id, designer_id, tif_preview, version, create_time, device from os inner join ( `.concat(sqlquery, ` ) tmp1 on os.nickname = tmp1.os`);
			sqlquery = `select os_name, devices.name as dev_name, tif_id, psd_id, designer_id, tif_preview, version, create_time from devices inner join ( `.concat(sqlquery, ` ) tmp2 on devices.nickname = tmp2.device`);
			sqlquery = `select os_name, dev_name, tif_id, psd_id, tif_preview, version, create_time, designer_id, concat(users.firstname, " ", users.lastname) as fullname from users inner join ( `.concat(sqlquery, ` ) tmp3 on users.id = tmp3.designer_id`);

			const results = await db.query(sqlquery);
			res.render('contman/addplaceholder', {
				type : req.session.user.type,
				m_page_id : page_id,
				m_os : os_results,
				m_dev : dev_results,
				m_designer : designer_results,
				rows : results,
				m_link : link,
				m_comment : comment,
				m_tif_id : tif_id,
				message: "provide data"
			});
		}
	}
	catch(err) {
		throw err;
		res.send(err);
	}
	finally {
		await db.close();
	}
}

exports.GETcreateholders = async (req, res) => {
	const page_id = req.query.page_id;
	if (!page_id){
		res.redirect('/findmatrix');
		return;
	}

	const db = new Database({
		host		: process.env.DATABASE_HOST,
		user		: process.env.DATABASE_USER,
		password	: process.env.DATABASE_PASSWORD,
		database	: process.env.DATABASE_NAME
	})

	try {
		const pages = await db.query('select id, link, name, comment, create_time, cm_id from pages where id = ?', page_id);
		if (pages.length == 0) {
			res.redirect('/findmatrix');
			await db.close();
			return;
		}
		m_page = pages[0];
		const author_id = m_page.cm_id;

		const users_res = await db.query(`select id, lan_geo, concat(firstname, " ", lastname) as fullname, lan_geo as lan from users where id = "${author_id}"`);
		if (users_res.length == 0) {
			res.send('wrong author id');
			await db.close();
			return;
		}
		const m_author = users_res[0];

		sqlquery = `select link, comment, placeholder.tif_id, psd_id, preview as preview, content
		from
		placeholder inner join (
		select tif.id as tif_id, psd_id, tif.preview, psd.lan_geo, content
		from
		tif inner join psd
		on tif.psd_id = psd.id ) tmp
		on tmp.tif_id = placeholder.tif_id
		where page_id = "${page_id}" and
		lan_geo = "${m_author.lan_geo}"`;

		const rows = await db.query(sqlquery);

		const lans = await db.query('select * from lan_geo');

		res.render('contman/modify', {
			m_user : req.session.user,
			type : req.session.user.type,
			m_page : m_page,// link, name, comment, create_time, id
			m_author : m_author, //id, fullname, lan
			m_rows : rows, //link, preview, comment, tif_id, tif_filename, id
			m_lan : lans
		})
	}
	catch(err) {
		throw err;
		res.send(err);
	}
	finally {
		await db.close();
	}
}

exports.POSTpublish = async (req, res) => {
	const page_id = req.body.id;
	const db = new Database({
		host		: process.env.DATABASE_HOST,
		user		: process.env.DATABASE_USER,
		password	: process.env.DATABASE_PASSWORD,
		database	: process.env.DATABASE_NAME
	});

	try {
		const pages = await db.query('select * from pages where id = ?', page_id);
		if (pages.length == 0)
		{
			res.send('err');
			throw err;
		}
		const page = pages[0];

		const ids = await db.query('select uuid() as id');
		const id = ids[0].id;

		const times = await db.query('select now() as now');
		const time = times[0].now;

		const version = page.version + 1

		const newpage = {
			id : id,
			name : page.name,
			comment : page.comment,
			cm_id : page.cm_id,
			parent_id : page.id,
			link : page.link,
			version : version,
			create_time : time
		}

		await db.query('insert into pages set ?', newpage);
		res.send('done');
	}
	catch(err) {
		res.send('err');
		throw err;
	}
	finally{
		await db.close();
	}
}
