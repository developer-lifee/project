import React, { useEffect, useState } from 'react';

interface PaymentButtonProps {
  apiKey: string;
  orderId: string;
  amount: string;
  currency: string;
  description: string;
  tax: string;
  integritySignature: string;
  redirectionUrl: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  apiKey,
  orderId,
  amount,
  currency,
  description,
  tax,
  integritySignature,
  redirectionUrl,
}) => {
  const [boldCheckoutLoaded, setBoldCheckoutLoaded] = useState(false);

  useEffect(() => {
    const scriptId = 'bold-payment-button-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://checkout.bold.co/library/boldPaymentButton.js';
      script.async = true;
      script.onload = () => setBoldCheckoutLoaded(true);
      script.onerror = () =>
        console.error('Error al cargar la librería de Bold');
      document.head.appendChild(script);
    } else {
      setBoldCheckoutLoaded(true);
    }
  }, []);

  const handleClick = () => {
    if (boldCheckoutLoaded && (window as any).BoldCheckout) {
      const checkout = new (window as any).BoldCheckout({
        orderId,
        currency,
        amount,
        apiKey,
        integritySignature,
        description,
        tax,
        redirectionUrl,
      });
      checkout.open();
    } else {
      console.error('BoldCheckout no está disponible');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition-colors"
    >
      Pagar ahora
    </button>
  );
};

export default PaymentButton;
