const mysql = require('mysql');
const fs = require("fs");
const Database = require('../db');
const PSD = require('psd');

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
		res.send('done');
		//res.redirect(`/pages/?page_id=${id}`);
	}
	catch(err) {
		res.send(err);
		throw(err);
	}
	finally {
		await db.close();
	}
}
