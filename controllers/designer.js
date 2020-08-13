const mysql = require('mysql');
const fs = require("fs");
const Database = require('../db');
const PSD = require('psd');

const uploadfiles = (grabfile, psdfile, tiffile, previewfile, filename) => {
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

	// const previewfile = PSD.open(`uploads/${filename}.psd`).then(function (psd) {
	// 	return psd.image.saveAsPng(`public/previews/${filename}.png`);
	// });
}

const createfolders = async (os, device) => {
	await fs.mkdir(`uploads/${os}`, (err) =>{
		if (err && err.code != "EEXIST") throw err;
	});

	await fs.mkdir(`uploads/${os}/${device}`, (err) => {
		if (err && err.code != "EEXIST") throw err;
	});

	await fs.mkdir(`public/previews/${os}`, (err) =>{
		if (err && err.code != "EEXIST") throw err;
	});

	await fs.mkdir(`public/previews/${os}/${device}`, (err) => {
		if (err && err.code != "EEXIST") throw err;
	});
}


const creatererender = async (req, res, code, content, height, width, ppi, lan_geo, os, device, msg) => {
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
	await creatererender(req, res);
}

exports.POSTCreateRecord = async (req, res) => {
	let psd_id;
	let {code, content, height, width, ppi, lan_geo, os, device} = req.body;

	if (!code || !content || !height || !width || !ppi || os=="undefined" || device=="undefined") {
		await creatererender(req, res, code, content, height, width, ppi, lan_geo, os, device, "provide data");
	}
	else if (!req.files || !req.files.grab || !req.files.psd || !req.files.tif || !req.files.preview) {
		await creatererender(req, res, code, content, height, width, ppi, lan_geo, os, device, "add files");
	}
	else {
		const db = new Database( {
			host		: process.env.DATABASE_HOST,
			user		: process.env.DATABASE_USER,
			password	: process.env.DATABASE_PASSWORD,
			database	: process.env.DATABASE_NAME
		} );

		const sizes = await db.query(`select height, width, ppi from devices where nickname = "${device}"`);
		if ((height % sizes[0].height) != (width % sizes[0].width) && (height % sizes[0].width) != (width % sizes[0].height))
		{
			await db.close();
			await creatererender(req, res, code, content, height, width, ppi, lan_geo, os, device, "wrong sizes");
		}
		const version = 1
		let datetime = await db.query('select now() as now');
		datetime = datetime[0].now;
		const cpcontent = content;
		content = content.replace(/ /g, "-");
		const initals = req.session.user.initials;

		//generating file paths
		let filename = `${os}/${device}/${code}_${content}_${lan_geo}_${initals}_${version}`;
		await createfolders(os, device);
		const grabfile = req.files.grab;
		const psdfile = req.files.psd;
		const tiffile = req.files.tif;
		const previewfile = req.files.preview;
		uploadfiles(grabfile, psdfile, tiffile, previewfile, filename);



		if (!lan_geo) lan_geo = req.session.user.lan_geo;

		try {
			await db.query('INSERT INTO psd SET ?', {
				code : code,
				designer_id : req.session.user.id,
				lan_geo : lan_geo,
				version : 1,
				create_time : datetime,
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

const localizererender = async (req, res, psd_id, lan_geo, msg) => {
	const db = new Database( {
		host		: process.env.DATABASE_HOST,
		user		: process.env.DATABASE_USER,
		password	: process.env.DATABASE_PASSWORD,
		database	: process.env.DATABASE_NAME
	} );

	try {
		const lan_geo_results = await db.query('select * from lan_geo');
		let pickedlan;
		if (lan_geo)
		{
			pickedlan = await db.query("select * from lan_geo where lan_geo = ?", lan_geo);
			pickedlan = pickedlan[0];
		}
		res.render('designer/localize', {
			type : req.session.user.type,
			m_lans : lan_geo_results,
			m_pickedlan : pickedlan,
			m_id : psd_id,
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

exports.GETLocalizeRecord = async (req, res) => {
	await localizererender(req, res);
}

const check_if_localized = async (res, psd, lan_geo) => {
	if (psd.lan_geo == lan_geo)
			return true;

	const db = new Database( {
		host		: process.env.DATABASE_HOST,
		user		: process.env.DATABASE_USER,
		password	: process.env.DATABASE_PASSWORD,
		database	: process.env.DATABASE_NAME
	} );

	try {
		const children = await db.query('select * from psd where parent_id = ?', psd.id);
		for (let i = 0; i < children.length; i++)
			if (children[i].lan_geo == lan_geo && children[i].version == 1){
				await db.close();
				return true;
			}
	}
	catch(err) {
		res.send(err);
	}
	finally {
		await db.close();
	}
	return false;
}

exports.POSTLocalizeRecord = async (req, res) => {
	let psd_id = req.body.id;
	let lan_geo = req.body.lan_geo;

	if (!psd_id || lan_geo =="undefined")
		await localizererender(req, res, psd_id, lan_geo, "provide data");
	else if (!req.files || !req.files.grab || !req.files.psd || !req.files.tif || !req.files.preview)
		await localizererender(req, res, psd_id, lan_geo, "add files");
	else {
		const db = new Database( {
			host		: process.env.DATABASE_HOST,
			user		: process.env.DATABASE_USER,
			password	: process.env.DATABASE_PASSWORD,
			database	: process.env.DATABASE_NAME
		});

		try {
			const prev_psd_res = await db.query('select * from psd where id = ?', psd_id);
			if (prev_psd_res.length == 0)
				await localizererender(req, res, psd_id, lan_geo, "wrong id, not found");
			else {
				const prev_psd = prev_psd_res[0];
				if (await check_if_localized(res, prev_psd, lan_geo))
					await localizererender(req, res, psd_id, lan_geo, "already localized");
				else {
					const version = 1;
					const initals = req.session.user.initials;

					let date = await db.query('select now() as now');
					date = date[0].now;
					const content = prev_psd.content.replace(/ /g, "-");

					const filename = `${prev_psd.os}/${prev_psd.device}/${prev_psd.code}_${content}_${lan_geo}_${initals}_${version}`;
					await createfolders(prev_psd.os, prev_psd.device);
					const grabfile = req.files.grab;
					const psdfile = req.files.psd;
					const tiffile = req.files.tif;
					const previewfile =  req.files.preview;
					uploadfiles(grabfile, psdfile, tiffile, previewfile, filename);

					await db.query('INSERT INTO psd SET ?', {
						code : prev_psd.code,
						designer_id : req.session.user.id,
						lan_geo : lan_geo,
						version : version,
						create_time : date,
						width : prev_psd.width,
						height : prev_psd.height,
						scale : prev_psd.scale,
						ppi : prev_psd.ppi,
						grab : `uploads/${filename}_grab.png`,
						preview : `/previews/${filename}.png`,
						filename : `uploads/${filename}.psd`,
						os : prev_psd.os,
						device : prev_psd.device,
						content : prev_psd.content,
						parent_id : prev_psd.id
					});

					const maxidres = await db.query("SELECT MAX(id) as psd_id FROM psd");
					new_psd_id = maxidres[0].psd_id
					await db.query('INSERT INTO tif SET ?', {
						psd_id : new_psd_id,
						width : prev_psd.width,
						height : prev_psd.height,
						scale : prev_psd.scale,
						ppi : prev_psd.ppi,
						filename : `uploads/${filename}.tif`,
						preview : `/previews/${filename}.png`,
					});

					res.redirect(`/screenshot/?psd_id=${new_psd_id}`);
				}
			}
		}
		catch(err) {
			// res.send(err);
			throw (err);
		}
		finally {
			await db.close();
		}
	}
}


exports.GETModifyRecord = async (req, res) => {
	res.render('designer/modify', {
		type : req.session.user.type
	})
}

const check_if_modified = async (psd) => {
	const db = new Database( {
		host		: process.env.DATABASE_HOST,
		user		: process.env.DATABASE_USER,
		password	: process.env.DATABASE_PASSWORD,
		database	: process.env.DATABASE_NAME
	} );

	try {
		const children = await db.query('select * from psd where parent_id = ?', psd.id);
		for (let i = 0; i < children.length; i++)
			if (children[i].version > psd.version)
			{
				await db.close();
				return true;
			}
	}
	catch(err) {
		res.send(err);
	}
	finally {
		await db.close();
	}
	return false;
}

exports.POSTModifyRecord = async (req, res) => {
	//IF THIS PSD IS NOT THE LAST VERSION!
	let psd_id = req.body.id;

	if (!psd_id) {
		res.render('designer/modify', {
			type : req.session.user.type,
			m_id : psd_id,
			message : "provide data"
		});
	}
	else if (!req.files || !req.files.grab || !req.files.psd || !req.files.tif || req.files.preview) {
		res.render('designer/modify', {
			type : req.session.user.type,
			m_id : psd_id,
			message : "add files"
		});
	}
	else {
		const db = new Database( {
			host		: process.env.DATABASE_HOST,
			user		: process.env.DATABASE_USER,
			password	: process.env.DATABASE_PASSWORD,
			database	: process.env.DATABASE_NAME
		} );

		try {
			const initals = req.session.user.initials;
			let date = await db.query('select now() as now');
			date = date[0].now;

			const prev_psd_res = await db.query('select * from psd where id = ?', psd_id);
			if (prev_psd_res.length == 0) {
				res.render('designer/modify', {
					type : req.session.user.type,
					m_id : psd_id,
					message : "wrong id, not found"
				});
			}
			const prev_psd = prev_psd_res[0];
			if (await check_if_modified(prev_psd))
			{
				res.render('designer/modify', {
					type : req.session.user.type,
					m_id : psd_id,
					message : "trying to modify not the latest version"
				});
				await db.close();
				return;
			}

			const version = prev_psd.version + 1;
			const content = prev_psd.content.replace(/ /g, "-");

			//generating file paths
			let filename = `${prev_psd.os}/${prev_psd.device}/${prev_psd.code}_${content}_${prev_psd.lan_geo}_${initals}_${version}`;
			await createfolders(prev_psd.os, prev_psd.device);
			const grabfile = req.files.grab;
			const psdfile = req.files.psd;
			const tiffile = req.files.tif;
			const previewfile = req.files.preview;
			uploadfiles(grabfile, psdfile, tiffile, previewfile, filename);

			await db.query('INSERT INTO psd SET ?', {
				code : prev_psd.code,
				designer_id : req.session.user.id,
				lan_geo : prev_psd.lan_geo,
				version : version,
				create_time : date,
				width : prev_psd.width,
				height : prev_psd.height,
				scale : prev_psd.scale,
				ppi : prev_psd.ppi,
				grab : `uploads/${filename}_grab.png`,
				preview : `/previews/${filename}.png`,
				filename : `uploads/${filename}.psd`,
				os : prev_psd.os,
				device : prev_psd.device,
				content : prev_psd.content,
				parent_id : prev_psd.id
			});

			const maxidres = await db.query("SELECT MAX(id) as psd_id FROM psd");
			new_psd_id = maxidres[0].psd_id
			await db.query('INSERT INTO tif SET ?', {
				psd_id : new_psd_id,
				width : prev_psd.width,
				height : prev_psd.height,
				scale : prev_psd.scale,
				ppi : prev_psd.ppi,
				filename : `uploads/${filename}.tif`,
				preview : `/previews/${filename}.png`,
			});

			res.redirect(`/screenshot/?psd_id=${new_psd_id}`);
		}
		catch(err) {
			res.send(err);
		}
		finally {
			await db.close();
		}
	}
}
