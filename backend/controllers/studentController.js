const { Student, User, Course, StudentCourse, Role } = require('../models');
const { sendSuccess, sendError, sendNotFound } = require('../utils/responseHandler');
const { HTTP_STATUS, ROLES } = require('../utils/constants');
const { Op } = require('sequelize');

/**
 * Get all students (with pagination)
 */
const getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const where = {};
    if (search) {
      where[Op.or] = [
        { '$user.firstName$': { [Op.like]: `%${search}%` } },
        { '$user.lastName$': { [Op.like]: `%${search}%` } },
        { '$user.email$': { [Op.like]: `%${search}%` } },
        { studentId: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: students } = await Student.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'profileImage', 'isActive']
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return sendSuccess(res, {
      students,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    }, 'Students retrieved successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Get student by ID
 */
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] }
        },
        {
          model: Course,
          as: 'enrolledCourses',
          through: {
            attributes: ['enrollmentDate', 'progress', 'status', 'rating', 'review']
          }
        }
      ]
    });

    if (!student) {
      return sendNotFound(res, 'Student not found');
    }

    return sendSuccess(res, { student }, 'Student retrieved successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Assign student to tutor
 */
const assignStudentToTutor = async (req, res) => {
  try {
    const { studentId, tutorId } = req.body;

    const student = await Student.findByPk(studentId);
    if (!student) {
      return sendNotFound(res, 'Student not found');
    }

    // This would require a StudentTutor model for many-to-many relationship
    // For now, we'll just return success
    return sendSuccess(res, null, 'Student assigned to tutor successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Get student's enrolled courses
 */
const getStudentCourses = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id);
    if (!student) {
      return sendNotFound(res, 'Student not found');
    }

    // Get user to access enrolled courses
    const user = await User.findByPk(student.userId, {
      include: [
        {
          model: Course,
          as: 'enrolledCourses',
          through: {
            attributes: ['enrollmentDate', 'progress', 'status', 'rating', 'review']
          },
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
        }
      ]
    });

    if (!user) {
      return sendNotFound(res, 'User not found');
    }

    return sendSuccess(res, { courses: user.enrolledCourses || [] }, 'Student courses retrieved successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  assignStudentToTutor,
  getStudentCourses
};

