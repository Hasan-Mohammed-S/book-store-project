const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    books: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "book",
        },
    ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;