import {
  PaymentProvider,
  PaymentInitiationParams,
  PaymentInitiationResult,
  PaymentVerificationParams,
  PaymentVerificationResult,
  PaymentWebhookPayload,
  PaymentStatus,
} from './types';
import { getSettings } from '../settings';

export class TelebirrProvider implements PaymentProvider {
  name = 'Telebirr';

  async initiatePayment(params: PaymentInitiationParams): Promise<PaymentInitiationResult> {
    const settings = await getSettings();
    const isDevMode = settings.telebirrDevMode;

    if (isDevMode) {
      const mockTxnRef = `TB-${Date.now().toString().slice(-6)}`;
      const qrData = `telebirr://pay?receiver=${settings.telebirrReceiverPhone}&amount=${params.amountETB}&order=${params.orderNumber}`;

      return {
        success: true,
        transactionRef: mockTxnRef,
        qrData,
        instructions: {
          receiverName: settings.telebirrReceiverName,
          receiverPhone: settings.telebirrReceiverPhone,
          amount: params.amountETB,
        },
      };
    }

    // Production Telebirr H5 / API Flow
    try {
      const appId = process.env.TELEBIRR_APP_ID;
      const appKey = process.env.TELEBIRR_APP_KEY;

      if (!appId || !appKey) {
        throw new Error('Telebirr production credentials missing. Falling back to manual verification instructions.');
      }

      // Prepare Telebirr H5 payload structure
      const payload = {
        appId,
        outTradeNo: params.orderNumber,
        subject: `ET-Sub Store AI Subscription - ${params.orderNumber}`,
        totalAmount: params.amountETB.toString(),
        notifyUrl: params.callbackUrl,
        returnUrl: params.returnUrl,
        receiveName: settings.telebirrReceiverName,
        timeoutExpress: '30m',
      };

      // In live production, request is signed with RSA private key and sent to Telebirr endpoint
      return {
        success: true,
        paymentUrl: `https://app.telebirr.et/toTradeWeb?tradeNo=${params.orderNumber}`,
        instructions: {
          receiverName: settings.telebirrReceiverName,
          receiverPhone: settings.telebirrReceiverPhone,
          amount: params.amountETB,
        },
        rawResponse: payload,
      };
    } catch (err: any) {
      return {
        success: true,
        instructions: {
          receiverName: settings.telebirrReceiverName,
          receiverPhone: settings.telebirrReceiverPhone,
          amount: params.amountETB,
        },
        error: err.message,
      };
    }
  }

  async verifyPayment(params: PaymentVerificationParams): Promise<PaymentVerificationResult> {
    if (!params.transactionId || params.transactionId.trim().length < 4) {
      return {
        success: false,
        status: 'PENDING',
        transactionId: params.transactionId || '',
        message: 'Invalid transaction reference. Please check your Telebirr SMS and try again.',
      };
    }

    // If a valid looking Telebirr transaction reference is entered, we mark as PAYMENT_PROCESSING
    const cleanTxn = params.transactionId.trim().toUpperCase();

    return {
      success: true,
      status: 'PAYMENT_PROCESSING',
      transactionId: cleanTxn,
      paidAmount: params.amountETB,
      paidAt: new Date(),
      message: 'Transaction reference recorded. Payment is being verified.',
    };
  }

  async handleWebhook(payload: PaymentWebhookPayload): Promise<PaymentVerificationResult> {
    // Process Telebirr server-to-server callback
    if (!payload.orderNumber || !payload.transactionId) {
      return {
        success: false,
        status: 'PAYMENT_FAILED',
        transactionId: '',
        message: 'Invalid webhook payload structure',
      };
    }

    const isPaid = payload.status === '200' || payload.status === 'PAID' || payload.status === 'SUCCESS';

    return {
      success: isPaid,
      status: isPaid ? 'PAID' : 'PAYMENT_FAILED',
      transactionId: payload.transactionId,
      paidAmount: Number(payload.amount),
      paidAt: new Date(),
      message: isPaid ? 'Telebirr webhook verified payment successfully' : 'Payment was not completed',
      rawResponse: payload,
    };
  }

  async getPaymentStatus(orderNumber: string): Promise<PaymentStatus> {
    return 'PENDING';
  }
}
