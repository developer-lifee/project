import React, { useEffect } from 'react';
import NumberSelector from './components/NumberSelector';
import PaymentIframe from './components/PaymentIframe';

function App() {
  useEffect(() => {
    const BoldCheckout = (window as any).BoldCheckout;
    if (typeof BoldCheckout !== 'undefined') {
      console.log('BoldCheckout is loaded:', BoldCheckout);
    } else {
      console.error('BoldCheckout is not defined');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <NumberSelector />
      <PaymentIframe />
    </div>
  );
}

export default App;