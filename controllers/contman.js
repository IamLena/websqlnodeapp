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
		res.redirect(`/matrix/?page_id=${id}`);
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
	const page_id = req.body.id;

	let {comment, link} = req.body;
	if (!link) {
		res.render('contman/addplaceholder', {
			type : req.session.user.type,
			m_link : link,
			m_comment : comment,
			m_page_id : page_id,
			message : "provide data"
		});
		return;
	}
	if (!req.files || !req.files.preview) {
		res.render('contman/addplaceholder', {
			type : req.session.user.type,
			m_link : link,
			m_comment : comment,
			m_page_id : page_id,
			message : "add preview file"
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

		let previewfile = req.files.preview;
		let filename = `/placeholders/${page_id}/${id}.png`

		await fs.mkdir(`public/placeholders/${page_id}`, (err) => {
			if (err && err.code != "EEXIST") throw err;
		});

		previewfile.mv(`public/${filename}`, (err) => {
			if (err) throw err;
		});

		const newplaceholder = {
			id : id,
			page_id : page_id,
			link : link,
			comment : comment ? comment : "",
			preview : filename
		}
		await db.query('INSERT INTO placeholder SET ?', newplaceholder);
		res.redirect(`/matrix/?page_id=${page_id}`);
	}
	catch(err) {
		res.send(err);
		throw(err);
	}
	finally {
		await db.close();
	}
}
