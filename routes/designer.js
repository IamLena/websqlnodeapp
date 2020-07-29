const express = require('express');
const { render, compileClientWithDependenciesTracked } = require('pug');
const router = express.Router();

const mysql = require('mysql');

//create connection
const db = mysql.createConnection({
	host		: process.env.DATABASE_HOST,
	user		: process.env.DATABASE_USER,
	password	: process.env.DATABASE_PASSWORD,
	database	: process.env.DATABASE_NAME
});

//connect
db.connect((err) => {
	if (err) {
		throw err;
	}
	else {
		console.log('mysql connected auth');
	}
});

router.get('/', (req, res) => {
	login = req.query.login;
	if (login) {
		db.query("SELECT * FROM users WHERE login = ?", login, async (err, results) => {
			if (err)
				throw err;
			authorized = req.query.authorized;
			res.render('designer/designer', {
				login : results[0].login,
				name : results[0].name,
				lan_geo : results[0].lan_geo,
				email : results[0].email,
				authorized : authorized,
			});
		});
	}
	else {
		res.render('designer/designer', {
			login : "nologin",
			name : "noname",
			lan_geo : "nogeo",
			email : "",
		});
	}
});

router.get('/create', (req, res) => {
	let {code, content, height, width, ppi, grab, preview, psd, tif, lan_geo, os, device, login} = req.query;
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

	langeosql = lan_geo ? `select * from lan_geo where lan_geo = "${lan_geo}"` : `select * from lan_geo`;

	db.query(ossql, async (err, osresults) => {
		if(err) throw err;
		else {
			db.query(devsql, async (err, devresults) => {
				if (err) throw err;
				else {
					db.query(langeosql, async (err, lansresults) => {
						if (err) throw err;
						else res.render('designer/create', {
							m_lans : lansresults,
							m_oss : osresults,
							m_devices : devresults
						})
					});
				}
			});
		}
	});
});

router.post('/create', (req, res) => {
	// login
	let {code, content, height, width, ppi, grab, preview, psd, tif, lan_geo, os, device} = req.body;
	res.redirect(`/designer/create/?code=${code}&content=${content}&geight=${height}&width=${width}&ppi=${ppi}&lan_geo=${lan_geo}&os=${os}&device=${device}`);
});

module.exports = router;
