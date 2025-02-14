const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

// ROUTER LOGIC HERE
// '/users/:userId/foods' --> beginning of the link because of the middleware in server.js

// INDEX
router.get('/', async (req, res) => {
    // This line retrieves the current user from the database by using the User.findById() method. It fetches the user document based on the _id stored in the session (req.session.user._id). The await keyword ensures the server waits for the user data to be fetched from the database before continuing the next steps.
    const currentUser = await User.findById(req.session.user._id);
    // After the current user's data is fetched, the res.render() function is called to render an EJS template (foods/index.ejs). The second argument to res.render() is an object where properties will be passed to the view template. In this case, the object contains pantry: currentUser.pantry, which means the user's pantry data (probably an array or object) will be passed to the template under the pantry variable.
    // { pantry: currentUser.pantry } is the object you are passing to the template.
    res.render('foods/index.ejs', { pantry: currentUser.pantry });
});

// NEW
router.get('/new', async (req, res) => {
    res.render('foods/new.ejs');
});

// CREATE
router.post('/', async (req, res) => {
    try {
        // This line retrieves the current user from the database by using the User.findById() method. It fetches the user document based on the _id stored in the session (req.session.user._id). The await keyword ensures the server waits for the user data to be fetched from the database before continuing the next steps.
        const currentUser = await User.findById(req.session.user._id);
        currentUser.pantry.push(req.body);
        await currentUser.save();
        // redirect back to the user's pantry
        res.redirect(`/users/${currentUser._id}/foods`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// SHOW
// router.get('/:itemId', async (req, res) => {
//     // res.send(`here is your request param: ${req.params.itemId}`);    
//     try {
//         const currentUser = await User.findById(req.session.user._id);
//         const pantryItem = currentUser.pantry.id(req.params.itemId);
//         res.render('foods/show.ejs', { pantry: pantryItem });
//     } catch (error) {
//         console.log(error);
//         res.redirect('/');
//     }
// });

// EDIT
router.get('/:itemId/edit', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const pantryItem = currentUser.pantry.id(req.params.itemId);
        res.render(`foods/edit.ejs`, { pantry: pantryItem });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// UPDATE
router.put('/:itemId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const pantryItem = currentUser.pantry.id(req.params.itemId);
        pantryItem.set(req.body);
        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/foods`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// DELETE
router.delete('/:itemId', async (req, res) => {
    // const currentUser = await User.findById(req.session.user._id);
    // res.send(currentUser.pantry)
    try {
        // Look up the user from req.session
        const currentUser = await User.findById(req.session.user._id);
        // Use the Mongoose .deleteOne() method to delete
        // a pantry item using the id supplied from req.params
        currentUser.pantry.id(req.params.itemId).deleteOne();
        // Save changes to the user
        await currentUser.save();
        // Redirect back to the index view
        res.redirect(`/users/${currentUser._id}/foods`);
    } catch (error) {
        // If any errors, log them and redirect back home
        console.log(error);
        res.redirect('/');
    }
});


module.exports = router;