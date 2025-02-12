const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

// ROUTER LOGIC HERE
// '/users/:userId/foods' --> beginning of the link because of the middleware in server.js

router.get('/', (req, res) => {
    res.render('foods/index.ejs')
});

router.get('/new', async (req, res) => {
    res.render('foods/new.ejs')
});

module.exports = router;