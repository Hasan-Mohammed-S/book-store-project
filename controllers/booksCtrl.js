const User = require('../models/user.js');
const Book = require('../models/book.js');
const Writer = require('../models/writer');
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
    const writers = await Writer.find({});
    res.render('books/new.ejs', { 
      title: 'Add New Book', 
      writers: writers 
    });
  } catch (err) {
    console.error(err);
    res.redirect('/books');
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
    const bookData = {
      title: req.body.title,
      description: req.body.description,
      writer: req.body.writer,
      image: req.file ? req.file.path : 'https://placeholder.com'
    };

    const newBook = await Book.create(bookData);

    await Writer.findByIdAndUpdate(req.body.writer, {
      $push: { books: newBook._id }
    });

    res.redirect('/books');
  } catch (err) {
    console.error(err);
    res.redirect('/books/new');
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

        await Book.findByIdAndDelete(req.params.bookId);

        user.books.pull(req.params.bookId);
        await user.save();

        res.redirect(`/users/${user._id}/books`);
    } catch (err) {
        console.log(err);
        res.redirect('/');
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
};
