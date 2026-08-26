const Book = require('../models/book');

// @desc    Get all books
// @route   GET /books
// @access  Public
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('user', 'username');
        res.render('books/index', { title: 'All Books', books });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).render('error', { message: 'Failed to retrieve books.' });
    }
};

// @desc    Show create book page
// @route   GET /books/new
// @access  Private
const newBookPage = (req, res) => {
    res.render('books/new', { title: 'Add a New Book' });
};

// @desc    Create a new book
// @route   POST /books
// @access  Private
const createBook = async (req, res) => {
    try {
        const { title, description } = req.body;
        const newBook = new Book({
            title,
            description,
            user: req.user._id // Assign logged-in user as the book owner
        });
        await newBook.save();
        res.redirect('/books');
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).render('error', { message: 'Failed to create the book.' });
    }
};

// @desc    Get a single book details by ID
// @route   GET /books/:id
// @access  Public
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate('user', 'username')
            .populate({
                path: 'comments',
                populate: { path: 'user', select: 'username' } // Deep populate comment owners
            });

        if (!book) {
            return res.status(404).render('error', { message: 'Book not found.' });
        }

        res.render('books/show', { title: book.title, book });
    } catch (error) {
        console.error('Error fetching book details:', error);
        res.status(500).render('error', { message: 'Error loading book details.' });
    }
};

// @desc    Show edit book page
// @route   GET /books/:id/edit
// @access  Private (Owner only)
const editBookPage = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).render('error', { message: 'Book not found.' });
        }

        // SECURITY CHECK: Only allow the owner to access the edit page
        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(403).render('error', { message: 'Unauthorized. Only the owner can edit this book.' });
        }

        res.render('books/edit', { title: `Edit ${book.title}`, book });
    } catch (error) {
        console.error('Error loading edit page:', error);
        res.status(500).render('error', { message: 'Error loading edit page.' });
    }
};

// @desc    Update a book
// @route   PUT /books/:id
// @access  Private (Owner only)
const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).render('error', { message: 'Book not found.' });
        }

        // BACKEND PROTECTION: Prevent unauthorized update requests
        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(403).render('error', { message: 'Unauthorized action. Modification denied.' });
        }

        book.title = req.body.title;
        book.description = req.body.description;
        await book.save();

        res.redirect(`/books/${book._id}`);
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).render('error', { message: 'Failed to update book details.' });
    }
};

// @desc    Delete a book
// @route   DELETE /books/:id
// @access  Private (Owner only)
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).render('error', { message: 'Book not found.' });
        }

        // BACKEND PROTECTION: Prevent unauthorized delete requests
        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(403).render('error', { message: 'Unauthorized action. Deletion denied.' });
        }

        await Book.findByIdAndDelete(req.params.id);
        res.redirect('/books');
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).render('error', { message: 'Failed to delete the book.' });
    }
};

// @desc    Like or Unlike a book
// @route   POST /books/:bookId/like
// @access  Private (Logged-in users)
const likeBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookId);

        if (!book) {
            return res.status(404).render('error', { message: 'Book not found.' });
        }

        // Initialize likes array if it doesn't exist in the model
        if (!book.likes) {
            book.likes = [];
        }

        // Check if the user has already liked this book
        const alreadyLiked = book.likes.includes(req.user._id);

        if (alreadyLiked) {
            // Unlike: remove user ID from likes array
            book.likes.pull(req.user._id);
        } else {
            // Like: push user ID into likes array
            book.likes.push(req.user._id);
        }

        await book.save();
        res.redirect(`/books/${req.params.bookId}`);
    } catch (error) {
        console.error('Error processing like action:', error);
        res.status(500).render('error', { message: 'Failed to complete the like operation.' });
    }
};

module.exports = {
    getAllBooks,
    newBookPage,
    createBook,
    getBookById,
    editBookPage,
    updateBook,
    deleteBook,
    likeBook
};
