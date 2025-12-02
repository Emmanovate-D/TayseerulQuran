# Email Service Setup Guide

This guide explains how to configure the email service for TayseerulQuran backend.

## Features

The email service supports:
- ✅ Email verification (sent on registration)
- ✅ Password reset emails
- ✅ Payment confirmation emails
- ✅ Enrollment confirmation emails

## Configuration

### Environment Variables

Add the following variables to your `.env` file:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=TayseerulQuran
FRONTEND_URL=http://localhost:5500
```

### Gmail Setup

If using Gmail, you need to:

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in `EMAIL_PASSWORD`

### Other Email Providers

#### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

#### SendGrid
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

#### Mailgun
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=your-mailgun-username
EMAIL_PASSWORD=your-mailgun-password
```

#### AWS SES
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your-ses-smtp-username
EMAIL_PASSWORD=your-ses-smtp-password
```

## Database Migration

The User model has been updated with the following fields:
- `emailVerificationToken` (STRING)
- `emailVerificationTokenExpiry` (DATE)
- `passwordResetToken` (STRING)
- `passwordResetTokenExpiry` (DATE)

If you need to add these fields to an existing database, run a migration or manually add the columns.

### SQL Migration (MySQL)

```sql
ALTER TABLE users 
ADD COLUMN emailVerificationToken VARCHAR(255) NULL,
ADD COLUMN emailVerificationTokenExpiry DATETIME NULL,
ADD COLUMN passwordResetToken VARCHAR(255) NULL,
ADD COLUMN passwordResetTokenExpiry DATETIME NULL;
```

## API Endpoints

### Email Verification

**Verify Email**
```
POST /api/auth/verify-email
Body: { "token": "verification-token" }
```

**Resend Verification Email**
```
POST /api/auth/resend-verification
Body: { "email": "user@example.com" }
```

### Password Reset

**Request Password Reset**
```
POST /api/auth/forgot-password
Body: { "email": "user@example.com" }
```

**Reset Password**
```
POST /api/auth/reset-password
Body: { 
  "token": "reset-token",
  "newPassword": "new-password"
}
```

## Email Templates

All email templates are HTML-based and include:
- Responsive design
- Brand colors and styling
- Clear call-to-action buttons
- Mobile-friendly layout

Templates are located in `backend/services/emailService.js` and can be customized as needed.

## Testing

### Development Mode

If email is not configured, the service will log email details to the console instead of sending actual emails. This allows development without email setup.

### Production

Ensure all environment variables are set correctly. The service will verify the connection on startup and log any errors.

## Troubleshooting

### Emails Not Sending

1. Check environment variables are set correctly
2. Verify SMTP credentials
3. Check firewall/network settings
4. Review server logs for error messages

### Gmail "Less Secure App" Error

Gmail no longer supports "Less Secure Apps". Use an App Password instead (see Gmail Setup above).

### Connection Timeout

- Check if port 587 is open
- Try port 465 with `EMAIL_SECURE=true`
- Verify SMTP host is correct

## Security Notes

- Never commit `.env` file to version control
- Use App Passwords, not your main account password
- Tokens expire after their respective timeouts (24h for verification, 1h for password reset)
- Tokens are cryptographically secure random strings

