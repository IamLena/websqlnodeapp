const mysql = require('mysql');
const fs = require("fs");
const { url } = require('inspector');
const { brotliDecompress } = require('zlib');
const { resolveSoa } = require('dns');
const Database = require('../db');

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
	else if (!req.files || !req.files.grab || !req.files.psd || !req.files.tif || !req.files.preview) {
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

		const initals = `${req.session.user.firstname[0]}${req.session.user.lastname[0]}`

		//generating file paths
		let filename = `${os}/${device}/${code}_${content}_${lan_geo}_${initals}_${version}`;

		fs.mkdir(`uploads/${os}`, (err) =>{
			if (err && err.code != "EEXIST") throw err;
		})

		fs.mkdir(`uploads/${os}/${device}`, (err) => {
			if (err && err.code != "EEXIST") throw err;
		})

		fs.mkdir(`public/previews/${os}`, (err) =>{
			if (err && err.code != "EEXIST") throw err;
		})

		fs.mkdir(`public/previews/${os}/${device}`, (err) => {
			if (err && err.code != "EEXIST") throw err;
		})

		const grabfile = req.files.grab;
		const previewfile = req.files.preview;
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

		previewfile.mv(`public/previews/${filename}.png`, (err) => {
			if (err) throw err;
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

exports.GETCreateRecord2 = async (req, res) => {
	const code = req.query.code; // perhapse autogenerated
	const content = req.query.content;
	const height = req.query.height;
	const width = req.query.width;
	const ppi = req.query.ppi;
	const designer_login = req.query.login;
	const uploadfilesflag = req.query.filesflag;

	const lan_geo = req.query.lan_geo;
	const os = req.query.os;
	const device = req.query.device;
	let ossql;
	let devsql;
	if (os)
	{
		ossql = `select * from os where nickname = "${os}"`;
		if (device) // not undefined if passing /?device=undefined
			devsql = `select * from devices where nickname = "${device}"`;
		else
		{
			devsql = `select devices.nickname as nickname, devices.name as name
			from
			devices inner join
			(select *
			from os_dev_comp
			where os_nick = "${os}") tmp
			on devices.nickname = tmp.dev_nick`
		}
	}
	else
	{
		ossql = `select * from os`;
		devsql = `select * from devices where nickname = "nodevice"`;
	}

	langeosql = `select * from lan_geo`;

	db.query(ossql, async (err, osresults) => {
		if(err) throw err;
		else {
			db.query(devsql, async (err, devresults) => {
				if (err) throw err;
				else {
					db.query(langeosql, async (err, lansresults) => {
						if (err) throw err;
						else res.render('designer/create', {
							m_code : code,
							m_content : content,
							m_height : height,
							m_width : width,
							m_ppi : ppi,
							m_login : designer_login,
							m_lan_geo : lan_geo,
							m_lans : lansresults,
							m_oss : osresults,
							m_devices : devresults,
							m_files : uploadfilesflag
						})
					});
				}
			});
		}
	});
}

exports.POSTCreateRecord2 = (req, res) => {
	//get data from form
	let {code, content, height, width, ppi, os, device, lan_geo} = req.body;

	const login = req.query.login;

	let urlquery;
	//redirect to the form again for more information
	urlquery = `/designer/create/?login=${login}`;
	if (code) urlquery = urlquery.concat('&', `code=${code}`);
	if (content) urlquery = urlquery.concat('&', `content=${content}`);
	if (height) urlquery = urlquery.concat('&', `height=${height}`);
	if (width) urlquery = urlquery.concat('&', `width=${width}`);
	if (ppi) urlquery = urlquery.concat('&', `ppi=${ppi}`);
	if (os) urlquery = urlquery.concat('&', `os=${os}`);
	if (device) urlquery = urlquery.concat('&', `device=${device}`);
	if (lan_geo) urlquery = urlquery.concat('&', `lan_geo=${lan_geo}`);

	if (!code || !content || !height || !width || !ppi || !os || !device)
	{
		res.redirect(urlquery);
	}

	let grabfile, previewfile, psdfile, tiffile;
	if (req.files)
	{
		grabfile = req.files.grab;
		previewfile = req.files.preview;
		psdfile = req.files.psd;
		tiffile = req.files.tif;
	}

	if (!grabfile || !previewfile || !psdfile || !tiffile)
	{
		urlquery = urlquery.concat('&', `filesflag=true`);
		res.redirect(urlquery);
	}
	//all inputed data is available here
	// parent_id will be null
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

	//generating file paths
	let filename = `uploads/${os}/${device}/${code}_${content}_${lan_geo}_${login}_${version}`;

	fs.mkdir(`uploads/${os}`, (err) =>{
		if (err && err.code != "EEXIST") throw err;
	})

	fs.mkdir(`uploads/${os}/${device}`, (err) => {
		if (err && err.code != "EEXIST") throw err;
	})

	grabfile.mv(`${filename}`, (err) => {
		if (err) throw err;
	});

	previewfile.mv(`${filename}.jpg`, (err) => {
		if (err) throw err;
	});

	psdfile.mv(`${filename}.psd`, (err) => {
		if (err) throw err;
	});

	tiffile.mv(`${filename}.tif`, (err) => {
		if (err) throw err;
	});

	//add record to the database

	db.query('INSERT INTO psd SET ?', {
		code : code,
		designer : login,
		lan_geo : lan_geo,
		version : 1,
		create_time : date,
		width : width,
		height : height,
		scale : 1,
		ppi : ppi,
		grab : `${filename}`,
		preview : `${filename}.jpg`,
		filename : `${filename}.psd`,
		os : os,
		device : device,
		content : cpcontent,
	}, (error, results) => {
		if (error)
			throw error;
	});

	db.query("SELECT MAX(id) as psd_id FROM psd", (err, results) => {
		if (err) throw err;
		db.query('INSERT INTO tif SET ?', {
			psd_id : results[0].psd_id,
			width : width,
			height : height,
			scale : 1,
			ppi : ppi,
			filename : `${filename}.tif`,
			preview : `${filename}.jpg`,
		}, (error, results) => {
			if (error)
				throw error;
		});
	});


	//done
	res.send("the record is created");
}
