/**
 * Payment Gateway Service
 * Abstracted adapter pattern for multiple payment gateways
 * Supports: Stripe, PayPal, Bank Transfer
 */

const crypto = require('crypto');

/**
 * Base Payment Gateway Interface
 */
class PaymentGateway {
  constructor(config) {
    this.config = config;
  }

  async processPayment(paymentData) {
    throw new Error('processPayment must be implemented by subclass');
  }

  async verifyWebhook(payload, signature) {
    throw new Error('verifyWebhook must be implemented by subclass');
  }

  async handleWebhook(payload) {
    throw new Error('handleWebhook must be implemented by subclass');
  }

  async refund(paymentId, amount) {
    throw new Error('refund must be implemented by subclass');
  }
}

/**
 * Stripe Payment Gateway
 */
class StripeGateway extends PaymentGateway {
  constructor(config) {
    super(config);
    // In production, use: const stripe = require('stripe')(config.secretKey);
    this.stripe = null; // Would be initialized with Stripe SDK
  }

  async processPayment(paymentData) {
    try {
      // Mock implementation - replace with actual Stripe API calls
      const { amount, currency, paymentMethod, metadata } = paymentData;
      
      // In production:
      // const paymentIntent = await this.stripe.paymentIntents.create({
      //   amount: Math.round(amount * 100), // Convert to cents
      //   currency: currency.toLowerCase(),
      //   payment_method: paymentMethod,
      //   metadata: metadata
      // });

      // Mock response
      const transactionId = `stripe_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
      
      return {
        success: true,
        transactionId,
        status: 'completed',
        gateway: 'stripe',
        metadata: {
          paymentIntentId: transactionId,
          amount,
          currency
        }
      };
    } catch (error) {
      throw new Error(`Stripe payment failed: ${error.message}`);
    }
  }

  async verifyWebhook(payload, signature) {
    try {
      // In production:
      // const event = this.stripe.webhooks.constructEvent(
      //   payload,
      //   signature,
      //   this.config.webhookSecret
      // );
      // return event;

      // Mock verification - in production, verify signature
      return JSON.parse(payload);
    } catch (error) {
      throw new Error(`Stripe webhook verification failed: ${error.message}`);
    }
  }

  async handleWebhook(event) {
    try {
      // Handle different event types
      switch (event.type) {
        case 'payment_intent.succeeded':
          return {
            transactionId: event.data.object.id,
            status: 'completed',
            amount: event.data.object.amount / 100,
            currency: event.data.object.currency
          };
        case 'payment_intent.payment_failed':
          return {
            transactionId: event.data.object.id,
            status: 'failed',
            error: event.data.object.last_payment_error?.message
          };
        default:
          return null;
      }
    } catch (error) {
      throw new Error(`Stripe webhook handling failed: ${error.message}`);
    }
  }

  async refund(paymentId, amount) {
    try {
      // In production:
      // const refund = await this.stripe.refunds.create({
      //   payment_intent: paymentId,
      //   amount: Math.round(amount * 100)
      // });

      const refundId = `re_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
      
      return {
        success: true,
        refundId,
        amount,
        status: 'refunded'
      };
    } catch (error) {
      throw new Error(`Stripe refund failed: ${error.message}`);
    }
  }
}

/**
 * PayPal Payment Gateway
 */
class PayPalGateway extends PaymentGateway {
  constructor(config) {
    super(config);
    // In production, use PayPal SDK
    // Use mode from config (sandbox/live) or fallback to sandbox flag
    const isSandbox = config.mode === 'sandbox' || (config.sandbox !== false && !config.mode);
    this.apiUrl = isSandbox 
      ? 'https://api.sandbox.paypal.com' 
      : 'https://api.paypal.com';
    this.clientId = config.clientId || '';
    this.clientSecret = config.clientSecret || '';
  }

