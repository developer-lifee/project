import React from 'react';

const PaymentIframe: React.FC = () => {
  return (
    <iframe
      src="https://rifa.sheerit.com.co/bold.php"
      title="Pago con Bold"
      style={{
        width: '100%',
        height: '600px',  // Ajusta la altura según necesites
        border: 'none',
      }}
    />
  );
};

export default PaymentIframe;
