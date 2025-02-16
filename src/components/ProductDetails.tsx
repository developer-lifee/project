import React, { useState } from 'react';

interface ProductDetailsProps {
  isAdmin: boolean;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ isAdmin }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const images = [
    '/images/iphone13promax1.jpg',
    '/images/iphone13promax2.jpg',
    '/images/iphone13promax3.jpg',
    '/images/iphone13promax4.jpg',
  ];
  const [selectedImage, setSelectedImage] = useState<string>(images[0]);

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg bg-white mb-8 relative">
      <h2 className="text-2xl font-bold mb-4 text-center">iPhone 13 Pro Max</h2>
      {/* Show edit button if admin */}
      {isAdmin && (
        <button className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-sm">
          Editar
        </button>
      )}
      {/* Imagen principal */}
      <div className="mb-4">
        <img
          src={selectedImage}
          alt="Imagen principal"
          className="w-full h-48 object-cover rounded"
        />
      </div>
      <div className="text-center mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {isExpanded ? 'Ocultar detalles' : 'Ver detalles de la rifa'}
        </button>
      </div>
      {isExpanded && (
        <div className="text-gray-700">
          <div className="flex gap-2 mb-4 justify-center">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`p-1 border rounded transition-colors ${
                  selectedImage === img ? 'border-blue-500' : 'border-gray-300'
                }`}
              >
                <img
                  src={img}
                  alt={`Miniatura ${index + 1}`}
                  className="w-16 h-16 object-cover rounded"
                />
              </button>
            ))}
          </div>
          <ul className="list-disc list-inside mb-4">
            <li><strong>Incluye:</strong> Forro y cargador original</li>
            <li>
              <strong>Especificaciones:</strong> Pantalla Super Retina XDR de 6.7", Chip A15 Bionic, sistema de triple cámara y demás detalles de fábrica.
            </li>
            <li><strong>Capacidad de batería:</strong> 84%</li>
            <li>
              <strong>Observación:</strong> La cámara presenta reemplazo o golpes que afectan cierto modo.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
