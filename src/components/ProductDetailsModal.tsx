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

      {/* Modal con detalles del producto */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">iPhone 13 Pro Max</h2>
          {/* Imagen principal */}
          <div className="mb-4">
            <img
              src={selectedImage}
              alt="iPhone 13 Pro Max"
              className="w-full h-64 object-cover rounded"
            />
          </div>
          {/* Miniaturas */}
          <div className="flex gap-2 mb-4">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className="p-1 border rounded hover:border-blue-500 transition-colors"
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
          <ul className="list-disc list-inside text-gray-700">
            <li><strong>Incluye:</strong> Forro y cargador original</li>
            <li>
              <strong>Especificaciones:</strong> Pantalla Super Retina XDR de 6.7", Chip A15 Bionic, sistema de triple cámara y demás detalles de fábrica.
            </li>
            <li><strong>Capacidad de batería:</strong>84%</li>
            <li>
              <strong>Observación:</strong> La aplicacion del modo cine solo funciona al x3.
            </li>
          </ul>
        </div>
      </Modal>
    </>
  );
};

export default ProductDetailsModal;
