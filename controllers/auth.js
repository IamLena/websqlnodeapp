const bcrypt = require('bcryptjs')
const Database = require('../db');

exports.GETlogin = (req, res) => {
	res.render('auth/login');
}

exports.POSTlogin = async (req, res) => {
	const db = new Database();

	try {
		const {login, password} = req.body;

		if (!login || !password)
			res.render('auth/login', { message: "provide login and password"});
		else
		{
			const users = await db.query("SELECT * FROM users WHERE login = ?", login);
			if (users.length == 0)
				res.render('auth/login', {message : "user not found"});
			else if (!(await bcrypt.compare(password, users[0].password)))
				res.render('auth/login', {message : "wrong password"});
			else
			{
				req.session.user_id = users[0].id;
				res.redirect("/personalpage");
			}
		}
	} catch ( err ) {
		res.send(err);
	} finally {
		await db.close();
	}
}

exports.GETregister = async (req, res) => {
	const db = new Database();
	try {
		const lans = await db.query("SELECT * FROM lan_geo");
		res.render('auth/register', {lans : lans});
	}
	catch(err) {
		res.send(err)
	} finally {
		await db.close();
	}
}

exports.POSTregister = async (req, res) => {
	const db = new Database();

	try {
		const {login, firstname, lastname, email, lan_geo, position, password, confirmedPassword} = req.body;
		const lans = await db.query("SELECT * FROM lan_geo");

		if (!login || !firstname || !lastname || !email || !lan_geo || !position || !password || !confirmedPassword)
			res.render('auth/register', { lans : lans, message: "provide data"});
		else if (password != confirmedPassword)
			res.render('auth/register', { lans : lans, message: 'passwords do not match'});
		else {
			const users = await db.query(`SELECT * FROM users WHERE login = ?`, login);
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
				req.session.user_id = id;
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

