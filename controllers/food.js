const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

// ROUTER LOGIC HERE
// '/users/:userId/foods' --> beginning of the link because of the middleware in server.js

// INDEX
router.get('/', (req, res) => {
    res.render('foods/index.ejs')
});

// NEW
router.get('/new', async (req, res) => {
    res.render('foods/new.ejs')
});

// CREATE
router.post('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        currentUser.pantry.push(req.body);
        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/foods`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// SHOW

// EDIT

// UPDATE

// DELETE


module.exports = router;