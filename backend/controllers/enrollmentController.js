const { StudentCourse, Course, User, Payment, Student } = require('../models');
const { sendSuccess, sendError, sendNotFound } = require('../utils/responseHandler');
const { HTTP_STATUS } = require('../utils/constants');
const { Op } = require('sequelize');

/**
 * Enroll user in a course
 */
const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.userId || req.user?.id;

    if (!userId) {
      console.error('enrollInCourse: userId is undefined', { 
        hasUserId: !!req.userId, 
        hasUser: !!req.user 
      });
      return sendError(res, 'User ID not found in request', HTTP_STATUS.UNAUTHORIZED);
    }

    if (!courseId) {
      return sendError(res, 'Course ID is required', HTTP_STATUS.BAD_REQUEST);
    }

    // Get course
    const course = await Course.findByPk(courseId);
    if (!course) {
      return sendNotFound(res, 'Course not found');
    }

    if (!course.isPublished || !course.isActive) {
      return sendError(res, 'This course is not available for enrollment', HTTP_STATUS.BAD_REQUEST);
    }

    // Check if user is a student
    const student = await Student.findOne({ where: { userId } });
    if (!student) {
      return sendError(res, 'Only students can enroll in courses', HTTP_STATUS.FORBIDDEN);
    }

    // Check if already enrolled
    const existingEnrollment = await StudentCourse.findOne({
      where: {
        studentId: userId,
        courseId: courseId
      }
    });

    if (existingEnrollment) {
      return sendError(res, 'You are already enrolled in this course', HTTP_STATUS.CONFLICT);
    }

    // Check if payment is required and provided
    const { paymentId, paymentMethod } = req.body;
    let payment = null;

    // Only require payment if course has a price > 0
    if (course.price > 0) {
      if (!paymentId) {
        return sendError(res, 'Payment is required for this course', HTTP_STATUS.BAD_REQUEST);
      }

      // Verify payment
      payment = await Payment.findByPk(paymentId);
      if (!payment) {
        return sendNotFound(res, 'Payment not found');
      }

      if (payment.userId !== userId) {
        return sendError(res, 'Payment does not belong to this user', HTTP_STATUS.FORBIDDEN);
      }

      if (payment.status !== 'completed' && payment.status !== 'pending') {
        return sendError(res, 'Payment must be completed or pending', HTTP_STATUS.BAD_REQUEST);
      }

      if (payment.courseId !== parseInt(courseId)) {
        return sendError(res, 'Payment does not match this course', HTTP_STATUS.BAD_REQUEST);
      }
    }

    // Create enrollment
    const enrollment = await StudentCourse.create({
      studentId: userId,
      courseId: courseId,
      status: payment && payment.status === 'pending' ? 'enrolled' : 'enrolled',
      enrollmentDate: new Date()
    });

    // Update course enrollment count
    course.enrollmentCount = (course.enrollmentCount || 0) + 1;
    await course.save();

    // Link payment to enrollment if provided
    if (payment) {
      // Payment is already linked via courseId and userId
    }

    return sendSuccess(res, {
      enrollment: {
        id: enrollment.id,
        studentId: enrollment.studentId,
        courseId: enrollment.courseId,
        status: enrollment.status,
        enrollmentDate: enrollment.enrollmentDate,
        course: {
          id: course.id,
          title: course.title,
          price: course.price,
          category: course.category
        },
        payment: payment ? {
          id: payment.id,
          amount: payment.amount,
          status: payment.status
        } : null
      }
    }, 'Enrolled successfully', HTTP_STATUS.CREATED);

  } catch (error) {
    console.error('Enrollment error:', error);
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Get user's enrollments
 */
const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.userId || req.user?.id;

    if (!userId) {
      console.error('getMyEnrollments: userId is undefined', { 
        hasUserId: !!req.userId, 
        hasUser: !!req.user, 
        user: req.user 
      });
      return sendError(res, 'User ID not found in request', HTTP_STATUS.UNAUTHORIZED);
    }

    const enrollments = await StudentCourse.findAll({
      where: { studentId: userId },
      include: [
        {
          model: Course,
          as: 'Course',
          attributes: ['id', 'title', 'description', 'shortDescription', 'price', 'duration', 'level', 'category', 'thumbnail', 'rating', 'enrollmentCount'],
          required: false
        }
      ],
      order: [['enrollmentDate', 'DESC']]
    });

    return sendSuccess(res, {
      enrollments: enrollments.map(enrollment => ({
        id: enrollment.id,
        courseId: enrollment.courseId,
        status: enrollment.status,
        progress: enrollment.progress,
        enrollmentDate: enrollment.enrollmentDate,
        completionDate: enrollment.completionDate,
        course: enrollment.Course
      }))
    }, 'Enrollments retrieved successfully');

  } catch (error) {
    console.error('Get enrollments error:', error);
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Get all enrollments (Admin)
 */
const getAllEnrollments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const courseId = req.query.courseId;
    const status = req.query.status;

    const where = {};
    if (search) {
      where[Op.or] = [
        { '$student.user.firstName$': { [Op.like]: `%${search}%` } },
        { '$student.user.lastName$': { [Op.like]: `%${search}%` } },
        { '$student.user.email$': { [Op.like]: `%${search}%` } },
        { '$course.title$': { [Op.like]: `%${search}%` } }
      ];
    }
    if (courseId) {
      where.courseId = courseId;
    }
    if (status) {
      where.status = status;
    }

    const { count, rows: enrollments } = await StudentCourse.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
          required: false
        },
        {
          model: Course,
          as: 'Course',
          attributes: ['id', 'title', 'price', 'category'],
          required: false
        }
      ],
      limit,
      offset,
      order: [['enrollmentDate', 'DESC']]
    });

    return sendSuccess(res, {
      enrollments: enrollments.map(enrollment => ({
        id: enrollment.id,
        studentId: enrollment.studentId,
        courseId: enrollment.courseId,
        status: enrollment.status,
        progress: enrollment.progress,
        enrollmentDate: enrollment.enrollmentDate,
        completionDate: enrollment.completionDate,
        student: enrollment.User || { id: enrollment.studentId },
        course: enrollment.Course
      })),
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    }, 'Enrollments retrieved successfully');

  } catch (error) {
    console.error('Get all enrollments error:', error);
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Get enrollment by ID
 */
const getEnrollmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const enrollment = await StudentCourse.findByPk(id, {
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
          required: false
        },
        {
          model: Course,
          as: 'Course',
          attributes: ['id', 'title', 'description', 'price', 'duration', 'level', 'category', 'thumbnail'],
          required: false
        }
      ]
    });

    if (!enrollment) {
      return sendNotFound(res, 'Enrollment not found');
    }

    // Check if user has permission (own enrollment or admin)
    if (enrollment.studentId !== userId && req.user.roles && !req.user.roles.some(role => role.name === 'Super Admin' || role.name === 'Admin')) {
      return sendError(res, 'You do not have permission to view this enrollment', HTTP_STATUS.FORBIDDEN);
    }

    return sendSuccess(res, { enrollment }, 'Enrollment retrieved successfully');

  } catch (error) {
    console.error('Get enrollment error:', error);
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Update enrollment
 */
const updateEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, progress, rating, review } = req.body;
    const userId = req.userId;

    const enrollment = await StudentCourse.findByPk(id);
    if (!enrollment) {
      return sendNotFound(res, 'Enrollment not found');
    }

    // Check permissions
    const isOwner = enrollment.studentId === userId;
    const isAdmin = req.user.roles && req.user.roles.some(role => role.name === 'Super Admin' || role.name === 'Admin');

    if (!isOwner && !isAdmin) {
      return sendError(res, 'You do not have permission to update this enrollment', HTTP_STATUS.FORBIDDEN);
    }

    // Update fields
    if (status !== undefined) {
      if (!isAdmin && status !== 'dropped') {
        return sendError(res, 'Only admins can change enrollment status', HTTP_STATUS.FORBIDDEN);
      }
      enrollment.status = status;
    }

    if (progress !== undefined) {
      if (!isOwner) {
        return sendError(res, 'Only the student can update progress', HTTP_STATUS.FORBIDDEN);
      }
      enrollment.progress = Math.min(100, Math.max(0, progress));
    }

    if (rating !== undefined) {
      if (!isOwner) {
        return sendError(res, 'Only the student can add a rating', HTTP_STATUS.FORBIDDEN);
      }
      enrollment.rating = Math.min(5, Math.max(1, rating));
    }

    if (review !== undefined) {
      if (!isOwner) {
        return sendError(res, 'Only the student can add a review', HTTP_STATUS.FORBIDDEN);
      }
      enrollment.review = review;
    }

    if (enrollment.status === 'completed' && !enrollment.completionDate) {
      enrollment.completionDate = new Date();
    }

    await enrollment.save();

    return sendSuccess(res, { enrollment }, 'Enrollment updated successfully');

  } catch (error) {
    console.error('Update enrollment error:', error);
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Cancel enrollment
 */
const cancelEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const enrollment = await StudentCourse.findByPk(id, {
      include: [{ model: Course, as: 'Course' }]
    });

    if (!enrollment) {
      return sendNotFound(res, 'Enrollment not found');
    }

    // Check permissions
    const isOwner = enrollment.studentId === userId;
    const isAdmin = req.user.roles && req.user.roles.some(role => role.name === 'Super Admin' || role.name === 'Admin');

    if (!isOwner && !isAdmin) {
      return sendError(res, 'You do not have permission to cancel this enrollment', HTTP_STATUS.FORBIDDEN);
    }

    // Update enrollment status
    enrollment.status = 'dropped';
    await enrollment.save();

    // Update course enrollment count
    if (enrollment.Course) {
      enrollment.Course.enrollmentCount = Math.max(0, (enrollment.Course.enrollmentCount || 0) - 1);
      await enrollment.Course.save();
    }

    return sendSuccess(res, { enrollment }, 'Enrollment cancelled successfully');

  } catch (error) {
    console.error('Cancel enrollment error:', error);
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Get enrollment statistics
 */
const getEnrollmentStats = async (req, res) => {
  try {
    const totalEnrollments = await StudentCourse.count();
    const activeEnrollments = await StudentCourse.count({ where: { status: 'enrolled' } });
    const completedEnrollments = await StudentCourse.count({ where: { status: 'completed' } });
    const totalCourses = await Course.count({ where: { isPublished: true, isActive: true } });
    const totalStudents = await Student.count();

    return sendSuccess(res, {
      stats: {
        totalEnrollments,
        activeEnrollments,
        completedEnrollments,
        totalCourses,
        totalStudents,
        completionRate: totalEnrollments > 0 ? ((completedEnrollments / totalEnrollments) * 100).toFixed(2) : 0
      }
    }, 'Statistics retrieved successfully');

  } catch (error) {
    console.error('Get stats error:', error);
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  enrollInCourse,
  getMyEnrollments,
  getAllEnrollments,
  getEnrollmentById,
  updateEnrollment,
  cancelEnrollment,
  getEnrollmentStats
};

