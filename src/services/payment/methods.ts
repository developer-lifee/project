import { createHeaders } from '../api';
import { BOLD_API, PAYMENT_CONFIG } from '../../config/constants';
import type { PaymentMethods, PaymentResponse } from './types';

export const getPaymentMethods = async (): Promise<PaymentMethods> => {
  try {
    const response = await fetch(`${BOLD_API.BASE_URL}/online/link/v1/payment_methods`, {
      method: 'GET',
      headers: createHeaders(),
      mode: 'cors',
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data: PaymentResponse = await response.json();
    
    if (!data.payload.payment_methods) {
      throw new Error('No hay métodos de pago disponibles');
    }

    return Object.fromEntries(
      Object.entries(data.payload.payment_methods)
        .filter(([key]) => PAYMENT_CONFIG.ALLOWED_METHODS.includes(key))
    );
  } catch (error) {
    console.error('Error al obtener métodos de pago:', error);
    throw new Error('No se pudieron cargar los métodos de pago. Por favor, intente nuevamente.');
  }
};