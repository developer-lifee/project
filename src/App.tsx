import React from 'react';
import NumberSelector from './components/NumberSelector';
import ProductDetails from './components/ProductDetails';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        {/* Mostrar detalles del producto */}
        <ProductDetails />
        {/* Selector de números y flujo de pago */}
        <NumberSelector />
      </div>
    </div>
  );
}

export default App;