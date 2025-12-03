# Plesk Environment Variables Configuration

This document contains all the environment variables needed for your Plesk deployment.

## Required Environment Variables for Production

Copy and paste these into Plesk Node.js settings under "Custom environment variables":

```bash
# Environment
NODE_ENV=production

# Server Port (Leave empty or set to 3000 - Passenger will handle it)
PORT=3000

# Database Configuration
# ⚠️ REPLACE THESE WITH YOUR ACTUAL DATABASE CREDENTIALS
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tayseerulquran_db
DB_USER=root
DB_PASSWORD=your_database_password_here

# JWT Security
# ⚠️ REPLACE WITH A STRONG SECRET KEY (use a random string generator)
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_REFRESH_EXPIRE=30d

# CORS (Optional - for production, you can leave this or set to your domain)
CORS_ORIGIN=https://tayseerulquran.org
```

## Optional: Payment Gateway Variables

Only add these if you're using payment gateways:

```bash
# Stripe (if using Stripe)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# PayPal (if using PayPal)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_WEBHOOK_SECRET=your_paypal_webhook_secret
PAYPAL_MODE=live
```

## Default Values (from config/env.js)

If you don't set these variables, the application will use these defaults:

| Variable | Default Value | Required in Production? |
|----------|---------------|-------------------------|
| `NODE_ENV` | `development` | ✅ Yes - Must be `production` |
| `PORT` | `3000` | ⚠️ Optional - Passenger handles this |
| `DB_HOST` | `localhost` | ✅ Yes - Set to your database host |
| `DB_PORT` | `3306` | ✅ Yes - Usually `3306` for MySQL |
| `DB_NAME` | `tayseerulquran_db` | ✅ Yes - Your database name |
| `DB_USER` | `root` | ✅ Yes - Your database username |
| `DB_PASSWORD` | `` (empty) | ✅ Yes - Your database password |
| `JWT_SECRET` | `default_secret_change_in_production` | ✅ Yes - Must change! |
| `JWT_EXPIRE` | `7d` | ⚠️ Optional |
| `JWT_REFRESH_SECRET` | `default_refresh_secret` | ⚠️ Optional but recommended |
| `JWT_REFRESH_EXPIRE` | `30d` | ⚠️ Optional |
| `CORS_ORIGIN` | `http://localhost:5500,...` | ⚠️ Optional - Set to your domain |

## How to Set in Plesk

1. Log into Plesk
2. Go to **Domains** → **tayseerulquran.org**
3. Click on **Node.js**
4. Scroll down to **Custom environment variables**
5. Click **Add Variable** for each variable
6. Enter the **Variable name** and **Variable value**
7. Click **Apply** or **Restart App**

## Important Notes

⚠️ **CRITICAL**: You MUST change these values from defaults:
- `NODE_ENV` must be `production`
- `DB_NAME`, `DB_USER`, `DB_PASSWORD` - Use your actual database credentials
- `JWT_SECRET` - Must be a strong, random secret key (never use the default!)

🔒 **Security**: 
- Never commit `.env` files to Git
- Use strong, random strings for `JWT_SECRET` and `JWT_REFRESH_SECRET`
- Keep your database credentials secure

## Quick Setup Template

Copy this template and fill in your actual values:

```
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_actual_database_name
DB_USER=your_actual_database_user
DB_PASSWORD=your_actual_database_password
JWT_SECRET=generate_a_random_string_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=generate_another_random_string_here
JWT_REFRESH_EXPIRE=30d
CORS_ORIGIN=https://tayseerulquran.org
```

## Testing Your Configuration

After setting the variables:
1. Click **Restart App** in Plesk
2. Check the application logs for any errors
3. Visit `https://tayseerulquran.org/api/health` to test the connection
4. Check browser console for any connection errors

