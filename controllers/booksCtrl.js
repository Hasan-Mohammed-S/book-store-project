
const express = require('express');

const User = require('../models/user.js');


const uploadImage = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'image'
            },
            (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            }
        )

        uploadStream.end(fileBuffer)
    })
}



const newBook = async(req, res) => {
    try {
        res.render('books/new.ejs');
    } catch (err) {
        res.redirect('/');
    }
};



const show = async(req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const book = user.books.id(req.params.bookId);
             const img=user.books.img(req.params.bookImg)
        res.render('books/show.ejs', { book });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
};



const create = async(req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        console.log(user)
        user.books.push(req.body);
        await user.save();

        res.redirect(`/users/${req.params.userId}/books`);
    } catch (err) {
        console.log(err);
        res.redirect('/users/:userId/books/new');
    }
};



const deleteBook = async(req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        user.books.pull(req.params.bookId);

        await user.save();

        res.redirect(`/users/${user._id}/books`);
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
};

const edit = async(req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const book = user.books.id(req.params.bookId);

        res.render('books/edit.ejs', { book });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
};



const update = async(req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const book = user.books.id(req.params.bookId);

        book.set(req.body);

        await user.save();

        res.redirect(`/users/${user._id}/books/${book._id}`);
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
};


const index = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        res.render('books/index.ejs', {
            user: user,
            books: user.books || []
        });

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
    update
}