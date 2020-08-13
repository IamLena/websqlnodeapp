const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const upload = require('express-fileupload');
const session = require("express-session");
const bodyParser = require("body-parser");
const util = require( 'util' );
const mysql = require( 'mysql' );

const Database = require('./db');

const PublicDir = path.join((__dirname, 'public'));
const ViewsDir = path.join((__dirname, 'views'));
dotenv.config({path: './.env'});

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended : false}));
app.use(express.json());
app.use(express.static(PublicDir));
app.use(upload());

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

app.use(async (req, res, next) => {
	if (req.session.user_id) {
		const db = new Database( {
			host		: process.env.DATABASE_HOST,
			user		: process.env.DATABASE_USER,
			password	: process.env.DATABASE_PASSWORD,
			database	: process.env.DATABASE_NAME
		} );

		try {
			const rows = await db.query(`select * from users where id = "${req.session.used_id}"`);
			req.session.user = rows[0];
		} catch ( err ) {
			res.send(err);
		} finally {
			await db.close();
		}
	}
	next();
})

app.set('views', ViewsDir);
app.set('view engine', 'pug');

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/designer', require('./routes/designer'));
app.use('/contman', require('./routes/contman'));

app.listen('4000', () => {
	console.log('server is listening on port 4000');
});
