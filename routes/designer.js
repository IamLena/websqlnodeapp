const express = require('express');
const router = express.Router();
const DesignerController = require("../controllers/designer")
const Database = require("../db");

// const redirectLogin = (req, res, next) => {
// 	if (!req.session.user)
// 		res.redirect('/auth/login');
// 	else
// 		next();
// }

//DOESNT WORK AS EXPECTED BECAISE IT IS NOT POST METHOD OF FORM SUMBITION
const redirectLogin = async (req, res, next) => {
	if (!req.session.user)
	{
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
					req.session.user = {
						id : results[0].id,
						login : results[0].login,
						fullname : `${results[0].firstname} ${results[0].lastname}`,
						initials : `${results[0].firstname[0]}${results[0].lastname[0]}`,
						email : results[0].email,
						type : results[0].type,
						lan_geo : results[0].lan_geo,
					};
				}
			}
		} catch ( err ) {
			res.send(err);
		} finally {
			await db.close();
		}
	}
	next();
}

router.get('/create', redirectLogin, DesignerController.GETCreateRecord);
router.post('/create', redirectLogin, DesignerController.POSTCreateRecord);

router.get('/localize', redirectLogin, DesignerController.GETLocalizeRecord);
router.post('/localize', redirectLogin, DesignerController.POSTLocalizeRecord);

router.get('/modify', redirectLogin, DesignerController.GETModifyRecord);
router.post('/modify', redirectLogin, DesignerController.POSTModifyRecord);

module.exports = router;
