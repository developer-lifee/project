export interface BoldCheckoutConfig {
  orderId: string;
  apiKey: string;
  amount: number;
  currency: string;
  description: string;
  tax: number;
  integritySignature: string;
  redirectionUrl: string;
}

export const initializeBoldCheckout = async (): Promise<void> => {
  try {
    const response = await fetch(PAYMENT_CONFIG.API_URL);
    if (!response.ok) {
      throw new Error('Error al obtener el token de pago');
    }
    
    const data: BoldCheckoutConfig = await response.json();
    
    // @ts-ignore - Bold types no están disponibles en TS
    const checkout = new BoldCheckout({
      orderId: data.orderId,
      apiKey: data.apiKey,
      amount: data.amount,
      currency: data.currency,
      description: data.description,
      tax: data.tax,
      integritySignature: data.integritySignature,
      redirectionUrl: data.redirectionUrl,
    });
    
    checkout.open();
  } catch (error) {
    console.error('Error al inicializar el pago:', error);
    throw new Error('No se pudo iniciar el proceso de pago. Por favor, intente nuevamente.');
  }
};