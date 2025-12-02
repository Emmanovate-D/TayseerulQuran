const nodemailer = require('nodemailer');
const env = require('../config/env');

/**
 * Email Service
 * Handles all email sending functionality
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  /**
   * Initialize email transporter
   */
  initializeTransporter() {
    try {
      // For development, use Gmail SMTP or other service
      // For production, configure with your email service credentials
      this.transporter = nodemailer.createTransport({
        host: env.EMAIL_HOST || 'smtp.gmail.com',
        port: env.EMAIL_PORT || 587,
        secure: env.EMAIL_SECURE === 'true' || false, // true for 465, false for other ports
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASSWORD
        }
      });

      // Verify connection
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('Email service configuration error:', error);
        } else {
          console.log('Email service is ready to send emails');
        }
      });
    } catch (error) {
      console.error('Error initializing email transporter:', error);
      // Create a mock transporter for development if email is not configured
      this.transporter = {
        sendMail: async (options) => {
          console.log('📧 Email would be sent (email not configured):', {
            to: options.to,
            subject: options.subject
          });
          return { messageId: 'mock-' + Date.now() };
        }
      };
    }
  }

  /**
   * Send email
   */
  async sendEmail(options) {
    try {
      if (!this.transporter) {
        console.warn('Email transporter not initialized');
        return { success: false, error: 'Email service not configured' };
      }

      const mailOptions = {
        from: `"${env.EMAIL_FROM_NAME || 'TayseerulQuran'}" <${env.EMAIL_FROM || env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.htmlToText(options.html)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Convert HTML to plain text (simple version)
   */
  htmlToText(html) {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  }

  /**
   * Send email verification email
   */
  async sendVerificationEmail(user, verificationToken) {
    const verificationUrl = `${env.FRONTEND_URL || 'http://localhost:5500'}/verify-email?token=${verificationToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to TayseerulQuran!</h1>
          </div>
          <div class="content">
            <p>Hello ${user.firstName || 'User'},</p>
            <p>Thank you for registering with TayseerulQuran. Please verify your email address to complete your registration.</p>
            <p style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
            <p>This verification link will expire in 24 hours.</p>
            <p>If you did not create an account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} TayseerulQuran. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to: user.email,
      subject: 'Verify Your Email Address - TayseerulQuran',
      html
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${env.FRONTEND_URL || 'http://localhost:5500'}/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello ${user.firstName || 'User'},</p>
            <p>We received a request to reset your password for your TayseerulQuran account.</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #f5576c;">${resetUrl}</p>
            <div class="warning">
              <strong>⚠️ Important:</strong> This link will expire in 1 hour. If you did not request a password reset, please ignore this email and your password will remain unchanged.
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} TayseerulQuran. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to: user.email,
      subject: 'Reset Your Password - TayseerulQuran',
      html
    });
  }

  /**
   * Send payment confirmation email
   */
  async sendPaymentConfirmationEmail(user, payment, course) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .info-row:last-child { border-bottom: none; }
          .info-label { font-weight: bold; color: #666; }
          .info-value { color: #333; }
          .success-badge { display: inline-block; padding: 5px 15px; background: #38ef7d; color: white; border-radius: 20px; font-size: 12px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Confirmed! 🎉</h1>
          </div>
          <div class="content">
            <p>Hello ${user.firstName || 'User'},</p>
            <p>Your payment has been successfully processed. Thank you for your purchase!</p>
            <div class="info-box">
              <div class="info-row">
                <span class="info-label">Transaction ID:</span>
                <span class="info-value">${payment.transactionId || payment.id}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Course:</span>
                <span class="info-value">${course.title || 'N/A'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Amount:</span>
                <span class="info-value"><strong>$${parseFloat(payment.amount).toFixed(2)} ${payment.currency || 'USD'}</strong></span>
              </div>
              <div class="info-row">
                <span class="info-label">Payment Method:</span>
                <span class="info-value">${payment.paymentMethod || 'N/A'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="info-value"><span class="success-badge">${payment.status || 'Completed'}</span></span>
              </div>
              <div class="info-row">
                <span class="info-label">Date:</span>
                <span class="info-value">${new Date(payment.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <p>You can now access your course from your dashboard. Happy learning!</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} TayseerulQuran. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to: user.email,
      subject: `Payment Confirmation - ${course.title || 'Course Enrollment'}`,
      html
    });
  }

  /**
   * Send enrollment confirmation email
   */
  async sendEnrollmentConfirmationEmail(user, enrollment, course) {
    const courseUrl = `${env.FRONTEND_URL || 'http://localhost:5500'}/courses-details.html?id=${course.id}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .course-card { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .info-row { display: flex; justify-content: space-between; padding: 8px 0; }
          .info-label { font-weight: bold; color: #666; }
          .info-value { color: #333; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Enrollment Confirmed! 🎓</h1>
          </div>
          <div class="content">
            <p>Hello ${user.firstName || 'User'},</p>
            <p>Congratulations! You have been successfully enrolled in the course.</p>
            <div class="course-card">
              <h2 style="margin-top: 0; color: #667eea;">${course.title || 'Course'}</h2>
              <div class="info-row">
                <span class="info-label">Enrollment Date:</span>
                <span class="info-value">${new Date(enrollment.enrollmentDate).toLocaleDateString()}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="info-value">${enrollment.status || 'Enrolled'}</span>
              </div>
              ${course.category ? `
              <div class="info-row">
                <span class="info-label">Category:</span>
                <span class="info-value">${course.category}</span>
              </div>
              ` : ''}
            </div>
            <p style="text-align: center;">
              <a href="${courseUrl}" class="button">Start Learning</a>
            </p>
            <p>You can access your course materials and track your progress from your dashboard.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} TayseerulQuran. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to: user.email,
      subject: `Enrollment Confirmed - ${course.title || 'Course'}`,
      html
    });
  }
}

// Export singleton instance
module.exports = new EmailService();

