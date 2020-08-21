const mysql = require('mysql');
const fs = require("fs");
const Database = require('../db');
const PSD = require('psd');
const psd = require('psd');

const uploadfiles = async (grabfile, psdfile, tiffile, previewfile, os, device, filename) => {
	await grabfile.mv(`uploads/${os}/${device}/${filename}/${filename}_grab.png`, (err) => {
		if (err) throw err;
	});

	await psdfile.mv(`uploads/${os}/${device}/${filename}/${filename}.psd`, (err) => {
		if (err) throw err;
	});

	await tiffile.mv(`uploads/${os}/${device}/${filename}/${filename}.tif`, (err) => {
		if (err) throw err;
	});

	await previewfile.mv(`public/previews/${os}/${device}/${filename}.png`, (err) => {
		if (err) throw err;
	});

	// const previewfile = PSD.open(`uploads/${filename}.psd`).then(function (psd) {
	// 	return psd.image.saveAsPng(`public/previews/${filename}.png`);
	// });
}

const createfolders = (os, device, filename) => {
	fs.mkdir(`uploads/${os}`, (err) =>{
		if (err && err.code != "EEXIST") throw err;
	});

	fs.mkdir(`uploads/${os}/${device}`, (err) => {
		if (err && err.code != "EEXIST") throw err;
	});

	fs.mkdir(`uploads/${os}/${device}/${filename}`, (err) => {
		if (err && err.code != "EEXIST") throw err;
	});

	fs.mkdir(`public/previews/${os}`, (err) =>{
		if (err && err.code != "EEXIST") throw err;
	});

	fs.mkdir(`public/previews/${os}/${device}`, (err) => {
		if (err && err.code != "EEXIST") throw err;
	});
}

