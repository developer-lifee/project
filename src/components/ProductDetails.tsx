import React, { useState } from 'react';

const ProductDetails: React.FC = () => {
  // Lista de imágenes en public/images
  const images = [
    '../../public/iphone13promax1.jpg',
    '../../public/iphone13promax2.jpg',
    '../../public/iphone13promax3.jpg',
    '../../public/iphone13promax4.jpg',
  ];

  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg bg-white mb-8">
      <h2 className="text-2xl font-bold mb-4">iPhone 13 Pro Max</h2>
      {/* Imagen principal */}
      <div className="mb-4">
        <img
          src={selectedImage}
          alt="iPhone 13 Pro Max"
          className="w-full h-64 object-cover rounded"
        />
      </div>
      {/* Miniaturas */}
      <div className="flex justify-center gap-2 mb-4">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className={`p-1 border rounded ${selectedImage === img ? 'border-blue-500' : 'border-gray-300'}`}
          >
            <img
              src={img}
              alt={`Miniatura ${index + 1}`}
              className="w-16 h-16 object-cover rounded"
            />
          </button>
        ))}
      </div>
      {/* Detalles del producto */}
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
