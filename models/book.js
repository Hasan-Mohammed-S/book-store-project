const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },

    writer: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
        min: 0,
    },

    image: {
        url: {
            type: String,
            required: true,
        },

        publicId: {
            type: String,
            required: true,
        },
    },
});

const Book = mongoose.model("book", bookSchema);

module.exports = Book;