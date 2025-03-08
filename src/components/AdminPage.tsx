import React, { useState, useRef } from 'react';
import { saveCustomerData } from '../services/api';
import RegistrationForm from './RegistrationForm';

const ADMIN_PASSWORD = "admin123";
const BACKEND_URL = "https://rifa.sheerit.com.co/datos.php";
const IMAGE_UPLOAD_URL = "https://rifa.sheerit.com.co/upload.php"; // Add your PHP upload endpoint

// Generate 4 random numbers in "000" format
const generateRandomNumbers = (): string[] => {
  const numbers = new Set<string>();
  while (numbers.size < 4) {
    const num = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    numbers.add(num);
  }
  return Array.from(numbers);
};

const AdminPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Image upload states
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [imageNames] = useState([
    "iphone13promax1.jpg",
    "iphone13promax2.jpg", 
    "iphone13promax3.jpg", 
    "iphone13promax4.jpg"
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setMessage("");
    } else {
      setMessage("Contraseña incorrecta");
    }
  };

  const handleAutoSelect = () => {
    setSelectedNumbers(generateRandomNumbers());
  };

  const handleRegistrationSubmit = async (customerData: any) => {
    setIsSubmitting(true);
    try {
      // Prepare data payload
      const payload = {
        ...customerData,
        numbers: selectedNumbers,
      };
      // Validate and save via your backend
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Error en la validación');
      }
      // On success, build the WhatsApp message
      const message = encodeURIComponent(
        `¡Estás participando con los números ${selectedNumbers.join(
          ", "
        )} por un gran iPhone 13 Pro Max!` +
        `\n\nNombre: ${customerData.firstName} ${customerData.lastName}` +
        `\nEmail: ${customerData.email}` +
        `\nWhatsApp: ${customerData.whatsapp}`
      );
      // Replace <YOUR_WHATSAPP_NUMBER> with the actual number
      const whatsappURL = `https://wa.me/<YOUR_WHATSAPP_NUMBER>?text=${message}`;
      window.location.href = whatsappURL;
    } catch (error: any) {
      setMessage("Error al registrar cliente: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Convert FileList to array for easier manipulation
      const fileArray = Array.from(e.target.files);
      setSelectedFiles(fileArray);
    }
  };

  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) {
      setUploadStatus("Por favor selecciona archivos para subir");
      return;
    }

    setUploadStatus("Subiendo archivos...");
    setIsSubmitting(true);

    try {
      const uploadPromises = selectedFiles.map((file, index) => {
        // Create a FormData object for each file
        const formData = new FormData();
        // Use predefined names instead of original file names
        const targetFileName = index < imageNames.length ? imageNames[index] : file.name;
        formData.append("uploadedFile", file, targetFileName);
        
        // Send the file to the PHP backend
        return fetch(IMAGE_UPLOAD_URL, {
          method: "POST",
          body: formData,
        }).then((response) => {
          if (!response.ok) {
            throw new Error(`Error uploading ${targetFileName}`);
          }
          return response.json();
        });
      });

      const results = await Promise.all(uploadPromises);
      setUploadStatus("Archivos subidos exitosamente");
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadStatus(`Error al subir archivos: ${error instanceof Error ? error.message : "Error desconocido"}`);
    } finally {
      setIsSubmitting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto bg-white p-4 rounded shadow my-8">
        <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700">Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
          >
            Ingresar
          </button>
        </form>
        {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow my-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Panel Administrador</h2>
      
      {/* Image Upload Section */}
      <div className="mb-8 p-4 border rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Gestionar Imágenes del Producto</h3>
        
        <p className="mb-2 text-sm text-gray-600">
          Las imágenes se guardarán con los nombres siguientes en la carpeta 'public': 
          {imageNames.join(", ")}
        </p>
        
        <div className="mb-4">
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            ref={fileInputRef}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-50 file:text-purple-700
              hover:file:bg-purple-100
            "
          />
          <p className="mt-1 text-sm text-gray-500">
            Selecciona hasta 4 imágenes (.jpg, .png)
          </p>
        </div>
        
        {selectedFiles.length > 0 && (
          <div className="mb-4">
            <p>Archivos seleccionados ({selectedFiles.length}):</p>
            <ul className="list-disc list-inside text-sm">
              {selectedFiles.map((file, index) => (
                <li key={index}>
                  {file.name} - {(file.size / 1024).toFixed(2)} KB → se subirá como {index < imageNames.length ? imageNames[index] : file.name}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <button
          onClick={handleImageUpload}
          disabled={isSubmitting || selectedFiles.length === 0}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Subiendo..." : "Subir imágenes"}
        </button>
        
        {uploadStatus && (
          <p className={`mt-2 text-sm ${uploadStatus.includes("Error") ? "text-red-500" : "text-green-500"}`}>
            {uploadStatus}
          </p>
        )}
      </div>
      
      {/* Existing customer registration section */}
      <div className="p-4 border rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Registrar Cliente Directamente</h3>
        
        <div className="text-center mb-4">
          <button
            onClick={handleAutoSelect}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Generar Suerte
          </button>
          {selectedNumbers.length > 0 && (
            <p className="mt-2">Números: {selectedNumbers.join(", ")}</p>
          )}
        </div>

        <RegistrationForm
          onSubmit={handleRegistrationSubmit}
          selectedNumbers={selectedNumbers}
          isSubmitting={isSubmitting}
          adminMode={true}
        />
      </div>

      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
};

export default AdminPage;
