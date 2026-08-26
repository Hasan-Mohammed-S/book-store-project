const Comment = require('../models/comment');
const Book = require('../models/book');

const createComment = async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).render('error', { message: 'Book not found' });
        }

        const newComment = new Comment({
            content: req.body.content,
            user: req.user._id, 
            book: bookId
        });

        await newComment.save();

        book.comments.push(newComment._id);
        await book.save();

        res.redirect(`/books/${bookId}`);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).render('error', { message: 'Failed to submit your comment.' });
    }
};


const deleteComment = async (req, res) => {
    try {
        const { bookId, commentId } = req.params;
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).render('error', { message: 'Comment not found' });
        }

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).render('error', { 
                message: 'Unauthorized action. You can only delete your own comments.' 
            });
        }

        await Comment.findByIdAndDelete(commentId);

        await Book.findByIdAndUpdate(bookId, {
            $pull: { comments: commentId }
        });

        res.redirect(`/books/${bookId}`);
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).render('error', { message: 'Failed to delete the comment.' });
    }
};

module.exports = {
    getCommunityPage,
    createComment,
    deleteComment
};