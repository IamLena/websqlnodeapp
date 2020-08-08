const bcrypt = require('bcryptjs')
const Database = require('../db');

exports.GETlogin = (req, res) => {
	res.render('auth/login');
}

exports.GETregister = async (req, res) => {
	const db = new Database( {
		host		: process.env.DATABASE_HOST,
		user		: process.env.DATABASE_USER,
		password	: process.env.DATABASE_PASSWORD,
		database	: process.env.DATABASE_NAME
	});
	try {
		const results = await db.query("SELECT * FROM lan_geo");
		res.render('auth/register', { lans : results});
	}
	catch(err) {
		res.send(err)
	} finally {
		await db.close();
	}
}

exports.POSTlogin = async (req, res) => {
	const db = new Database( {
		host		: process.env.DATABASE_HOST,
		user		: process.env.DATABASE_USER,
		password	: process.env.DATABASE_PASSWORD,
		database	: process.env.DATABASE_NAME
	} );

	try {
		const {login, password} = req.body;

		if (!login || !password)
		{
			return res.status(400).render('auth/login', {
				message: "provide login and password"
			});
		}
		else
		{
			const results = await db.query("SELECT * FROM users WHERE login = ?", login);
			if (results.length == 0)
				return res.status(401).render('auth/login', {message : "user not found"});
			else if (!(await bcrypt.compare(password, results[0].password)))
				return res.status(402).render('auth/login', {message : "wrong password"});
			else
			{
				req.session.user = {
					id : results[0].id,
					login : results[0].login,
					fullname : `${results[0].firstname} ${results[0].lastname}`,
					initials : `${results[0].firstname[0]}${results[0].lastname[0]}`,
					email : results[0].email,
					type : results[0].type,
					lan_geo : results[0].lan_geo,
				};
				res.redirect("/personalpage");
			}
		}
	} catch ( err ) {
		res.send(err);
	} finally {
		await db.close();
	}
}

exports.POSTregister = async (req, res) => {
	const db = new Database( {
		host		: process.env.DATABASE_HOST,
		user		: process.env.DATABASE_USER,
		password	: process.env.DATABASE_PASSWORD,
		database	: process.env.DATABASE_NAME
	} );

	try {
		const {login, firstname, lastname, email, lan_geo, position, password, confirmedPassword} = req.body;
		const lans = await db.query("SELECT * FROM lan_geo");

		if (!login || !firstname || !lastname || !email || !lan_geo || !position || !password || !confirmedPassword || lan_geo=='Choose the language...')
			res.render('auth/register', { lans : lans, message: "provide data"});
		else if (password != confirmedPassword)
			res.render('auth/register', { lans : lans, message: 'passwords do not match'});
		else {
			const users = await db.query(`SELECT * FROM users WHERE login = "${login}"`);
			if (users.length > 0)
				res.render('auth/register', { lans : lans, message:  'that login is already in use'});
			else
			{
				const hashedPassword = await bcrypt.hash(password, 10);
				const idresults = await db.query("SELECT uuid() as id");
				const id = idresults[0].id;
				await db.query("INSERT into users SET ?", {
					id : id,
					login : login,
					firstname : firstname,
					lastname : lastname,
					email : email,
					type : position,
					password : hashedPassword,
					lan_geo : lan_geo
				});
				req.session.user = {
					id : id,
					login : login,
					fullname : `${firstname} ${lastname}`,
					initials : `${firstname[0]}${lastname[0]}`,
					email : email,
					type : position,
					lan_geo : lan_geo,
				};
				res.redirect("/personalpage");
			}
		}
	} catch ( err ) {
		res.send(err);
	} finally {
		await db.close();
	}
}

exports.POSTlogout = (req, res) => {
	req.session.destroy(err => {
		if (err)
			return res.redired('/');
	})
	res.clearCookie(process.env.SEES_NAME);
	res.redirect("/");
}

