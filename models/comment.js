const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: true,
            trim: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "book",
            required: true,
        },
    },
    { timestamps: true },
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
