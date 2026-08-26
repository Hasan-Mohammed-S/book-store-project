const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Import Database Configuration
require('./config/database');

// Import Middlewares
const passUserToView = require('./middleware/pass-user-to-view');
const isSignedIn = require('./middleware/is-signed-in');

// Import Controllers
const authCtrl = require('./controllers/authCtrl');
const booksCtrl = require('./controllers/booksCtrl');
const usersCtrl = require('./controllers/usersCtrl');
const commentsCtrl = require('./controllers/comments'); // The updated comments controller

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method')); // Allows using PUT and DELETE in forms via query string (?_method=DELETE)
app.use(express.static(path.join(__dirname, 'public')));

// Session/User Context Middleware
app.use(passUserToView);

// ==========================================
//               ROUTES DEFINITION
// ==========================================

// --- Home Route ---
app.get('/', (req, res) => {
    res.render('index', { title: 'Welcome to Book Store' });
});

// --- Auth Routes ---
app.get('/auth/sign-up', authCtrl.signUpPage);
app.post('/auth/sign-up', authCtrl.registerUser);
app.get('/auth/sign-in', authCtrl.signInPage);
app.post('/auth/sign-in', authCtrl.loginUser);
app.get('/auth/sign-out', authCtrl.logoutUser);

// --- Community Route (New) ---
app.get('/community', commentsCtrl.getCommunityPage);

// --- Books Routes ---
app.get('/books', booksCtrl.getAllBooks);
app.get('/books/new', isSignedIn, booksCtrl.newBookPage);
app.post('/books', isSignedIn, booksCtrl.createBook);
app.get('/books/:id', booksCtrl.getBookById);
app.get('/books/:id/edit', isSignedIn, booksCtrl.editBookPage);
app.put('/books/:id', isSignedIn, booksCtrl.updateBook);
app.delete('/books/:id', isSignedIn, booksCtrl.deleteBook);

// --- Book Actions (Likes) ---
app.post('/books/:bookId/like', isSignedIn, booksCtrl.likeBook); // Assuming you implemented it in booksCtrl

// --- Comments Routes (New) ---
app.post('/books/:bookId/comments', isSignedIn, commentsCtrl.createComment);
app.delete('/books/:bookId/comments/:commentId', isSignedIn, commentsCtrl.deleteComment);

// --- Users Routes ---
app.get('/users', isSignedIn, usersCtrl.getAllUsers);
app.get('/users/:id', isSignedIn, usersCtrl.getUserProfile);

// ==========================================
//            ERROR & SERVER START
// ==========================================

// 404 Handler
app.use((req, res) => {
    res.status(404).render('error', { message: 'Page Not Found' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}...`);
});
