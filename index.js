const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
// const upload = require('express-fileupload');
const session = require("express-session");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const PublicDir = path.join((__dirname, 'public'));
const ViewsDir = path.join((__dirname, 'views'));
dotenv.config({path: './.env'});

const db = mysql.createConnection({
	host		: process.env.DATABASE_HOST,
	user		: process.env.DATABASE_USER,
	password	: process.env.DATABASE_PASSWORD,
	database	: process.env.DATABASE_NAME
});

db.connect((err) => {
	if (err) throw err;
	else console.log('mysql connected index');
});

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended : false}));
app.use(express.json());
app.use(express.static(PublicDir));
app.use(session({
	name: process.env.SESS_NAME,
	resave : false,
	secret : process.env.SESS_SECTER,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60 * 2, // two hours
		sameSite: true,
		secure: app.get('env') === 'production',
	}
}));

app.use((req, res, next) => {
	req.session.user_login = 'a';
	const user_login = req.session.user_login;

	if (user_login) {
		db.query('SELECT * FROM users WHERE login = ?', user_login, async (error, results) => {
			if (error) throw error;
			else
				req.session.user = results[0];
				res.send(req.session);
		});
	}
	else
		next();
})

// app.use(upload());

app.set('views', ViewsDir);
app.set('view engine', 'pug');

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/designer', require('./routes/designer'));
// app.use('/contman', require('./routes/contman'));
// app.use('/graphocart', require('./routes/graphocart'));
// app.use('/contentpage', require('./routes/contentpage'));

app.listen('4000', () => {
	console.log('server is listening on port 4000');
});
