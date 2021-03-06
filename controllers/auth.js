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

f_redirect = (res, user) => {
	if (user.type == 1)
		return res.redirect(`/designer/?login=${user.login}&authorized=${true}`);
	if (user.type == 2)
		return (res.send("content manager page"));
	if (user.type == 3)
		return (res.send("graphic product artist page"));
	return(res.render("/"));
}

exports.login = async (req, res) => {
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
				return f_redirect(res, results[0]);
		})
	}
}

exports.register = (req, res) => {
	const {login, fullname, email, lan_geo, position, password, confirmedPassword} = req.body;
	// if (!login || !fullname || !email || !lan_geo || !position || !password || !confirmPassword) {
	// 	return res.render('register', {
	// 		message: 'provide data'
	// 	});
	// }
	db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
		if (error)
			throw error;
		else if (results.length > 0)
		{
			return res.render('register', {
				message: 'that email is already in use'
			});
		}
		else if (password != confirmedPassword)
		{
			return res.render('register', {
				message: 'passwords do not match'
			});
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
					return f_redirect(res, {
						login: login,
						name: fullname,
						email: email,
						lan_geo: lan_geo,
						type: position,
					});
				}
			});
		}
	});
}
