import React, { useEffect, useRef } from 'react';

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptId = 'bold-payment-button-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://checkout.bold.co/library/boldPaymentButton.js';
      script.async = true;
      document.body.appendChild(script);
    }
    if (containerRef.current) {
      containerRef.current.innerHTML = ''; // Clear container
      const btnScript = document.createElement('script');
      btnScript.setAttribute('data-bold-button', '');
      btnScript.setAttribute('data-api-key', apiKey);
      btnScript.setAttribute('data-order-id', orderId);
      btnScript.setAttribute('data-amount', amount);
      btnScript.setAttribute('data-currency', currency);
      btnScript.setAttribute('data-description', description);
      btnScript.setAttribute('data-tax', tax);
      btnScript.setAttribute('data-integrity-signature', integritySignature);
      btnScript.setAttribute('data-redirection-url', redirectionUrl);
      containerRef.current.appendChild(btnScript);
    }
  }, [apiKey, orderId, amount, currency, description, tax, integritySignature, redirectionUrl]);

  return <div ref={containerRef} />;
};

export default PaymentButton;
