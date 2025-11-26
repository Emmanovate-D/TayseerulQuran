const { Tutor, User, Course, Role, UserRole } = require('../models');
const { sendSuccess, sendError, sendNotFound } = require('../utils/responseHandler');
const { HTTP_STATUS, ROLES } = require('../utils/constants');
const { Op } = require('sequelize');

/**
 * Create a new tutor (Super Admin only)
 */
const createTutor = async (req, res) => {
  try {
    const { 
      firstName, lastName, email, password, phone,
      specialization, bio, qualifications, experience, hourlyRate,
      isApproved 
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return sendError(res, 'First name, last name, email, and password are required', HTTP_STATUS.BAD_REQUEST);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return sendError(res, 'User with this email already exists', HTTP_STATUS.CONFLICT);
    }

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone: phone || null
    });

    // Assign tutor role
    const tutorRole = await Role.findOne({ where: { name: ROLES.TUTOR } });
    if (tutorRole) {
      await UserRole.create({
        userId: user.id,
        roleId: tutorRole.id
      });
    }

    // Generate tutor ID
    const tutorCount = await Tutor.count();
    const tutorId = `TUT${String(tutorCount + 1).padStart(4, '0')}`;

    // Create tutor profile
    const tutor = await Tutor.create({
      userId: user.id,
      tutorId: tutorId,
      specialization: specialization || null,
      bio: bio || null,
      qualifications: qualifications || null,
      experience: experience ? parseInt(experience) : null,
      hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
      isApproved: isApproved === true,
      approvedAt: isApproved === true ? new Date() : null,
      approvedBy: isApproved === true ? req.userId : null,
      isActive: true
    });

    // Get tutor with user info
    const createdTutor = await Tutor.findByPk(tutor.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    return sendSuccess(res, { tutor: createdTutor }, 'Tutor created successfully', HTTP_STATUS.CREATED);
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

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
 * Reject tutor (Super Admin only)
 */
const rejectTutor = async (req, res) => {
  try {
    const { id } = req.params;

    const tutor = await Tutor.findByPk(id);
    if (!tutor) {
      return sendNotFound(res, 'Tutor not found');
    }

    tutor.isApproved = false;
    tutor.isActive = false;
    await tutor.save();

    return sendSuccess(res, { tutor }, 'Tutor application rejected');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Update tutor (Super Admin only)
 */
const updateTutor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const tutor = await Tutor.findByPk(id);
    if (!tutor) {
      return sendNotFound(res, 'Tutor not found');
    }

    // Update tutor fields
    if (updateData.specialization !== undefined) tutor.specialization = updateData.specialization;
    if (updateData.bio !== undefined) tutor.bio = updateData.bio;
    if (updateData.qualifications !== undefined) tutor.qualifications = updateData.qualifications;
    if (updateData.experience !== undefined) tutor.experience = updateData.experience;
    if (updateData.hourlyRate !== undefined) tutor.hourlyRate = updateData.hourlyRate;
    if (updateData.isApproved !== undefined) tutor.isApproved = updateData.isApproved;
    if (updateData.isActive !== undefined) tutor.isActive = updateData.isActive;

    await tutor.save();

    // Update user if user fields provided
    if (updateData.firstName || updateData.lastName || updateData.email || updateData.phone) {
      const user = await User.findByPk(tutor.userId);
      if (user) {
        if (updateData.firstName) user.firstName = updateData.firstName;
        if (updateData.lastName) user.lastName = updateData.lastName;
        if (updateData.email) user.email = updateData.email;
        if (updateData.phone) user.phone = updateData.phone;
        if (updateData.isActive !== undefined) user.isActive = updateData.isActive;
        await user.save();
      }
    }

    const updatedTutor = await Tutor.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    return sendSuccess(res, { tutor: updatedTutor }, 'Tutor updated successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Delete tutor (Super Admin only) - Soft delete
 */
const deleteTutor = async (req, res) => {
  try {
    const { id } = req.params;

    const tutor = await Tutor.findByPk(id);
    if (!tutor) {
      return sendNotFound(res, 'Tutor not found');
    }

    // Soft delete - set isActive to false
    tutor.isActive = false;
    tutor.isApproved = false;
    await tutor.save();

    return sendSuccess(res, null, 'Tutor deleted successfully');
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
  createTutor,
  getAllTutors,
  getTutorById,
  approveTutor,
  rejectTutor,
  updateTutor,
  deleteTutor,
  getTutorStudents
};

