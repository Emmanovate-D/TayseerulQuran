# Payment Gateway Setup Guide

This guide explains how to configure Stripe and PayPal payment gateways for TayseerulQuran.

## Overview

The application supports multiple payment gateways:
- **Stripe** - For credit/debit card payments
- **PayPal** - For PayPal account payments
- **Bank Transfer** - For manual payment processing (no API keys required)

## Environment Variables

All payment gateway credentials are configured via environment variables in your `.env` file. See `.env.example` for the complete list.

## Stripe Setup

### 1. Create a Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for a free account
3. Complete the account setup process

### 2. Get Your API Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API keys**
3. You'll see two keys:
   - **Publishable key** (starts with `pk_test_` for test mode)
   - **Secret key** (starts with `sk_test_` for test mode)

### 3. Get Your Webhook Secret

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your webhook URL: `https://your-domain.com/api/payments/webhook/stripe`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy the **Signing secret** (starts with `whsec_`)

### 4. Configure Environment Variables

Add to your `.env` file:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 5. Switch to Live Mode (Production)

1. In Stripe Dashboard, toggle **Test mode** to **Live mode**
2. Get your live API keys (starts with `sk_live_` and `pk_live_`)
3. Update your `.env` file with live keys
4. Create a new webhook endpoint for production
5. Update `STRIPE_WEBHOOK_SECRET` with the live webhook secret

## PayPal Setup

### 1. Create a PayPal Business Account

1. Go to [https://www.paypal.com/business](https://www.paypal.com/business)
2. Sign up for a business account
3. Complete the verification process

### 2. Get Your API Credentials (Sandbox)

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard)
2. Navigate to **My Apps & Credentials**
3. Under **Sandbox**, click **Create App**
4. Enter app name and select **Merchant** account type
5. Copy:
   - **Client ID**
   - **Secret** (click **Show** to reveal)

### 3. Get Your Webhook Secret (Sandbox)

1. In PayPal Developer Dashboard, go to **My Apps & Credentials**
2. Click on your app
3. Scroll to **Webhooks** section
4. Click **Add Webhook**
5. Enter webhook URL: `https://your-domain.com/api/payments/webhook/paypal`
6. Select events:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
   - `PAYMENT.CAPTURE.REFUNDED`
7. Copy the **Webhook ID** (you'll need this for verification)

### 4. Configure Environment Variables (Sandbox)

Add to your `.env` file:

```env
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
PAYPAL_WEBHOOK_SECRET=your_webhook_id
PAYPAL_MODE=sandbox
```

### 5. Switch to Live Mode (Production)

1. In PayPal Developer Dashboard, go to **My Apps & Credentials**
2. Under **Live**, click **Create App**
3. Enter app name and select **Merchant** account type
4. Copy live **Client ID** and **Secret**
5. Create a live webhook endpoint
6. Update your `.env` file:

```env
PAYPAL_CLIENT_ID=your_live_client_id
PAYPAL_CLIENT_SECRET=your_live_client_secret
PAYPAL_WEBHOOK_SECRET=your_live_webhook_id
PAYPAL_MODE=live
```

## Testing

### Test Stripe Payments

1. Use Stripe test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Use any future expiry date, any CVC, any ZIP
2. Test webhooks using Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/payments/webhook/stripe
   ```

### Test PayPal Payments

1. Use PayPal sandbox test accounts:
   - Create test accounts in PayPal Developer Dashboard
   - Use these accounts to test payments
2. Test webhooks using PayPal webhook simulator in the dashboard

## Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use different keys** for development and production
3. **Rotate keys regularly** if compromised
4. **Use webhook secrets** to verify webhook authenticity
5. **Enable IP whitelisting** in PayPal dashboard (if available)
6. **Monitor transactions** regularly in both dashboards
7. **Use HTTPS** for all webhook endpoints in production

## Troubleshooting

### Stripe Issues

- **"Invalid API Key"**: Check that your secret key starts with `sk_test_` (test) or `sk_live_` (production)
- **Webhook verification fails**: Ensure `STRIPE_WEBHOOK_SECRET` matches the webhook signing secret
- **Payment fails**: Check Stripe Dashboard → Logs for detailed error messages

### PayPal Issues

- **"Invalid credentials"**: Verify `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` are correct
- **Webhook not received**: Check that webhook URL is accessible and `PAYPAL_MODE` matches your app type
- **Payment stuck in pending**: Check PayPal Dashboard → Transactions for status

## Support

- **Stripe Support**: [https://support.stripe.com](https://support.stripe.com)
- **PayPal Support**: [https://www.paypal.com/support](https://www.paypal.com/support)
- **Stripe API Docs**: [https://stripe.com/docs/api](https://stripe.com/docs/api)
- **PayPal API Docs**: [https://developer.paypal.com/docs/api/overview](https://developer.paypal.com/docs/api/overview)

