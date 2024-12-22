import { createHeaders } from '../api';
import { BOLD_API, PAYMENT_CONFIG } from '../../config/constants';
import type { PaymentResponse } from './types';

export const createPaymentLink = async (): Promise<string> => {
  try {
    const response = await fetch(`${BOLD_API.BASE_URL}/online/link/v1`, {
      method: 'POST',
      headers: createHeaders(),
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify({
        amount_type: 'CLOSE',
        amount: {
          currency: PAYMENT_CONFIG.CURRENCY,
          total_amount: PAYMENT_CONFIG.PACKAGE_PRICE
        },
        description: PAYMENT_CONFIG.DESCRIPTION,
        payment_methods: PAYMENT_CONFIG.ALLOWED_METHODS,
        expiration_date: Date.now() + PAYMENT_CONFIG.EXPIRATION_TIME
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }
    
    const data: PaymentResponse = await response.json();
    
    if (!data.payload.url) {
      throw new Error('No se recibió el enlace de pago');
    }

    return data.payload.url;
  } catch (error) {
    console.error('Error al crear enlace de pago:', error);
    throw new Error('No se pudo crear el enlace de pago. Por favor, intente nuevamente.');
  }
};