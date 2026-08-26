require('dotenv').config();
require('./config/database');

const path = require('path');
const express = require('express');
const app = express();

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  app.set('trust proxy', 1);
}

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
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
    },
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



app.get('/community',booksCtrl.communityIndex);

//href="/community/<%= book._id %>"

app.get('/community/:bookId', booksCtrl.communityShow)
//Cannot GET /community/6a8e98579ea7ecbde21bf2f3

app.listen(port,   () => {
    console.log(`Server is running on http://localhost:${port}`);
});


