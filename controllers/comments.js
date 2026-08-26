const Comment = require('../models/comment');
const Book = require('../models/book');

// @desc    Get community page displaying all users' comments
// @route   GET /community
// @access  Public
const getCommunityPage = async (req, res) => {
    try {
        // Fetch all comments, populate user and book details, and sort by newest first
        const comments = await Comment.find()
            .populate('user', 'username') // populates only the username from User model
            .populate('book', 'title')    // populates only the title from Book model
            .sort({ createdAt: -1 });

        res.render('community/index', {
            title: 'Community - Readers Circle',
            comments: comments,
            user: req.user || null
        });
    } catch (error) {
        console.error('Error loading community page:', error);
        res.status(500).render('error', { 
            message: 'Something went wrong while loading the community page.' 
        });
    }
};

// @desc    Create a new comment on a specific book
// @route   POST /books/:bookId/comments
// @access  Private (Logged-in users only)
const createComment = async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).render('error', { message: 'Book not found' });
        }

        // Create the comment object
        const newComment = new Comment({
            content: req.body.content,
            user: req.user._id, // the logged-in user
            book: bookId
        });

        // Save comment to database
        await newComment.save();

        // Push the comment ID into the book's comments array and save the book
        book.comments.push(newComment._id);
        await book.save();

        // Redirect back to the book detail page
        res.redirect(`/books/${bookId}`);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).render('error', { message: 'Failed to submit your comment.' });
    }
};

// @desc    Delete a comment
// @route   DELETE /books/:bookId/comments/:commentId
// @access  Private (Comment owner only)
const deleteComment = async (req, res) => {
    try {
        const { bookId, commentId } = req.params;
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).render('error', { message: 'Comment not found' });
        }

        // Authorization check: Only the user who wrote the comment can delete it
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).render('error', { 
                message: 'Unauthorized action. You can only delete your own comments.' 
            });
        }

        // Delete comment from Comments collection
        await Comment.findByIdAndDelete(commentId);

        // Remove the comment reference from the book's array
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