  async processPayment(paymentData) {
    try {
      const { amount, currency, metadata } = paymentData;
      
      // Mock implementation - replace with actual PayPal API calls
      const transactionId = `paypal_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
      
      return {
        success: true,
        transactionId,
        status: 'pending', // PayPal payments are often pending until confirmed
        gateway: 'paypal',
        redirectUrl: `${this.apiUrl}/checkout?token=${transactionId}`,
        metadata: {
          orderId: transactionId,
          amount,
          currency
        }
      };
    } catch (error) {
      throw new Error(`PayPal payment failed: ${error.message}`);
    }
  }

  async verifyWebhook(payload, signature) {
    try {
      // In production, verify PayPal webhook signature
      // const verified = await paypal.verifyWebhook(payload, signature);
      return JSON.parse(payload);
    } catch (error) {
      throw new Error(`PayPal webhook verification failed: ${error.message}`);
    }
  }

  async handleWebhook(event) {
    try {
      switch (event.event_type) {
        case 'PAYMENT.CAPTURE.COMPLETED':
          return {
            transactionId: event.resource.id,
            status: 'completed',
            amount: parseFloat(event.resource.amount.value),
            currency: event.resource.amount.currency_code
          };
        case 'PAYMENT.CAPTURE.DENIED':
          return {
            transactionId: event.resource.id,
            status: 'failed',
            error: 'Payment denied'
          };
        default:
          return null;
      }
    } catch (error) {
      throw new Error(`PayPal webhook handling failed: ${error.message}`);
    }
  }

  async refund(paymentId, amount) {
    try {
      const refundId = `refund_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
      
      return {
        success: true,
        refundId,
        amount,
        status: 'refunded'
      };
    } catch (error) {
      throw new Error(`PayPal refund failed: ${error.message}`);
    }
  }
}

/**
 * Bank Transfer Gateway (Manual Processing)
 */
class BankTransferGateway extends PaymentGateway {
  async processPayment(paymentData) {
    try {
      const { amount, currency, metadata } = paymentData;
      
      // Generate reference number
      const reference = `BT-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      
      return {
        success: true,
        transactionId: reference,
        status: 'pending', // Bank transfers require manual confirmation
        gateway: 'bank_transfer',
        metadata: {
          reference,
          amount,
          currency,
          instructions: 'Please transfer the amount to the provided bank account'
        }
      };
    } catch (error) {
      throw new Error(`Bank transfer processing failed: ${error.message}`);
    }
  }

  async verifyWebhook(payload, signature) {
    // Bank transfers don't have webhooks - manual confirmation required
    return null;
  }

  async handleWebhook(event) {
    // Bank transfers don't have webhooks
    return null;
  }

  async refund(paymentId, amount) {
    // Bank transfer refunds are manual
    return {
      success: true,
      refundId: `refund_${Date.now()}`,
      amount,
      status: 'pending_refund',
      note: 'Refund will be processed manually'
    };
  }
}

/**
 * Payment Gateway Factory
 */
class PaymentGatewayFactory {
  static create(gatewayType, config) {
    switch (gatewayType.toLowerCase()) {
      case 'stripe':
        return new StripeGateway(config);
      case 'paypal':
        return new PayPalGateway(config);
      case 'bank_transfer':
      case 'bank_transfer':
        return new BankTransferGateway(config);
      default:
        throw new Error(`Unsupported payment gateway: ${gatewayType}`);
    }
  }
}

/**
 * Process payment with idempotency
 */
async function processPaymentWithIdempotency(gateway, paymentData, idempotencyKey) {
  // In production, check if payment with this idempotency key already exists
  // This prevents duplicate charges
  
  try {
    const result = await gateway.processPayment(paymentData);
    
    // Store idempotency key mapping (in production, use Redis or database)
    // idempotencyStore.set(idempotencyKey, result.transactionId);
    
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  PaymentGateway,
  StripeGateway,
  PayPalGateway,
  BankTransferGateway,
  PaymentGatewayFactory,
  processPaymentWithIdempotency
};

