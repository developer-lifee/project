import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Smartphone } from 'lucide-react';
import { getTakenNumbers } from '../services/api';
import { PAYMENT_CONFIG } from '../config/constants';
import Modal from './Modal';
import RegistrationForm from './RegistrationForm';
import PaymentButton from './PaymentButton';
import ProductDetailsModal from './ProductDetailsModal';
import type { CustomerData } from '../types';

const MAX_NUMBERS = 4;
const BACKEND_URL = "https://rifa.sheerit.com.co/datos.php"; // Updated backend URL

interface NumberSelectorProps {
  isAdmin?: boolean;
}

const NumberSelector: React.FC<NumberSelectorProps> = ({ isAdmin = false }) => {
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [takenNumbers, setTakenNumbers] = useState<string[]>([]);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTakenNumbers = async () => {
      try {
        const taken = await getTakenNumbers();
        setTakenNumbers(taken);
      } catch (error) {
        console.error('Error fetching taken numbers:', error);
      }
    };

    fetchTakenNumbers();
  }, []);

  const generateRandomNumbers = (): string[] => {
    const nums = new Set<string>();
    while (nums.size < MAX_NUMBERS) {
      const num = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      nums.add(num);
    }
    return Array.from(nums);
  };

  const handleAutoSelect = () => {
    setSelectedNumbers(generateRandomNumbers());
  };

  const handleNumberSelect = (number: string) => {
    if (selectedNumbers.length < MAX_NUMBERS && !selectedNumbers.includes(number) && !takenNumbers.includes(number)) {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const handleRemoveNumber = (number: string) => {
    setSelectedNumbers(selectedNumbers.filter((n) => n !== number));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputSubmit = () => {
    const numbers = inputValue
      .split(',')
      .map((n) => n.trim().padStart(3, '0'))
      .filter((n) => /^\d{3}$/.test(n) && parseInt(n) <= 999);

    const newNumbers = numbers.filter((n) => !selectedNumbers.includes(n) && !takenNumbers.includes(n));
    const availableSlots = MAX_NUMBERS - selectedNumbers.length;

    setSelectedNumbers([
      ...selectedNumbers,
      ...newNumbers.slice(0, availableSlots)
    ]);
    setInputValue('');
  };

  const handleRegistrationSubmit = async (customerData: CustomerData) => {
    if (isAdmin) {
      setIsProcessingPayment(true);
      try {
        const payload = { ...customerData, numbers: selectedNumbers };
        const response = await fetch(BACKEND_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || 'Error en la validación');
        }
        const waMsg = encodeURIComponent(
          `¡Estás participando con los números ${selectedNumbers.join(", ")} por un gran iPhone 13 Pro Max!` +
          `\n\nNombre: ${customerData.firstName} ${customerData.lastName}` +
          `\nEmail: ${customerData.email}` +
          `\nWhatsApp: ${customerData.whatsapp}`
        );
        // Changed WhatsApp URL format to the simple "send" endpoint
        const whatsappURL = `https://api.whatsapp.com/send?phone=${customerData.whatsapp}&text=${waMsg}`;
        window.location.href = whatsappURL;
      } catch (error: any) {
        setMessage("Error al registrar cliente: " + error.message);
        alert("Error al registrar cliente: " + error.message);
      } finally {
        setIsProcessingPayment(false);
      }
    } else {
      setIsProcessingPayment(true);
      try {
        sessionStorage.setItem('customerData', JSON.stringify(customerData));
        const response = await fetch(PAYMENT_CONFIG.API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: PAYMENT_CONFIG.PACKAGE_PRICE,
            currency: PAYMENT_CONFIG.CURRENCY,
            description: PAYMENT_CONFIG.DESCRIPTION,
            tax: "vat-19",
            numbers: selectedNumbers,
            customer: customerData
          }),
        });
        if (!response.ok) throw new Error('Error al obtener el token de pago');
        const data = await response.json();
        const waMsg = encodeURIComponent(
          `¡Estás participando con los números ${selectedNumbers.join(", ")} por un gran iPhone 13 Pro Max!` +
          `\n\nNombre: ${customerData.firstName} ${customerData.lastName}` +
          `\nEmail: ${customerData.email}` +
          `\nWhatsApp: ${customerData.whatsapp}`
        );
        // Payment data now includes the WhatsApp message (for reference in PaymentButton if needed)
        setPaymentData({ ...data, waMsg });
        setIsModalOpen(true);
      } catch (error) {
        console.error(error);
        alert(error instanceof Error ? error.message : 'Error al procesar la solicitud');
      } finally {
        setIsProcessingPayment(false);
      }
    }
  };

  const filteredNumbers = Array.from({ length: 1000 }, (_, i) =>
    i.toString().padStart(3, '0')
  ).filter(num => num.includes(searchTerm) && !takenNumbers.includes(num));

  return (
    <div className="max-w-4xl mx-auto p-4 pt-32">
      {/* Fixed header with improved layout */}
      <div className="fixed top-0 left-0 right-0 bg-white p-4 shadow-md z-40">
        {/* Detalles de la rifa button placed above search fields */}
        <div className="mb-2">
          <ProductDetailsModal />
        </div>
        {/* Search and input fields */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="w-full">
            <input
              type="text"
              placeholder="Buscar número..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="w-full flex gap-2">
            <input
              type="text"
              placeholder="Ingrese números separados por comas..."
              value={inputValue}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleInputSubmit}
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Agregar
            </button>
          </div>
        </div>
        {/* Buttons group below search fields */}
        <div className="flex justify-center mt-3 gap-4">
          <button
            onClick={handleAutoSelect}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"  // reduced size
          >
            Generar Suerte
          </button>
          {(isAdmin || selectedNumbers.length === MAX_NUMBERS) && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              {isAdmin ? 'Guardar datos' : 'Guardar y pagar rifa'}
            </button>
          )}
        </div>
      </div>

      {/* Existing content */}
      <div className="text-center mt-28 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          ¡Selecciona tus números de la suerte!
        </h1>
        <p className="text-gray-600">Selecciona 4 números para participar</p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          {selectedNumbers.map((number) => (
            <div
              key={number}
              className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full"
            >
              <span>{number}</span>
              <button
                onClick={() => handleRemoveNumber(number)}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {(isAdmin ? selectedNumbers.length > 0 : selectedNumbers.length === MAX_NUMBERS) && (
          <div className="text-center">
            {!isAdmin && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-lg font-semibold text-blue-800">
                  Total a pagar: ${PAYMENT_CONFIG.PACKAGE_PRICE.toLocaleString('es-CO')}
                </p>
                <p className="text-sm text-blue-600">
                  Paquete de {MAX_NUMBERS} números
                </p>
              </div>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors inline-flex items-center gap-2"
            >
              {isAdmin ? 'Guardar datos' : 'Guardar y pagar rifa'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {filteredNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handleNumberSelect(number)}
            disabled={selectedNumbers.includes(number) || selectedNumbers.length >= MAX_NUMBERS}
            className={`p-2 text-center rounded-lg transition-colors ${
              selectedNumbers.includes(number)
                ? 'bg-blue-500 text-white'
                : selectedNumbers.length >= MAX_NUMBERS
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            {number}
          </button>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {isAdmin ? (
          <RegistrationForm
            onSubmit={handleRegistrationSubmit}
            selectedNumbers={selectedNumbers}
            isSubmitting={isProcessingPayment}
            adminMode={true}
          />
        ) : (
          // In non-admin mode, when paymentData exists show only PaymentButton (no extra WhatsApp link)
          paymentData ? (
            <PaymentButton
              apiKey={paymentData.apiKey}
              orderId={paymentData.orderId}
              amount={paymentData.amount}
              currency={paymentData.currency}
              description={paymentData.description}
              tax={paymentData.tax}
              integritySignature={paymentData.integritySignature}
              redirectionUrl={paymentData.redirectionUrl}
            />
          ) : (
            <RegistrationForm
              onSubmit={handleRegistrationSubmit}
              selectedNumbers={selectedNumbers}
              isSubmitting={isProcessingPayment}
              adminMode={false}
            />
          )
        )}
      </Modal>
    </div>
  );
};

export default NumberSelector;