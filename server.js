require('dotenv').config();
require('./config/database');

const Writer = require('./models/writer');
const writersCtrl = require('./controllers/writersCtrl');

const path = require('path');
const express = require('express');
const app = express();

const session = require('express-session');
const MongoStore = require('connect-mongo').MongoStore;
const methodOverride = require('method-override');
const morgan = require('morgan');
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const upload = require('./config/multer.js');

const authCtrl = require('./controllers/authCtrl');
const booksCtrl = require('./controllers/booksCtrl');

const port = process.env.PORT || 3003;

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
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
    if (req.session.user) {
        res.redirect(`/users/${req.session.user._id}/books`);
    } else {
        res.render('index.ejs');
    }
});

app.get('/auth/sign-up', authCtrl.signup);
app.post('/auth/sign-up', authCtrl.register);
app.get('/auth/sign-in', authCtrl.signin);
app.post('/auth/sign-in', authCtrl.login);

app.use(isSignedIn);

// PRIVATE ROUTES



app.get('/auth/sign-out', authCtrl.signout);

app.get('/users/:userId/books', booksCtrl.index);
app.get('/users/:userId/books/new', booksCtrl.new);
app.post('/users/:userId/books', upload.single('image'), booksCtrl.create);
app.get('/users/:userId/books/:bookId', booksCtrl.show);
app.get('/users/:userId/books/:bookId/edit', booksCtrl.edit);
app.put('/users/:userId/books/:bookId', upload.single('image'), booksCtrl.update);
app.delete('/users/:userId/books/:bookId', booksCtrl.delete);


app.get('/writers/new', isSignedIn, writersCtrl.newWriter);
app.post('/writers', isSignedIn, upload.single('image'), writersCtrl.createWriter);
app.get('/writers/:id', writersCtrl.showWriter);




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



// Users
/*app.get('/users', usersCtrl.index);
app.get('/users/:userId', usersCtrl.show);
app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});
*/