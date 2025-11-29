const { Contact } = require('../models');
const { sendSuccess, sendError, sendValidationError } = require('../utils/responseHandler');
const { HTTP_STATUS } = require('../utils/constants');

/**
 * Submit a contact form (public endpoint)
 */
const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message, phone } = req.body;

    // Validation
    if (!name || !email || !message) {
      return sendValidationError(res, {
        name: !name ? 'Name is required' : undefined,
        email: !email ? 'Email is required' : undefined,
        message: !message ? 'Message is required' : undefined
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendValidationError(res, {
        email: 'Please provide a valid email address'
      });
    }

    // Create contact submission
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject ? subject.trim() : null,
      message: message.trim(),
      phone: phone ? phone.trim() : null,
      status: 'new'
    });

    return sendSuccess(res, {
      contact: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        message: contact.message,
        createdAt: contact.createdAt
      }
    }, 'Thank you for contacting us! We will get back to you soon.', HTTP_STATUS.CREATED);
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return sendError(res, 'Failed to submit contact form. Please try again.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Get all contact submissions (admin only)
 */
const getAllContacts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) {
      where.status = status;
    }

    const { count, rows: contacts } = await Contact.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    return sendSuccess(res, {
      contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return sendError(res, 'Failed to fetch contact submissions', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Get a single contact submission by ID (admin only)
 */
const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return sendError(res, 'Contact submission not found', HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccess(res, { contact });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return sendError(res, 'Failed to fetch contact submission', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Update contact status (admin only)
 */
const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, replyMessage } = req.body;

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return sendError(res, 'Contact submission not found', HTTP_STATUS.NOT_FOUND);
    }

    // Validate status
    const validStatuses = ['new', 'read', 'replied', 'archived'];
    if (status && !validStatuses.includes(status)) {
      return sendValidationError(res, {
        status: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updateData = {};
    if (status) {
      updateData.status = status;
    }
    if (replyMessage) {
      updateData.replyMessage = replyMessage.trim();
      updateData.repliedAt = new Date();
      if (!status || status !== 'replied') {
        updateData.status = 'replied';
      }
    }

    await contact.update(updateData);

    return sendSuccess(res, { contact }, 'Contact status updated successfully');
  } catch (error) {
    console.error('Error updating contact status:', error);
    return sendError(res, 'Failed to update contact status', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Delete a contact submission (admin only)
 */
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return sendError(res, 'Contact submission not found', HTTP_STATUS.NOT_FOUND);
    }

    await contact.destroy();

    return sendSuccess(res, null, 'Contact submission deleted successfully');
  } catch (error) {
    console.error('Error deleting contact:', error);
    return sendError(res, 'Failed to delete contact submission', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact
};
