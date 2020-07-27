const mysql = require('mysql');
const bcrypt = require('bcryptjs')

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

exports.login = async (req, res) => {
	const {login, password} = req.body;

	if (!login || !password)
	{
		return res.status(400).render('login', {
			message: "provide login and password"
		});
	}
	else
	{
		db.query("SELECT login, password FROM users WHERE login = ?", login, async (err, results) => {
			if (err)
				console.log(err);
			else if (results.length == 0)
				return res.status(401).render('login', {message : "user not found"});
			else if (!(await bcrypt.compare(password, results[0].password)))
				return res.status(402).render('login', {message : "wrong password"});
			else
				return res.redirect("/index");
		})
	}
}

exports.register = async (req, res) => {
	console.log('here');
	console.log(req.body);
}
