require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
const session = require('express-session');
const MongoStore = require('connect-mongo').MongoStore;
const methodOverride = require('method-override');
const morgan = require('morgan');
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');


const authCtrl = require('./controllers/authCtrl');
const booksCtrl = require('./controllers/booksCtrl.js');
const usersCtrl = require('./controllers/usersCtrl.js')


const port = process.env.PORT ? process.env.PORT : '3003';


// Database Connection
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Routes
app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

app.listen(3003, () => {
  console.log('Server is running on http://localhost:3003');
});