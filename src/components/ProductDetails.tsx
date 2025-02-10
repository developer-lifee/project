import React, { useState } from 'react';

const ProductDetails: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const images = [
    '../../public/iphone13promax1.jpg',
    '../../public/iphone13promax2.jpg',
    '../../public/iphone13promax3.jpg',
    '../../public/iphone13promax4.jpg',
  ];
  const mainImage = images[0];

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg bg-white mb-8">
      <h2 className="text-2xl font-bold mb-4 text-center">iPhone 13 Pro Max</h2>
      {/* Imagen principal */}
      <div className="mb-4">
        <img
          src={mainImage}
          alt="iPhone 13 Pro Max"
          className="w-full h-64 object-cover rounded"
        />
      </div>
      {/* Botón para expandir o contraer detalles */}
      <div className="text-center mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {isExpanded ? 'Ocultar detalles' : 'Ver detalles de la rifa'}
        </button>
      </div>
      {/* Detalles adicionales al expandir */}
      {isExpanded && (
        <div className="text-gray-700">
          <ul className="list-disc list-inside mb-4">
            <li><strong>Incluye:</strong> Forro y cargador original</li>
            <li>
              <strong>Especificaciones:</strong> Pantalla Super Retina XDR de 6.7", Chip A15 Bionic, sistema de triple cámara y demás detalles de fábrica.
            </li>
            <li><strong>Capacidad de batería:</strong> 84%</li>
            <li>
              <strong>Observación:</strong> La cámara presenta reemplazo o golpes que afectan el modo cine y el focus depth.
            </li>
          </ul>
          <div className="flex justify-center gap-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setIsExpanded(true)}
                className="p-1 border rounded hover:border-blue-500 transition-colors"
              >
                <img
                  src={img}
                  alt={`Miniatura ${index + 1}`}
                  className="w-16 h-16 object-cover rounded"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
