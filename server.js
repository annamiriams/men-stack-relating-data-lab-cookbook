const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');

// import middleware functions
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

const authController = require('./controllers/auth.js');
// import foodsController
const foodsController = require('./controllers/food.js');


const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

app.get('/', (req, res) => {
    res.render('index.ejs', {
        user: req.session.user,
    });
});

app.get('/vip-lounge', (req, res) => {
    if (req.session.user) {
        res.send(`Welcome to the party ${req.session.user.username}.`);
    } else {
        res.send('Sorry, no guests allowed.');
    }
});

// For this application, users must be signed in to view any of the routes associated with their pantry. Therefore, isSignedIn should come above the foods controller, but not before auth.
app.use(passUserToView);
app.use('/auth', authController);
app.use(isSignedIn);
// use middleware to direct incoming requests to /users/:userId/foods to the foodsController
app.use('/users/:userId/foods', foodsController);

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});
