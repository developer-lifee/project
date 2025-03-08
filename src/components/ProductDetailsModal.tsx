import React, { useState } from 'react';
import Modal from './Modal';

const ProductDetailsModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const images = [
    '../../public/iphone13promax1.jpg',
    '../../public/iphone13promax2.jpg',
    '../../public/iphone13promax3.jpg',
    '../../public/iphone13promax4.jpg',
  ];
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <>
      {/* Botón with luxury styling */}
      <button
        onClick={() => setIsOpen(true)}
        className="block mx-auto my-2 bg-yellow-500 text-purple-900 font-bold px-4 py-1 rounded-full shadow hover:bg-yellow-400 transition-colors"
      >
        Detalles de la rifa
      </button>

      {/* Modal con detalles del producto - updated styling */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-4 bg-gradient-to-b from-purple-50 to-white">
          <h2 className="text-xl font-bold mb-4 text-purple-900">iPhone 13 Pro Max</h2>
          {/* Imagen principal */}
          <div className="mb-4">
            <img
              src={selectedImage}
              alt="iPhone 13 Pro Max"
              className="w-full h-64 object-cover rounded shadow-md"
            />
          </div>
          {/* Miniaturas */}
          <div className="flex gap-2 mb-4">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`p-1 border rounded transition-colors ${
                  selectedImage === img 
                    ? 'border-yellow-500 bg-yellow-50' 
                    : 'border-gray-300 hover:border-yellow-400'
                }`}
              >
                <img
                  src={img}
                  alt={`Detalle ${index + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
              </button>
            ))}
          </div>
          {/* Detalles del producto */}
          <ul className="list-disc list-inside text-gray-700 bg-purple-50 p-4 rounded-lg">
            <li><strong className="text-purple-900">Incluye:</strong> Forro y cargador original</li>
            <li>
              <strong className="text-purple-900">Especificaciones:</strong> Pantalla Super Retina XDR de 6.7", Chip A15 Bionic, sistema de triple cámara y demás detalles de fábrica.
            </li>
            <li><strong className="text-purple-900">Capacidad de batería:</strong>84%</li>
            <li>
              <strong className="text-purple-900">Observación:</strong> La aplicacion del modo cine solo funciona al x3.
            </li>
          </ul>
        </div>
      </Modal>
    </>
  );
};

export default ProductDetailsModal;
