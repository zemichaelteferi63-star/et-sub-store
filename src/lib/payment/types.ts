export type PaymentStatus = 'PENDING' | 'PAYMENT_PROCESSING' | 'PAID' | 'PAYMENT_FAILED';

export interface PaymentInitiationParams {
  orderNumber: string;
  amountETB: number;
  customerName: string;
  customerPhone: string;
  callbackUrl: string;
  returnUrl: string;
}

export interface PaymentInitiationResult {
  success: boolean;
  paymentUrl?: string;
  qrData?: string;
  transactionRef?: string;
  instructions: {
    receiverName: string;
    receiverPhone: string;
    shortCode?: string;
    ussdString?: string;
    amount: number;
  };
  rawResponse?: any;
  error?: string;
}

export interface PaymentVerificationParams {
  orderNumber: string;
  transactionId?: string;
  amountETB?: number;
}

export interface PaymentVerificationResult {
  success: boolean;
  status: PaymentStatus;
  transactionId: string;
  paidAmount?: number;
  paidAt?: Date;
  message: string;
  rawResponse?: any;
}

export interface PaymentWebhookPayload {
  orderNumber: string;
  transactionId: string;
  amount: number;
  status: string;
  signature?: string;
  timestamp?: string;
  [key: string]: any;
}

export interface PaymentProvider {
  name: string;
  initiatePayment(params: PaymentInitiationParams): Promise<PaymentInitiationResult>;
  verifyPayment(params: PaymentVerificationParams): Promise<PaymentVerificationResult>;
  handleWebhook(payload: PaymentWebhookPayload): Promise<PaymentVerificationResult>;
  getPaymentStatus(orderNumber: string): Promise<PaymentStatus>;
}
