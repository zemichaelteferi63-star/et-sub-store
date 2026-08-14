import { PaymentProvider } from './types';
import { TelebirrProvider } from './telebirrProvider';

export * from './types';
export * from './telebirrProvider';

export function getPaymentProvider(method: string = 'TELEBIRR'): PaymentProvider {
  switch (method.toUpperCase()) {
    case 'TELEBIRR':
    default:
      return new TelebirrProvider();
  }
}
