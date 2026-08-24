const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    books: [bookSchema]
});

const User = mongoose.model('User', userSchema);

// export it
module.exports = User;