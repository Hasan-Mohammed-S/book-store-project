const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({

    name: {
        type: String,
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
    pantry: [foodSchema]
});

const User = mongoose.model('User', userSchema);

// export it
module.exports = User;