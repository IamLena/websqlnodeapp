const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
// const upload = require('express-fileupload');
const session = require("express-session");

const PublicDir = path.join((__dirname, 'public'));
const ViewsDir = path.join((__dirname, 'views'));
dotenv.config({path: './.env'});

const app = express();

app.use(express.urlencoded({extended : false}));
app.use(express.json());
app.use(express.static(PublicDir));
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
