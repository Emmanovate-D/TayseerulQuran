const { Tutor, User, Course, Role, UserRole } = require('../models');
const { sendSuccess, sendError, sendNotFound } = require('../utils/responseHandler');
const { HTTP_STATUS, ROLES } = require('../utils/constants');
const { Op } = require('sequelize');

/**
 * Get all tutors (with pagination)
 */
const getAllTutors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { search, isApproved } = req.query;

    const where = {};
    if (search) {
      where[Op.or] = [
        { '$user.firstName$': { [Op.like]: `%${search}%` } },
        { '$user.lastName$': { [Op.like]: `%${search}%` } },
        { '$user.email$': { [Op.like]: `%${search}%` } },
        { specialization: { [Op.like]: `%${search}%` } }
      ];
    }
    if (isApproved !== undefined) where.isApproved = isApproved === 'true';
    where.isActive = true;

    const { count, rows: tutors } = await Tutor.findAndCountAll({
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
      tutors,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    }, 'Tutors retrieved successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Get tutor by ID
 */
const getTutorById = async (req, res) => {
  try {
    const { id } = req.params;

    const tutor = await Tutor.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] }
        },
        {
          model: Course,
          as: 'courses'
        }
      ]
    });

    if (!tutor) {
      return sendNotFound(res, 'Tutor not found');
    }

    return sendSuccess(res, { tutor }, 'Tutor retrieved successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Approve tutor (Super Admin only)
 */
const approveTutor = async (req, res) => {
  try {
    const { id } = req.params;

    const tutor = await Tutor.findByPk(id);
    if (!tutor) {
      return sendNotFound(res, 'Tutor not found');
    }

    tutor.isApproved = true;
    tutor.approvedAt = new Date();
    tutor.approvedBy = req.userId;
    await tutor.save();

    // Ensure tutor has tutor role
    const tutorRole = await Role.findOne({ where: { name: ROLES.TUTOR } });
    if (tutorRole) {
      const userRole = await UserRole.findOne({
        where: { userId: tutor.userId, roleId: tutorRole.id }
      });
      if (!userRole) {
        await UserRole.create({
          userId: tutor.userId,
          roleId: tutorRole.id
        });
      }
    }

    return sendSuccess(res, { tutor }, 'Tutor approved successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Get tutor's students
 */
const getTutorStudents = async (req, res) => {
  try {
    // If no id in params, get tutor from authenticated user
    let tutorId = req.params.id;
    
    if (!tutorId) {
      // Get tutor ID from authenticated user
      const tutor = await Tutor.findOne({ where: { userId: req.userId } });
      if (!tutor) {
        return sendNotFound(res, 'Tutor profile not found');
      }
      tutorId = tutor.id;
    }

    const tutor = await Tutor.findByPk(tutorId);
    if (!tutor) {
      return sendNotFound(res, 'Tutor not found');
    }

    // Get students through courses
    const courses = await Course.findAll({
      where: { tutorId: tutorId },
      include: [
        {
          model: User,
          as: 'students',
          through: {
            attributes: ['enrollmentDate', 'progress', 'status']
          },
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    // Extract unique students
    const studentsMap = new Map();
    courses.forEach(course => {
      course.students.forEach(student => {
        if (!studentsMap.has(student.id)) {
          studentsMap.set(student.id, student);
        }
      });
    });

    const students = Array.from(studentsMap.values());

    return sendSuccess(res, { students }, 'Tutor students retrieved successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  getAllTutors,
  getTutorById,
  approveTutor,
  getTutorStudents
};

