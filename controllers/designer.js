const mysql = require('mysql');
const fs = require("fs");
// const { url } = require('inspector');
// const { brotliDecompress } = require('zlib');
const { resolveSoa } = require('dns');
const Database = require('../db');
const  PSD = require('psd');

const rerender = async (req, res, code, content, height, width, ppi, lan_geo, os, device, msg) => {
	const db = new Database( {
		host		: process.env.DATABASE_HOST,
		user		: process.env.DATABASE_USER,
		password	: process.env.DATABASE_PASSWORD,
		database	: process.env.DATABASE_NAME
	} );

	try {
		const os_results = await db.query('select * from os');
		let device_results = [];
		const lan_geo_results = await db.query('select * from lan_geo');
		let pickedlan;
		let pickedos;
		if (lan_geo)
		{
			pickedlan = await db.query('select * from lan_geo where lan_geo = ?', lan_geo);
			pickedlan = pickedlan[0];
		}
		if (os)
		{
			pickedos = await db.query('select * from os where nickname = ?', os);
			pickedos = pickedos[0];
			if (device != "undefined")
			{
				device_results = await db.query('select * from devices where nickname = ?', device);
			}
			else
			{
				device_results = await db.query(`select devices.nickname as nickname, devices.name as name
				from
				devices inner join
				(select *
				from os_dev_comp
				where os_nick = "${os}") tmp
				on devices.nickname = tmp.dev_nick`);

			}
		}
		res.render('designer/create', {
			type: req.session.user.type,
			m_oss : os_results,
			m_pickedos : pickedos,
			m_devices : device_results,
			m_lans : lan_geo_results,
			m_pickedlan : pickedlan,
			m_code : code,
			m_content : content,
			m_height : height,
			m_width : width,
			m_ppi : ppi,
			message : msg
		})
	}
	catch(err) {
		res.send(err);
	}
	finally {
		await db.close();
	}
}

exports.GETCreateRecord = async (req, res) => {
	await rerender(req, res);
}

exports.POSTCreateRecord = async (req, res) => {
	let psd_id;
	let {code, content, height, width, ppi, lan_geo, os, device} = req.body;

	if (!code || !content || !height || !width || !ppi || os=="undefined" || device=="undefined") {
		await rerender(req, res, code, content, height, width, ppi, lan_geo, os, device, "provide data");
	}
	else if (!req.files || !req.files.grab || !req.files.psd || !req.files.tif) {
		await rerender(req, res, code, content, height, width, ppi, lan_geo, os, device, "add files");
	}
	else {
		const version = 1;
		let date = new Date();
		date = date.getUTCFullYear() + '-' +
			('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
			('00' + date.getUTCDate()).slice(-2) + ' ' +
			('00' + date.getUTCHours()).slice(-2) + ':' +
			('00' + date.getUTCMinutes()).slice(-2) + ':' +
			('00' + date.getUTCSeconds()).slice(-2);

		const cpcontent = content;
		content = content.replace(/ /g, "-");

		const initals = req.session.user.initials;

		//generating file paths
		let filename = `${os}/${device}/${code}_${content}_${lan_geo}_${initals}_${version}`;

		await fs.mkdir(`uploads/${os}`, (err) =>{
			if (err && err.code != "EEXIST") throw err;
		})

		await fs.mkdir(`uploads/${os}/${device}`, (err) => {
			if (err && err.code != "EEXIST") throw err;
		})

		await fs.mkdir(`public/previews/${os}`, (err) =>{
			if (err && err.code != "EEXIST") throw err;
		})

		await fs.mkdir(`public/previews/${os}/${device}`, (err) => {
			if (err && err.code != "EEXIST") throw err;
		})

		const grabfile = req.files.grab;
		// const previewfile = req.files.preview;
		const psdfile = req.files.psd;
		const tiffile = req.files.tif;

		grabfile.mv(`uploads/${filename}_grab.png`, (err) => {
			if (err) throw err;
		});

		psdfile.mv(`uploads/${filename}.psd`, (err) => {
			if (err) throw err;
		});

		tiffile.mv(`uploads/${filename}.tif`, (err) => {
			if (err) throw err;
		});

		const previewfile = PSD.open(`uploads/${filename}.psd`).then(function (psd) {
			return psd.image.saveAsPng(`public/previews/${filename}.png`);
		});

		const db = new Database( {
			host		: process.env.DATABASE_HOST,
			user		: process.env.DATABASE_USER,
			password	: process.env.DATABASE_PASSWORD,
			database	: process.env.DATABASE_NAME
		} );

		try {
			await db.query('INSERT INTO psd SET ?', {
				code : code,
				designer_id : req.session.user.id,
				lan_geo : lan_geo,
				version : 1,
				create_time : date,
				width : width,
				height : height,
				scale : 1,
				ppi : ppi,
				grab : `uploads/${filename}_grab.png`,
				preview : `/previews/${filename}.png`,
				filename : `uploads/${filename}.psd`,
				os : os,
				device : device,
				content : cpcontent,
			});

			const maxidres = await db.query("SELECT MAX(id) as psd_id FROM psd");
			psd_id = maxidres[0].psd_id
			await db.query('INSERT INTO tif SET ?', {
				psd_id : psd_id,
				width : width,
				height : height,
				scale : 1,
				ppi : ppi,
				filename : `uploads/${filename}.tif`,
				preview : `/previews/${filename}.png`,
			});
		}
		catch(err) {
			res.send(err);
		}
		finally {
			await db.close();
		}
	res.redirect(`/screenshot/?psd_id=${psd_id}`);
	}
}


exports.GETLocalizeRecord = async (req, res) => {
	const db = new Database( {
		host		: process.env.DATABASE_HOST,
		user		: process.env.DATABASE_USER,
		password	: process.env.DATABASE_PASSWORD,
		database	: process.env.DATABASE_NAME
	} );

	try {
		const lan_geo_results = await db.query('select * from lan_geo');
		res.render('designer/localize', {
			type : req.session.user.type,
			m_lans : lan_geo_results
		})
	}
	catch(err) {
		res.send(err);
	}
	finally {
		await db.close();
	}
}

exports.POSTLocalizeRecord = async (req, res) => {
	res.send('not done yet');
}


exports.GETModifyRecord = async (req, res) => {
	const db = new Database( {
		host		: process.env.DATABASE_HOST,
		user		: process.env.DATABASE_USER,
		password	: process.env.DATABASE_PASSWORD,
		database	: process.env.DATABASE_NAME
	} );

	try {
		res.render('designer/modify', {
			type : req.session.user.type
		})
	}
	catch(err) {
		res.send(err);
	}
	finally {
		await db.close();
	}
}

exports.POSTModifyRecord = async (req, res) => {
	res.send('not done yet');
}
