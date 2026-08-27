const Comment = require('../models/comment');
const Book = require('../models/book');

const createComment = async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).send('Book not found');
        }

        const content = req.body.content?.trim();

        if (!content) {
            return res.status(400).send('Comment cannot be empty');
        }

        await Comment.create({
            comment: content,
            userId: req.session.user._id,
            bookId,
        });

        res.redirect(`/community/${bookId}`);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).send('Failed to submit your comment.');
    }
};

const deleteComment = async (req, res) => {
    try {
        const { bookId, commentId } = req.params;
        const comment = await Comment.findOne({
            _id: commentId,
            bookId,
        });

        if (!comment) {
            return res.status(404).send('Comment not found');
        }

        if (comment.userId.toString() !== req.session.user._id.toString()) {
            return res.status(403).send('You can only delete your own comments.');
        }

        await Comment.findByIdAndDelete(commentId);

        res.redirect(`/community/${bookId}`);
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).send('Failed to delete the comment.');
    }
};

module.exports = {
    createComment,
    deleteComment,
};
