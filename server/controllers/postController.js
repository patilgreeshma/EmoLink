import Post from '../models/Post.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
    const { content, community, growthTags } = req.body;

    // Helper function to upload to Cloudinary
    const uploadFromBuffer = (buffer) => {
        return new Promise((resolve, reject) => {
            const cld_upload_stream = cloudinary.uploader.upload_stream(
                {
                    folder: "emolink_posts"
                },
                (error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                }
            );
            streamifier.createReadStream(buffer).pipe(cld_upload_stream);
        });
    };

    try {
        console.log('=== CREATE POST REQUEST ===');
        console.log('Body:', req.body);
        console.log('File:', req.file);

        let imageUrl = '';

        if (req.file && req.file.buffer) {
            console.log('Processing file upload to Cloudinary...');
            const result = await uploadFromBuffer(req.file.buffer);
            imageUrl = result.secure_url;
            console.log('Image uploaded to Cloudinary:', imageUrl);
        }

        if (!content && !imageUrl) {
            return res.status(400).json({ message: 'Please add content or an image' });
        }

        let parsedTags = [];
        if (growthTags) {
            try {
                parsedTags = typeof growthTags === 'string' ? JSON.parse(growthTags) : growthTags;
                console.log('Parsed tags:', parsedTags);
            } catch (e) {
                console.error("Error parsing growthTags:", e);
                parsedTags = [];
            }
        }

        console.log('Creating post with user:', req.user._id || req.user.id);
        const post = await Post.create({
            author: req.user._id || req.user.id,
            content,
            growthTags: parsedTags,
            community: community || null,
            image: imageUrl
        });

        console.log('Post saved, populating author...');
        await post.populate('author', 'name avatar lifeStage');
        console.log('Success! Returning post.');

        res.status(201).json(post);
    } catch (error) {
        console.error('=== ERROR IN CREATE POST ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check user
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "User not authorized" });
        }

        await post.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check user
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "User not authorized" });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get feed posts (following + communities)
// @route   GET /api/posts/feed
// @access  Private
export const getFeed = async (req, res) => {
    try {
        // Get all posts (Global Feed for now as requested)
        const feedPosts = await Post.find()
            .populate('author', 'name lifeStage avatar')
            .populate('community', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(feedPosts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get posts by user ID
// @route   GET /api/posts/user/:userId
// @access  Private
export const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId })
            .populate('author', 'name lifeStage avatar')
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Like a post
// @route   POST /api/posts/:id/like
// @access  Private
export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.likes.includes(req.user.id)) {
            return res.status(400).json({ message: 'Post already liked' });
        }

        post.likes.push(req.user.id);
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Comment on a post
// @route   POST /api/posts/:id/comment
// @access  Private
export const commentPost = async (req, res) => {
    if (!req.body.text) {
        return res.status(400).json({ message: 'Please add text' });
    }

    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = {
            user: req.user.id,
            text: req.body.text,
            createdAt: new Date()
        };

        post.comments.push(comment);
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get posts by community ID
// @route   GET /api/posts/community/:communityId
// @access  Private
export const getCommunityPosts = async (req, res) => {
    try {
        const posts = await Post.find({ community: req.params.communityId })
            .populate('author', 'name lifeStage avatar')
            .populate('community', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
