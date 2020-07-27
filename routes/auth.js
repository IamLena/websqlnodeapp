const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth')

router.get('/login', (req, res) => {
	res.render('login');
});
router.get('/register', (req, res) => {
	res.render('register');
});

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
// router.post('/register', (req, res) => {
// 	console.log("hehe");
// 	// res.send("hehehe");
// });

module.exports = router;
