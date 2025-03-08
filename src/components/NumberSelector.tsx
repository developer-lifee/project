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

  // Add this function to handle direct payment without showing the registration form again
  const handleDirectPayment = () => {
    // Check if customer data is already available in sessionStorage
    const storedCustomerData = sessionStorage.getItem('customerData');
    if (storedCustomerData) {
      // If we have customer data and payment data, go directly to payment
      if (paymentData) {
        const checkout = new (window as any).BoldCheckout({
          orderId: paymentData.orderId,
          currency: paymentData.currency,
          amount: paymentData.amount,
          apiKey: paymentData.apiKey,
          integritySignature: paymentData.integritySignature,
          description: paymentData.description,
          tax: paymentData.tax,
          redirectionUrl: paymentData.redirectionUrl,
        });
        checkout.open();
      } else {
        // We have customer data but need to get payment data
        setIsModalOpen(true);
      }
    } else {
      // No customer data, show registration form
      setIsModalOpen(true);
    }
  };

  const filteredNumbers = Array.from({ length: 1000 }, (_, i) =>
    i.toString().padStart(3, '0')
  ).filter(num => num.includes(searchTerm) && !takenNumbers.includes(num));

  return (
    <div className="max-w-4xl mx-auto p-4 pt-32">
      {/* Fixed header with improved layout and luxury theme */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-b from-purple-900 to-purple-800 p-4 shadow-lg z-40">
        {/* Detalles de la rifa button at the very top */}
        <div className="mb-2 text-center">
          <ProductDetailsModal />
        </div>
        
        {/* Title with enhanced styling */}
        <div className="text-center mb-3">
          <h1 className="text-2xl font-bold text-yellow-400">
            ¡Selecciona tus números de la suerte!
          </h1>
          <p className="text-yellow-200 text-sm">Selecciona 4 números para participar</p>
        </div>
        
        {/* Search and input fields with improved styling */}
        <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
          <div className="w-full">
            <input
              type="text"
              placeholder="Buscar número..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border-2 border-yellow-300 rounded bg-purple-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div className="w-full flex gap-2">
            <input
              type="text"
              placeholder="Ingrese números separados por comas..."
              value={inputValue}
              onChange={handleInputChange}
              className="w-full p-2 border-2 border-yellow-300 rounded bg-purple-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={handleInputSubmit}
              className="bg-yellow-500 text-purple-900 font-semibold px-3 py-2 rounded hover:bg-yellow-400 transition-colors"
            >
              Agregar
            </button>
          </div>
        </div>
        
        {/* Generate button with luxury styling */}
        <div className="text-center mb-4">
          <button
            onClick={handleAutoSelect}
            className="bg-yellow-500 text-purple-900 font-bold px-6 py-2 rounded-full shadow-lg hover:bg-yellow-400 transition-colors transform hover:scale-105"
          >
            Generar Suerte
          </button>
        </div>

        {/* Selected numbers preview below Generate button */}
        {selectedNumbers.length > 0 && (
          <div className="bg-purple-700 p-3 rounded-lg mb-3">
            <p className="text-center text-yellow-200 mb-2">Tus números seleccionados:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {selectedNumbers.map((number) => (
                <div
                  key={number}
                  className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full"
                >
                  <span className="text-purple-900 font-semibold">{number}</span>
                  <button
                    onClick={() => handleRemoveNumber(number)}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Payment information when all numbers selected - updated styling */}
        {!isAdmin && selectedNumbers.length === MAX_NUMBERS && (
          <div className="bg-purple-700 p-3 rounded-lg mb-3 text-center shadow-md border border-yellow-300">
            <p className="font-bold text-yellow-300 text-lg">
              Total a pagar: ${PAYMENT_CONFIG.PACKAGE_PRICE.toLocaleString('es-CO')}
            </p>
            <button
              onClick={handleDirectPayment}
              className="bg-yellow-500 text-purple-900 font-bold px-6 py-2 mt-2 rounded-full hover:bg-yellow-400 transition-colors shadow-md transform hover:scale-105"
            >
              Guardar y pagar rifa
            </button>
          </div>
        )}
        
        {/* Admin save button if applicable */}
        {isAdmin && selectedNumbers.length > 0 && (
          <div className="text-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-500 text-white font-bold px-6 py-2 rounded-full hover:bg-green-600 transition-colors shadow-md"
            >
              Guardar datos
            </button>
          </div>
        )}
      </div>

      {/* Main content area with luxury-themed colors */}
      <div className="mt-64 mb-8"></div> {/* Increased margin for the new larger header */}

      <div className="mb-6 space-y-4"></div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {filteredNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handleNumberSelect(number)}
            disabled={selectedNumbers.includes(number) || selectedNumbers.length >= MAX_NUMBERS}
            className={`p-2 text-center rounded-lg transition-colors shadow ${
              selectedNumbers.includes(number)
                ? 'bg-yellow-400 text-purple-900 font-bold'
                : selectedNumbers.length >= MAX_NUMBERS
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-purple-100 hover:bg-yellow-200 text-purple-900 hover:shadow-md'
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
          // In non-admin mode, when paymentData exists show PaymentButton directly
          paymentData ? (
            <div className="text-center">
              <h2 className="text-xl font-bold mb-4">Realizar pago</h2>
              <p className="mb-4">Estás a un paso de participar con los números: {selectedNumbers.join(", ")}</p>
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
            </div>
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