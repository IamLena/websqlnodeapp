const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');

const PublicDir = path.join((__dirname, 'public'));
const ViewsDir = path.join((__dirname, 'views'));
dotenv.config({path: './.env'});

const app = express();
app.use(express.urlencoded({extended : false}));
app.use(express.json());
app.use(express.static(PublicDir));

app.set('views', ViewsDir);
app.set('view engine', 'pug');

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

const db = mysql.createConnection({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME
});

db.connect((error) => {
	if (error)
		throw error;
	else
		console.log('mysql connected');
})

app.listen('4000', () => {
	console.log('server is listening on port 4000');
});
