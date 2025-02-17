import React, { useState } from 'react';
import { saveCustomerData } from '../services/api';
import RegistrationForm from './RegistrationForm';

const ADMIN_PASSWORD = "admin123";
const BACKEND_URL = "https://rifa.sheerit.com.co/datos.php"; // Updated backend URL

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
      <h2 className="text-2xl font-bold mb-4 text-center">Registrar Cliente Directamente</h2>
      
      {/* Button to auto-select 4 numbers */}
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

      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
};

export default AdminPage;
