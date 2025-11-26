const { Course, Tutor, User, StudentCourse } = require('../models');
const { sendSuccess, sendError, sendNotFound } = require('../utils/responseHandler');
const { HTTP_STATUS } = require('../utils/constants');
const { Op } = require('sequelize');

/**
 * Get all courses (with pagination and filters)
 */
const getAllCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { search, level, category, isPublished } = req.query;

    const where = {};
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    if (level) where.level = level;
    if (category) where.category = category;
    if (isPublished !== undefined) where.isPublished = isPublished === 'true';
    where.isActive = true;

    const { count, rows: courses } = await Course.findAndCountAll({
      where,
      include: [
        {
          model: Tutor,
          as: 'tutor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'email', 'profileImage']
            }
          ]
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return sendSuccess(res, {
      courses,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    }, 'Courses retrieved successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Get course by ID
 */
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id, {
      include: [
        {
          model: Tutor,
          as: 'tutor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'email', 'profileImage']
            }
          ]
        }
      ]
    });

    if (!course || !course.isActive) {
      return sendNotFound(res, 'Course not found');
    }

    return sendSuccess(res, { course }, 'Course retrieved successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Create new course
 */
const createCourse = async (req, res) => {
  try {
    const courseData = req.body;

    const course = await Course.create(courseData);

    const courseWithTutor = await Course.findByPk(course.id, {
      include: [
        {
          model: Tutor,
          as: 'tutor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'email']
            }
          ]
        }
      ]
    });

    return sendSuccess(res, { course: courseWithTutor }, 'Course created successfully', HTTP_STATUS.CREATED);
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Update course
 */
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const course = await Course.findByPk(id);
    if (!course) {
      return sendNotFound(res, 'Course not found');
    }

    await course.update(updateData);

    const updatedCourse = await Course.findByPk(id, {
      include: [
        {
          model: Tutor,
          as: 'tutor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'email']
            }
          ]
        }
      ]
    });

    return sendSuccess(res, { course: updatedCourse }, 'Course updated successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Delete course
 */
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) {
      return sendNotFound(res, 'Course not found');
    }

    // Soft delete
    course.isActive = false;
    await course.save();

    return sendSuccess(res, null, 'Course deleted successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Enroll student in course
 */
const enrollStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId } = req.body;

    const course = await Course.findByPk(courseId);
    if (!course) {
      return sendNotFound(res, 'Course not found');
    }

    // Check if already enrolled
    const existingEnrollment = await StudentCourse.findOne({
      where: { studentId, courseId }
    });

    if (existingEnrollment) {
      return sendError(res, 'Student already enrolled in this course', HTTP_STATUS.CONFLICT);
    }

    // Create enrollment
    const enrollment = await StudentCourse.create({
      studentId,
      courseId,
      status: 'enrolled'
    });

    // Update enrollment count
    course.enrollmentCount += 1;
    await course.save();

    return sendSuccess(res, { enrollment }, 'Student enrolled successfully', HTTP_STATUS.CREATED);
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollStudent
};

