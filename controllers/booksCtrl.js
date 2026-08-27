const User = require('../models/user.js');
const Book = require('../models/book.js');
const Comment = require('../models/comment.js');
const cloudinary = require('../config/cloudinary.js');

const uploadImage = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'image',
                folder: 'book-store',
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        uploadStream.end(fileBuffer);
    });
};

const newBook = async (req, res) => {
    try {
        res.render('books/new.ejs');
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
};

const index = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('books');

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.render('books/index.ejs', {
            user,
            books: user.books,
        });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
};

const show = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        const ownsBook = user.books.some(
            (bookId) => bookId.toString() === req.params.bookId
        );

        if (!ownsBook) {
            return res.status(404).send('Book not found');
        }

        const book = await Book.findById(req.params.bookId);

        if (!book) {
            return res.status(404).send('Book not found');
        }

        res.render('books/show.ejs', { user, book });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
};

const create = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        if (!req.file) {
            return res.status(400).send('Book image is required');
        }

        const uploadedImage = await uploadImage(req.file.buffer);

        const book = await Book.create({
            name: req.body.name,
            price: req.body.price,
            writer: req.body.writer,
            description: req.body.description,
            image: {
                url: uploadedImage.secure_url,
                publicId: uploadedImage.public_id,
            },
        });

        user.books.push(book._id);
        await user.save();

        res.redirect(`/users/${user._id}/books`);
    } catch (err) {
        console.log(err);
        res.redirect(`/users/${req.params.userId}/books/new`);
    }
};

const edit = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        const ownsBook = user.books.some(
            (bookId) => bookId.toString() === req.params.bookId
        );

        if (!ownsBook) {
            return res.status(404).send('Book not found');
        }

        const book = await Book.findById(req.params.bookId);

        if (!book) {
            return res.status(404).send('Book not found');
        }

        res.render('books/edit.ejs', { user, book });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
};

const update = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        const ownsBook = user.books.some(
            (bookId) => bookId.toString() === req.params.bookId
        );

        if (!ownsBook) {
            return res.status(404).send('Book not found');
        }

        const book = await Book.findById(req.params.bookId);

        if (!book) {
            return res.status(404).send('Book not found');
        }

        book.name = req.body.name;
        book.price = req.body.price;
        book.writer = req.body.writer;
        book.description = req.body.description;

        if (req.file) {
            const oldPublicId = book.image.publicId;
            const uploadedImage = await uploadImage(req.file.buffer);

            book.image = {
                url: uploadedImage.secure_url,
                publicId: uploadedImage.public_id,
            };

            await book.save();

            if (oldPublicId) {
                await cloudinary.uploader.destroy(oldPublicId);
            }
        } else {
            await book.save();
        }

        res.redirect(`/users/${user._id}/books/${book._id}`);
    } catch (err) {
        console.log(err);
        res.redirect(`/users/${req.params.userId}/books/${req.params.bookId}/edit`);
    }
};

const deleteBook = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        const ownsBook = user.books.some(
            (bookId) => bookId.toString() === req.params.bookId
        );

        if (!ownsBook) {
            return res.status(404).send('Book not found');
        }

        const book = await Book.findById(req.params.bookId);

        if (book && book.image && book.image.publicId) {
            await cloudinary.uploader.destroy(book.image.publicId);
        }

        await Comment.deleteMany({ bookId: req.params.bookId });
        await Book.findByIdAndDelete(req.params.bookId);

        user.books.pull(req.params.bookId);
        await user.save();

        res.redirect(`/users/${user._id}/books`);
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
};

// Community controllers
const communityIndex = async (req, res) => {
    try {
        const books = await Book.find();
        const users = await User.find();

        res.render('community/index.ejs', {
            books,
            users,
        });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
};

const communityShow = async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookId);

        if (!book) {
            return res.status(404).send('Book not found');
        }

        const comments = await Comment.find({ bookId: book._id })
            .populate('userId', 'username')
            .sort({ createdAt: -1 });

        const poster = await User.findOne({ books: book._id }).select('username');

        res.render('community/show.ejs', {
            book,
            comments,
            poster,
        });
    } catch (err) {
        console.log(err);
        res.redirect('/community');
    }
};

const toggleLike = async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookId);

        if (!book) {
            return res.status(404).send('Book not found');
        }

        const userId = req.session.user._id.toString();
        const hasLiked = book.likes.some(
            (likeUserId) => likeUserId.toString() === userId
        );

        if (hasLiked) {
            book.likes.pull(req.session.user._id);
        } else {
            book.likes.push(req.session.user._id);
        }

        await book.save();
        res.redirect(`/community/${book._id}`);
    } catch (err) {
        console.log(err);
        res.status(500).send('Failed to update like.');
    }
};

module.exports = {
    new: newBook,
    index,
    create,
    delete: deleteBook,
    edit,
    show,
    update,
    communityIndex,
    communityShow,
    toggleLike,
};
