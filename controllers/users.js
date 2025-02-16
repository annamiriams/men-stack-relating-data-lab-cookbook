const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

// INDEX
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.render('users/index.ejs', { users: users });
    } catch (error) {
        console.log (error);
        res.redirect('/');
    }
});

// SHOW
router.get('/:userId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        // const pantryItem = currentUser.pantry.id(req.params.itemId);
        res.render('users/show.ejs', { user: currentUser });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

module.exports = router;