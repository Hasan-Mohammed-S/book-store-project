const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    }
,
    Photo: {type:img,
        required: true,

    }

});


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    pantry: [bookSchema]
});

const User = mongoose.model('User', userSchema);

// export it
module.exports = User;