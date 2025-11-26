const { BlogPost, User } = require('../models');
const { sendSuccess, sendError, sendNotFound } = require('../utils/responseHandler');
const { HTTP_STATUS } = require('../utils/constants');
const { Op } = require('sequelize');

/**
 * Get all blog posts (with pagination)
 */
const getAllBlogPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { search, category, isPublished } = req.query;

    const where = {};
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }
    if (category) where.category = category;
    if (isPublished !== undefined) where.isPublished = isPublished === 'true';
    where.isActive = true;

    const { count, rows: posts } = await BlogPost.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'email', 'profileImage']
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return sendSuccess(res, {
      posts,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    }, 'Blog posts retrieved successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Get blog post by ID or slug
 */
const getBlogPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await BlogPost.findOne({
      where: {
        [Op.or]: [
          { id: id },
          { slug: id }
        ],
        isActive: true
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'email', 'profileImage']
        }
      ]
    });

    if (!post) {
      return sendNotFound(res, 'Blog post not found');
    }

    // Increment views
    post.views += 1;
    await post.save();

    return sendSuccess(res, { post }, 'Blog post retrieved successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Create new blog post
 */
const createBlogPost = async (req, res) => {
  try {
    const postData = {
      ...req.body,
      authorId: req.userId
    };

    // Generate slug if not provided
    if (!postData.slug && postData.title) {
      postData.slug = postData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Set published date if publishing
    if (postData.isPublished && !postData.publishedAt) {
      postData.publishedAt = new Date();
    }

    const post = await BlogPost.create(postData);

    const postWithAuthor = await BlogPost.findByPk(post.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    return sendSuccess(res, { post: postWithAuthor }, 'Blog post created successfully', HTTP_STATUS.CREATED);
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Update blog post
 */
const updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const post = await BlogPost.findByPk(id);
    if (!post) {
      return sendNotFound(res, 'Blog post not found');
    }

    // Set published date if publishing for the first time
    if (updateData.isPublished && !post.isPublished && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
    }

    await post.update(updateData);

    const updatedPost = await BlogPost.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    return sendSuccess(res, { post: updatedPost }, 'Blog post updated successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Delete blog post
 */
const deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Attempting to delete blog post with ID:', id);

    // Find post without filtering by isActive (to allow deleting already inactive posts)
    const post = await BlogPost.findByPk(id);
    
    if (!post) {
      console.log('Blog post not found in database:', id);
      return sendNotFound(res, 'Blog post not found');
    }

    console.log('Found blog post:', {
      id: post.id,
      title: post.title,
      isActive: post.isActive
    });

    // Check if already deleted
    if (!post.isActive) {
      // Actually delete from database instead of just marking as inactive
      await post.destroy();
      console.log('Blog post permanently deleted from database:', post.id);
      return sendSuccess(res, null, 'Blog post permanently deleted');
    }

    // Soft delete
    post.isActive = false;
    await post.save();

    console.log('Blog post soft deleted successfully:', post.id);
    return sendSuccess(res, null, 'Blog post deleted successfully');
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  getAllBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
};

