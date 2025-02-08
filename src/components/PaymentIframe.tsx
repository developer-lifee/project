import React, { useEffect } from 'react';
// Suponiendo que tengas una función para registrar la compra de forma definitiva
import { savePurchase } from '../services/api';

const PaymentIframe: React.FC = () => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verifica el origen del mensaje para mayor seguridad
      if (event.origin !== 'https://rifa.sheerit.com.co') return;
      
      if (event.data.status === 'success') {
        alert('¡Pago exitoso! Tu participación ha sido registrada.');
        // Registra la compra en el backend usando los datos almacenados temporalmente.
        const customerData = JSON.parse(sessionStorage.getItem('customerData') || '{}');
        savePurchase(customerData);
      } else if (event.data.status === 'failure') {
        alert('Hubo un problema con el pago. Por favor, inténtalo nuevamente.');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <iframe
      src="https://rifa.sheerit.com.co/bold.php"
      title="Pago con Bold"
      style={{
        width: '100%',
        height: '600px',  // Ajusta según necesites
        border: 'none'
      }}
    />
  );
};

export default PaymentIframe;
