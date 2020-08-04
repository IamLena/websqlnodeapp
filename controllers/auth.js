const mysql = require('mysql');
const bcrypt = require('bcryptjs')

const db = mysql.createConnection({
	host		: process.env.DATABASE_HOST,
	user		: process.env.DATABASE_USER,
	password	: process.env.DATABASE_PASSWORD,
	database	: process.env.DATABASE_NAME
});

db.connect((err) => {
	if (err) throw err;
	else console.log('mysql connected auth');
});


exports.GETlogin = (req, res) => {
	res.render('auth/login');
}

exports.POSTlogin = async (req, res) => {
	const {login, password} = req.body;

	if (!login || !password)
	{
		return res.status(400).render('auth/login', {
			message: "provide login and password"
		});
	}
	else
	{
		db.query("SELECT * FROM users WHERE login = ?", login, async (err, results) => {
			if (err)
				throw error;
			else if (results.length == 0)
				return res.status(401).render('auth/login', {message : "user not found"});
			else if (!(await bcrypt.compare(password, results[0].password)))
				return res.status(402).render('auth/login', {message : "wrong password"});
			else
			{
				req.session.user_login = login; // that is not working asynchonic! need a promise
				req.session.user = results[0];
				//redirect to /personalpage
			}
		});
	}
	res.send(req.session);
}

const register_error = (res, send_message) => {
	return db.query("SELECT * FROM lan_geo", async (err, results) => {
		if (err) throw error;
		else res.render('auth/register', { lans : results, message: send_message});
	});
}

exports.POSTregister = (req, res) => {
	const {login, fullname, email, lan_geo, position, password, confirmedPassword} = req.body;

	if (!login || !fullname || !email || !lan_geo || !position || !password || !confirmedPassword || lan_geo=='Choose the language...') {
		return register_error(res, 'provide data');
	}
	db.query('SELECT * FROM users WHERE login = ?', [login], async (error, results) => {
		if (error)
			throw error;
		else if (results.length > 0)
		{
			return register_error(res, 'that login is already in use');
		}
		else if (password != confirmedPassword)
		{
			return register_error(res, 'passwords do not match');
		}
		else
		{
			const hashedPassword = await bcrypt.hash(password, 10);
			db.query('INSERT INTO users SET ?', {
				login: login,
				name: fullname,
				email: email,
				lan_geo: lan_geo,
				type: position,
				password: hashedPassword,
			}, (error, results) => {
				if (error)
					throw error;
				else
				{
					req.session.user_login = login;
					// res.send(req.session);
					// res.redirect('/auth/personalpage');
				}
			});
		}
	});
}

exports.POSTlogout = (req, res) => {
	req.session.destroy(err => {
		if (err)
			return res.redired('/');
	})
	res.clearCookie(process.env.SEES_NAME);
	res.redirect("/");
}
