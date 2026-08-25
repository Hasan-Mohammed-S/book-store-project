require('dotenv').config();
require('./config/database');


const path = require('path');
const express = require('express');
const app = express();

// Middleware
const session = require('express-session');
const MongoStore = require('connect-mongo').MongoStore;
const methodOverride = require('method-override');
const morgan = require('morgan');
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const upload = require("./config/multer");


const authCtrl = require('./controllers/authCtrl');
const booksCtrl = require('./controllers/booksCtrl');
const usersCtrl = require('./controllers/usersCtrl');
//const isSignedIn = require('./middleware/is-signed-in');

const port = process.env.PORT ? process.env.PORT : '3003';







// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride('_method'));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    })
);

app.use(passUserToView);

// PUBLIC ROUTES
app.get('/', (req, res) => {
    // Check if the user is signed in
    if (req.session.user) {
        // Redirect signed-in users to their applications index
        res.redirect(`/users/${req.session.user._id}/books`);
    } else {
        // Show the homepage for users who are not signed in
        res.render('index.ejs');
    }
});

app.get('/auth/sign-up', authCtrl.signup);
app.post('/auth/sign-up', authCtrl.register);
app.get('/auth/sign-in', authCtrl.signin);
app.post('/auth/sign-in', authCtrl.login);

// Customer middleware
app.use(isSignedIn);

// PRIVATE ROUTES
app.get('/auth/sign-out', authCtrl.signout);

// Applications
app.get('/users/:userId/books', booksCtrl.index);
app.post("/books", isSignedIn, upload.single("image"), booksCtrl.create);
app.get('/users/:userId/books/new', booksCtrl.new);
app.post('/users/:userId/books', booksCtrl.create);
app.get('/users/:userId/books/:bookId', booksCtrl.show);
// app.put("/books/:Id", isSignedIn, upload.single("image"), booksCtrl.editBook)
app.delete('/users/:userId/books/:bookId', booksCtrl.delete);
app.get('/users/:userId/books/:bookId/edit', booksCtrl.edit);
app.put('/users/:userId/books/:bookId', booksCtrl.update);

// Users
/*app.get('/users', usersCtrl.index);
app.get('/users/:userId', usersCtrl.show);
app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});
*/





app.listen(3003, () => {
  console.log('Server is running on http://localhost:3003');
});