const creatererender = async (req, res, code, content, height, width, ppi, lan_geo, os, device, msg) => {
	const db = new Database();
	try {
		let lan_results, pickedlan;
		lan_results = await db.query('select * from lan_geo');
		if (lan_geo) {
			pickedlan = await db.query('select * from lan_geo where lan_geo = ?', lan_geo);
			if (pickedlan.length == 0) throw "pickedlans is empty"
			pickedlan = pickedlan[0];
		}

		let os_results, pickedos, dev_results, pickeddev;

		if (os)
		{
			pickedos = await db.query('select * from os where nickname = ?', os);
			if (pickedos.length == 0) throw "pickedoss is empty";
			pickedos = pickedos[0];

			dev_results = await db.query(`select devices.nickname as nickname, devices.name as name
				from
				devices inner join
				(select *
				from os_dev_comp
				where os_nick = "${os}") tmp
				on devices.nickname = tmp.dev_nick`);

			os_results = await db.query('select * from os where nickname != ?', os);
		}
		else {
			dev_results = [];
			os_results = await db.query('select * from os');
		}

		if (device)
		{
			pickeddev = await db.query('select * from devices where nickname = ?', device);
			if (pickeddev.length == 0) throw "pickeddev is empty";
			pickeddev = pickeddev[0];
		}

		res.render('designer/create', {
			type: req.session.user.type,
			m_oss : os_results,
			m_pickedos : pickedos,
			m_devices : dev_results,
			m_pickeddev : pickeddev,
			m_lans : lan_results,
			m_pickedlan : pickedlan,
			m_code : code,
			m_content : content,
			m_height : height,
			m_width : width,
			m_ppi : ppi,
			message : msg
		});
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
	let {code, content, height, width, ppi, lan_geo, os, device} = req.body;

	if (!code || !content || !height || !width || !ppi || !os || !device) {
		await creatererender(req, res, code, content, height, width, ppi, lan_geo, os, device, "provide data");
	}
	else if (!req.files || !req.files.grab || !req.files.psd || !req.files.tif || !req.files.preview) {
		if (!lan_geo) lan_geo = req.session.user.lan_geo;
		await creatererender(req, res, code, content, height, width, ppi, lan_geo, os, device, "add files");
	}
	else {
		const db = new Database();
		try {
			const sizes = await db.query(`select height, width, ppi from devices where nickname = ?`, device);
			if ((height % sizes[0].height) != (width % sizes[0].width) && (height % sizes[0].width) != (width % sizes[0].height)) {
				await creatererender(req, res, code, content, height, width, ppi, lan_geo, os, device, "wrong sizes");
				throw "finish";
			}

			let datetime = await db.query('select now() as now');
			datetime = datetime[0].now;
			let psd_id = await db.query('select uuid() as id')
			psd_id = psd_id[0].id;
			let tif_id = await db.query('select uuid() as id')
			tif_id = tif_id[0].id;
			const version = 1;
			const scale = 1;
			const dashed_content = content.replace(/ /g, "-");
			const initials = req.session.user.initials;
			if (!lan_geo) lan_geo = req.session.user.lan_geo;

			let filename = `${code}_${dashed_content}_${lan_geo}_${initials}_${version}`;

			const psds = await db.query('select filename from psd where filename = ?', `uploads/${os}/${device}/${filename}/${filename}.psd`);
			if (psds.length != 0) {
				await creatererender(req, res, code, content, height, width, ppi, lan_geo, os, device, "already exists in database");
				throw "finish";
			}

			createfolders(os, device, filename);
			const grabfile = req.files.grab;
			const psdfile = req.files.psd;
			const tiffile = req.files.tif;
			const previewfile = req.files.preview;
			await uploadfiles(grabfile, psdfile, tiffile, previewfile, os, device, filename);

			await db.query('INSERT INTO psd SET ?', {
				id : psd_id,
				code : code,
				designer_id : req.session.user.id,
				lan_geo : lan_geo,
				version : version,
				create_time : datetime,
				width : width,
				height : height,
				scale : scale,
				ppi : ppi,
				grab : `uploads/${os}/${device}/${filename}/${filename}_grab.png`,
				filename : `uploads/${os}/${device}/${filename}/${filename}.psd`,
				preview : `/previews/${os}/${device}/${filename}.png`,
				os : os,
				device : device,
				content : content,
			});

			await db.query('INSERT INTO tif SET ?', {
				id : tif_id,
				psd_id : psd_id,
				width : width,
				height : height,
				scale : scale,
				ppi : ppi,
				filename : `uploads/${os}/${device}/${filename}/${filename}.tif`,
				preview : `/previews/${os}/${device}/${filename}.png`,
			});

			res.redirect(`/screenshot/?psd_id=${psd_id}`);
		}
		catch(err) {
			if (err != "finish")
				res.send(err);
		}
		finally {
			await db.close();
		}
	}
}

const localizererender = async (req, res, psd_id, lan_geo, msg, localized_id) => {
	const db = new Database();
	try {
		let lan_results, pickedlan;
		lan_results = await db.query('select * from lan_geo');
		if (lan_geo) {
			pickedlan = await db.query('select * from lan_geo where lan_geo = ?', lan_geo);
			if (pickedlan.length == 0) throw "pickedlans is empty"
			pickedlan = pickedlan[0];
		}

		res.render('designer/localize', {
			type : req.session.user.type,
			m_lans : lan_results,
			m_pickedlan : pickedlan,
			m_id : psd_id,
			message : msg,
			localized_id : localized_id,
		});
	}
	catch(err) {
		res.send(err);
	}
	finally {
		await db.close();
	}
}

exports.GETLocalizeRecord = async (req, res) => {
	await localizererender(req, res, req.query.psd_id);
}

exports.POSTLocalizeRecord = async (req, res) => {
	let psd_id = req.body.id;
	let lan_geo = req.body.lan_geo;

	if (!psd_id || !lan_geo)
		await localizererender(req, res, psd_id, lan_geo, "provide data");
	else if (!req.files || !req.files.grab || !req.files.psd || !req.files.tif || !req.files.preview)
		await localizererender(req, res, psd_id, lan_geo, "add files");
	else {
		const db = new Database();
		try {
			const prev_psd_res = await db.query('select * from psd where id = ?', psd_id);
			if (prev_psd_res.length == 0) {
				await localizererender(req, res, psd_id, lan_geo, "wrong psd_id");
				throw "finish";
			}
			const prev_psd = prev_psd_res[0];
			const children = await db.query('select * from psd where parent_id = ?', psd_id);
			for (let i = 0; i < children.length; i++) {
				if (children[i].lan_geo == lan_geo && children[i].version == 1) {
					await localizererender(req, res, psd_id, lan_geo, "already localized", children[i].id);
					throw "finish";
				}
			}
			let datetime = await db.query('select now() as now');
			datetime = datetime[0].now;
			let new_psd_id = await db.query('select uuid() as id')
			new_psd_id = new_psd_id[0].id;
			let tif_id = await db.query('select uuid() as id')
			tif_id = tif_id[0].id;
			const version = 1;
			const dashed_content = prev_psd.content.replace(/ /g, "-");
			const initials = req.session.user.initials;

			const filename = `${prev_psd.code}_${dashed_content}_${lan_geo}_${initials}_${version}`;
			createfolders(prev_psd.os, prev_psd.device, filename);
			const grabfile = req.files.grab;
			const psdfile = req.files.psd;
			const tiffile = req.files.tif;
			const previewfile =  req.files.preview;
			await uploadfiles(grabfile, psdfile, tiffile, previewfile, prev_psd.os, prev_psd.device, filename);

			await db.query('INSERT INTO psd SET ?', {
				id : new_psd_id,
				code : prev_psd.code,
				designer_id : req.session.user.id,
				lan_geo : lan_geo,
				version : version,
				create_time : datetime,
				width : prev_psd.width,
				height : prev_psd.height,
				scale : prev_psd.scale,
				ppi : prev_psd.ppi,
				grab : `uploads/${prev_psd.os}/${prev_psd.device}/${filename}/${filename}_grab.png`,
				filename : `uploads/${prev_psd.os}/${prev_psd.device}/${filename}/${filename}.psd`,
				preview : `/previews/${prev_psd.os}/${prev_psd.device}/${filename}.png`,
				os : prev_psd.os,
				device : prev_psd.device,
				content : prev_psd.content,
				parent_id : prev_psd.id
			});

			await db.query('INSERT INTO tif SET ?', {
				id : tif_id,
				psd_id : new_psd_id,
				width : prev_psd.width,
				height : prev_psd.height,
				scale : prev_psd.scale,
				ppi : prev_psd.ppi,
				filename : `uploads/${prev_psd.os}/${prev_psd.device}/${filename}/${filename}.tif`,
				preview : `/previews/${prev_psd.os}/${prev_psd.device}/${filename}.png`,
			});

			res.redirect(`/screenshot/?psd_id=${new_psd_id}`);
		}
		catch(err) {
			if (err != "finish") res.send(err);
		}
		finally {
			await db.close();
		}
	}
}

exports.GETModifyRecord = async (req, res) => {
	if (req.query.psd_id) {
		res.render('designer/modify', {
			type : req.session.user.type,
			m_id : req.query.psd_id
		});
	}
	else {
		res.render('designer/modify', {
			type : req.session.user.type
		});
	}
}

exports.POSTModifyRecord = async (req, res) => {
	let psd_id = req.body.id;

	if (!psd_id) {
		res.render('designer/modify', {
			type : req.session.user.type,
			message : "provide data"
		});
	}
	else if (!req.files || !req.files.grab || !req.files.psd || !req.files.tif || !req.files.preview) {
		res.render('designer/modify', {
			type : req.session.user.type,
			m_id : psd_id,
			message : "add files"
		});
	}
	else {
		const db = new Database();

		try {
			const prev_psd_res = await db.query('select * from psd where id = ?', psd_id);
			if (prev_psd_res.length == 0) {
				res.render('designer/modify', {
					type : req.session.user.type,
					m_id : psd_id,
					message : "wrong id"
				});
				throw "finish";
			}
			const prev_psd = prev_psd_res[0];

			const children = await db.query('select * from psd where parent_id = ?', psd_id);
			for (let i = 0; i < children.length; i++) {
				if (children[i].version > psd.version)
				{
					res.render('designer/modify', {
						type : req.session.user.type,
						m_id : psd_id,
						message : "trying to modify not the latest version"
					});
					throw "finish";
				}
			}

			let datetime = await db.query('select now() as now');
			datetime = datetime[0].now;
			let new_psd_id = await db.query('select uuid() as id')
			new_psd_id = new_psd_id[0].id;
			let tif_id = await db.query('select uuid() as id')
			tif_id = tif_id[0].id;
			const initials = req.session.user.initials;
			const version = prev_psd.version + 1;
			const dashed_content = prev_psd.content.replace(/ /g, "-");

			const filename = `${prev_psd.code}_${dashed_content}_${prev_psd.lan_geo}_${initials}_${version}`;
			createfolders(prev_psd.os, prev_psd.device, filename);
			const grabfile = req.files.grab;
			const psdfile = req.files.psd;
			const tiffile = req.files.tif;
			const previewfile =  req.files.preview;
			await uploadfiles(grabfile, psdfile, tiffile, previewfile, prev_psd.os, prev_psd.device, filename);

			await db.query('INSERT INTO psd SET ?', {
				id : new_psd_id,
				code : prev_psd.code,
				designer_id : req.session.user.id,
				lan_geo : prev_psd.lan_geo,
				version : version,
				create_time : datetime,
				width : prev_psd.width,
				height : prev_psd.height,
				scale : prev_psd.scale,
				ppi : prev_psd.ppi,
				grab : `uploads/${prev_psd.os}/${prev_psd.device}/${filename}/${filename}_grab.png`,
				filename : `uploads/${prev_psd.os}/${prev_psd.device}/${filename}/${filename}.psd`,
				preview : `/previews/${prev_psd.os}/${prev_psd.device}/${filename}.png`,
				os : prev_psd.os,
				device : prev_psd.device,
				content : prev_psd.content,
				parent_id : prev_psd.id
			});

			await db.query('INSERT INTO tif SET ?', {
				id : tif_id,
				psd_id : new_psd_id,
				width : prev_psd.width,
				height : prev_psd.height,
				scale : prev_psd.scale,
				ppi : prev_psd.ppi,
				filename : `uploads/${prev_psd.os}/${prev_psd.device}/${filename}/${filename}.tif`,
				preview : `/previews/${prev_psd.os}/${prev_psd.device}/${filename}.png`,
			});

			res.redirect(`/screenshot/?psd_id=${new_psd_id}`);
		}
		catch(err) {
			if (err != "finish") res.send(err);
		}
		finally {
			await db.close();
		}
	}
}
