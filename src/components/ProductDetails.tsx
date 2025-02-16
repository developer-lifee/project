import React, { useState } from 'react';

interface ProductDetailsProps {
  isAdmin: boolean;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ isAdmin }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [details, setDetails] = useState({
    title: "iPhone 13 Pro Max",
    includes: "Forro y cargador original",
    specifications: `Pantalla Super Retina XDR de 6.7", Chip A15 Bionic, sistema de triple cámara y demás detalles de fábrica.`,
    battery: "84%",
    observation: "La cámara presenta reemplazo o golpes que afectan cierto modo.",
    images: [
      '/images/iphone13promax1.jpg',
      '/images/iphone13promax2.jpg',
      '/images/iphone13promax3.jpg',
      '/images/iphone13promax4.jpg',
    ]
  });
  const [selectedImage, setSelectedImage] = useState<string>(details.images[0]);

  const handleInputChange = (field: string, value: string) => {
    setDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...details.images];
    newImages[index] = value;
    setDetails(prev => ({ ...prev, images: newImages }));
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg bg-white mb-8 relative">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isEditing ? (
          <input
            type="text"
            value={details.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="border rounded p-1 text-center"
          />
        ) : details.title}
      </h2>
      
      {isAdmin && (
        <div className="absolute top-2 right-2">
          {isEditing ? (
            <button 
              onClick={() => setIsEditing(false)}
              className="bg-green-500 text-white px-2 py-1 rounded text-sm"
            >
              Guardar
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
            >
              Editar
            </button>
          )}
        </div>
      )}

      {/* Imagen principal */}
      <div className="mb-4">
        {isEditing ? (
          <input
            type="text"
            value={selectedImage}
            onChange={(e) => setSelectedImage(e.target.value)}
            className="w-full p-2 border rounded"
          />
        ) : (
          <img
            src={selectedImage}
            alt="Imagen principal"
            className="w-full h-48 object-cover rounded"
          />
        )}
      </div>
      
      {/* Miniaturas */}
      <div className="flex gap-2 mb-4 justify-center">
        {details.images.map((img, index) => (
          <div key={index} className="flex flex-col items-center">
            {isEditing ? (
              <input
                type="text"
                value={img}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="w-20 p-1 border rounded mb-1"
              />
            ) : (
              <button
                onClick={() => setSelectedImage(img)}
                className={`p-1 border rounded transition-colors ${selectedImage === img ? 'border-blue-500' : 'border-gray-300'}`}
              >
                <img
                  src={img}
                  alt={`Miniatura ${index + 1}`}
                  className="w-16 h-16 object-cover rounded"
                />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Detalles del producto */}
      {isEditing ? (
        <div className="text-gray-700 space-y-2">
          <div>
            <label className="font-bold">Incluye:</label>
            <input
              type="text"
              value={details.includes}
              onChange={(e) => handleInputChange("includes", e.target.value)}
              className="w-full p-1 border rounded"
            />
          </div>
          <div>
            <label className="font-bold">Especificaciones:</label>
            <textarea
              value={details.specifications}
              onChange={(e) => handleInputChange("specifications", e.target.value)}
              className="w-full p-1 border rounded"
            />
          </div>
          <div>
            <label className="font-bold">Capacidad de batería:</label>
            <input
              type="text"
              value={details.battery}
              onChange={(e) => handleInputChange("battery", e.target.value)}
              className="w-full p-1 border rounded"
            />
          </div>
          <div>
            <label className="font-bold">Observación:</label>
            <input
              type="text"
              value={details.observation}
              onChange={(e) => handleInputChange("observation", e.target.value)}
              className="w-full p-1 border rounded"
            />
          </div>
        </div>
      ) : (
        <div className="text-gray-700">
          <ul className="list-disc list-inside mb-4">
            <li><strong>Incluye:</strong> {details.includes}</li>
            <li>
              <strong>Especificaciones:</strong> {details.specifications}
            </li>
            <li><strong>Capacidad de batería:</strong> {details.battery}</li>
            <li>
              <strong>Observación:</strong> {details.observation}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
