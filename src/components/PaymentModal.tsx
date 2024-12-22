import React, { useState, useEffect } from 'react';
import { Loader2, Building2, CreditCard } from 'lucide-react';
import { getPaymentMethods, createPaymentLink } from '../services/payment';
import { PAYMENT_CONFIG } from '../config/constants';

interface Props {
  onSuccess: () => void;
  onError: (error: string) => void;
}

const PAYMENT_ICONS = {
  PSE: Building2,
  NEQUI: CreditCard,
  BOTON_BANCOLOMBIA: Building2
} as const;

const PAYMENT_LABELS = {
  PSE: 'PSE',
  NEQUI: 'Nequi',
  BOTON_BANCOLOMBIA: 'Botón Bancolombia'
} as const;

const PaymentModal: React.FC<Props> = ({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const methods = await getPaymentMethods();
      setPaymentMethods(Object.keys(methods));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar métodos de pago';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async (method: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const paymentUrl = await createPaymentLink();
      window.location.href = paymentUrl;
      onSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar el pago';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadPaymentMethods}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold mb-4">Selecciona tu método de pago</h3>
      <p className="mb-6">
        Total a pagar: ${PAYMENT_CONFIG.PACKAGE_PRICE.toLocaleString('es-CO')}
      </p>
      
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          paymentMethods.map((method) => {
            const Icon = PAYMENT_ICONS[method as keyof typeof PAYMENT_ICONS];
            return (
              <button
                key={method}
                onClick={() => handlePayment(method)}
                disabled={isLoading}
                className="w-full bg-white border-2 border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6" />
                  <span className="font-medium">
                    {PAYMENT_LABELS[method as keyof typeof PAYMENT_LABELS]}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PaymentModal;