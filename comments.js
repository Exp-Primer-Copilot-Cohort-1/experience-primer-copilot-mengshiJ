// Create web server

// Import modules
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Import models
const Comment = require('../models/Comment');
const User = require('../models/User');
const Post = require('../models/Post');


// @route   GET api/comments
// @desc    Get all comments
// @access  Public
router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find();
        res.json(comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
);

// @route   GET api/comments/:id
// @desc    Get comment by id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }
        res.json(comment);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(404).json({ msg: 'Comment not found' });
        }
        res.status(500).send('Server Error');
    }
}
);

// @route   POST api/comments
// @desc    Create a comment
// @access  Private
router.post('/', [  // Add middleware
    check('text', 'Text is required').not().isEmpty(),
    check('post', 'Post is required').not().isEmpty()
], async (req, res) => {

    // Check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    // Destructure the request
    const { text, post } = req.body;


    try {


        // Create a new comment
        const newComment = new Comment({
            text,
            post,
            user: req.user.id
        });


        // Save the comment
        const comment = await newComment.save();


        // Add the comment to the post
        const post = await Post.findById(post);
        post.comments.unshift(comment);
        await post.save();


        // Return the comment
        res.json(comment);


    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }


}
);

// @route   PUT api/comments/:id
// @desc    Update a comment
// @access  Private
router.put('/:id', async (req, res) => {
    
        // Destructure the request
        const { text } = req.body;

        // Build a comment object
        const commentFields = {};
        if (text) commentFields.text = text;

        try {

            // Find the comment
            let comment = await Comment.findById(req.params.id);

            // Check if the comment exists
            if (!comment) {
                return res.status(404).json({ msg: 'Comment not found' });
            }

            // Check if the user is the author of the comment
            if (comment.user.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'User not authorized' });
            }

            // Update the comment
            comment = await Comment.findByIdAndUpdate(req.params.id,
                { $set: commentFields },
                { new: true });

            // Return the comment
            res.json(comment);

        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route   DELETE api/comments/:id
// @desc    Delete a comment
// @access  Private
router.delete('/:id', async (req, res) => {





    try {

        // Find the comment
        let comment = await Comment.findById(req.params.id);

        // Check if the comment exists
        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        // Check if the user is the author of the comment
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Delete the comment
        await Comment.findByIdAndRemove(req.params.id);

        // Remove the comment from the post

        // Find the post

        // Get the index of the comment

        // Remove the comment from the post

        // Save the post

        // Return the comment
        res.json({ msg: 'Comment removed' });

    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
);



