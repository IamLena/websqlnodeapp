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
				req.session.user = results[0];
				res.redirect("/auth/personalpage");
			}
		}
	} catch ( err ) {
		res.send(err);
	} finally {
		await db.close();
	}
}

const register_error = async (db, res, send_message) => {
	try {
		const results = await db.query("SELECT * FROM lan_geo");
		res.render('auth/register', { lans : results, message: send_message});
	}
	catch(err) {
		res.send(err)
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
		const {login, fullname, email, lan_geo, position, password, confirmedPassword} = req.body;

		if (!login || !fullname || !email || !lan_geo || !position || !password || !confirmedPassword || lan_geo=='Choose the language...')
			return register_error(db, res, 'provide data');
		results = await db.query(`SELECT * FROM users WHERE login = "${login}"`);
		if (results.length > 0)
			return register_error(db, res, 'that login is already in use');
		else if (password != confirmedPassword)
			return register_error(db, res, 'passwords do not match');
		else
		{
			const hashedPassword = await bcrypt.hash(password, 10);
			const idresults = await db.query("SELECT uuid() as id")
			const id = idresults[0].id
			await db.query("INSERT into users SET ?", {
				id : id,
				login : login,
				name : fullname,
				email : email,
				type : position,
				password : hashedPassword,
				lan_geo : lan_geo
			});
			req.session.user = user;
			res.send('done');
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
