import React from 'react';
import NumberSelector from './components/NumberSelector';
import ProductDetailsModal from './components/ProductDetailsModal';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ProductDetailsModal />
      <div className="container mx-auto">
        {/* Selector de números y flujo de pago */}
        <NumberSelector />
      </div>
    </div>
  );
}

export default App;