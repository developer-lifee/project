import React, { useEffect } from 'react';
import NumberSelector from './components/NumberSelector';

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
    </div>
  );
}

export default App;