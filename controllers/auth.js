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
		const {login, firstname, lastname, email, lan_geo, position, password, confirmedPassword} = req.body;

		if (!login || !firstname || !lastname || !email || !lan_geo || !position || !password || !confirmedPassword || lan_geo=='Choose the language...')
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
			const user = {
				id : id,
				login : login,
				firstname : firstname,
				lastname : lastname,
				email : email,
				type : position,
				password : hashedPassword,
				lan_geo : lan_geo
			};
			await db.query("INSERT into users SET ?", user);
			req.session.user = user;
			res.redirect("/auth/personalpage");
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

exports.personalPage = async (req, res) => {
	if (req.session.user) {
		const db = new Database( {
			host		: process.env.DATABASE_HOST,
			user		: process.env.DATABASE_USER,
			password	: process.env.DATABASE_PASSWORD,
			database	: process.env.DATABASE_NAME
		} );

		try {
			if (!req.query.id)
			{
				const user = req.session.user;
				const results = await db.query("select * from lan_geo where lan_geo = ?", user.lan_geo);
				const language = `${results[0].language} (${results[0].country})`;
				const page_config = {
					firstname : user.firstname,
					lastname : user.lastname,
					lan_geo : language,
					type : user.type,
					userpagetype : user.type,
					image_path : '/images/anon.png'
				};
				res.render('personalpages/userpage', page_config);
			}
			else {
				const user_id = req.query.id;
				const users = await db.query('select * from users where id = ?', user_id)
				const user = users[0];
				const results = await db.query("select * from lan_geo where lan_geo = ?", user.lan_geo);
				const language = `${results[0].language} (${results[0].country})`;
				const page_config = {
					firstname : user.firstname,
					lastname : user.lastname,
					lan_geo : language,
					image_path : '/images/anon.png',
					userpagetype : user.type,
					type : req.session.user.type
				};
				res.render('personalpages/userpage', page_config);
			}
			// if (user.type == 1)
			// 	res.render('personalpages/designer', page_config);
			// else if (user.type == 2)
			// 	res.render('personalpages/contman', page_config);
			// else if (user.type == 3)
			// 	res.render('personalpages/graphart', page_config);
		} catch ( err ) {
			res.send(err);
		} finally {
			await db.close();
		}
	}
	else
		res.redirect("/");
}
