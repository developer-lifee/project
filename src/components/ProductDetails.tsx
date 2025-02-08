import React from 'react';

const ProductDetails: React.FC = () => {
  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg bg-white mb-8">
      <h2 className="text-2xl font-bold mb-4">iPhone 13 Pro Max</h2>
      <img
        src="/images/iphone13promax.jpg" // Asegúrate de que la imagen exista o usa una URL externa
        alt="iPhone 13 Pro Max"
        className="w-full mb-4 object-cover rounded"
      />
      <ul className="list-disc list-inside text-gray-700">
        <li><strong>Batería:</strong> 84% de capacidad</li>
        <li><strong>Incluye:</strong> Forro y cargador original</li>
        <li>
          <strong>Especificaciones:</strong> Pantalla Super Retina XDR de 6.7", Chip A15 Bionic, sistema de triple cámara, etc.
        </li>
      </ul>
    </div>
  );
};

export default ProductDetails;
