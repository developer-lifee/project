import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Smartphone } from 'lucide-react';
import { saveCustomerData, getTakenNumbers } from '../services/api';
import { PAYMENT_CONFIG } from '../config/constants';
import Modal from './Modal';
import RegistrationForm from './RegistrationForm';
import type { CustomerData } from '../types';

const MAX_NUMBERS = 4;

// Agrega la función para inicializar el script de Bold Checkout
const initBoldCheckout = () => {
    if (document.querySelector('script[src="https://checkout.bold.co/library/boldPaymentButton.js"]')) {
        console.warn('Bold Checkout script is already loaded.');
        return;
    }
    const js = document.createElement('script');
    js.onload = () => {
        window.dispatchEvent(new Event('boldCheckoutLoaded'));
    };
    js.onerror = () => {
        window.dispatchEvent(new Event('boldCheckoutLoadFailed'));
    };
    js.src = 'https://checkout.bold.co/library/boldPaymentButton.js';
    document.head.appendChild(js);
};

const NumberSelector: React.FC = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [takenNumbers, setTakenNumbers] = useState<string[]>([]);

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
    setIsProcessingPayment(true);
    try {
      await saveCustomerData(customerData);
      console.log("Datos del cliente guardados exitosamente");
      setIsModalOpen(false);
      sessionStorage.setItem('customerData', JSON.stringify(customerData));

      const paymentUrlResponse = await fetch('https://rifa.sheerit.com.co/generar_token.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: PAYMENT_CONFIG.PACKAGE_PRICE,
          currency: "COP",
          description: PAYMENT_CONFIG.DESCRIPTION,
          tax: "vat-19"
        })
      });

      if (!paymentUrlResponse.ok) {
        throw new Error('Error al obtener la URL de pago');
      }

      const paymentUrlData = await paymentUrlResponse.json();
      const { integritySignature, orderId, apiKey } = paymentUrlData || {};

      // Inicializar el script de Bold Checkout
      initBoldCheckout();

      const triggerCheckout = () => {
        const BoldCheckout = (window as any).BoldCheckout;
        if (!BoldCheckout) {
          console.error('BoldCheckout is not defined');
          return;
        }
        const checkout = new BoldCheckout({
          orderId,
          currency: 'COP',
          amount: PAYMENT_CONFIG.PACKAGE_PRICE,
          apiKey,
          integritySignature,
          description: PAYMENT_CONFIG.DESCRIPTION,
          tax: 'vat-19',
          redirectionUrl: 'https://rifa.sheerit.com.co/resultado'
        });
        checkout.open();
      };

      // Check immediately if BoldCheckout is available
      if ((window as any).BoldCheckout) {
        triggerCheckout();
      } else {
        // Si aún no está disponible, espera el evento
        window.addEventListener('boldCheckoutLoaded', triggerCheckout);
        window.addEventListener('boldCheckoutLoadFailed', () => {
          console.error('Failed to load Bold Checkout script');
          alert('Failed to load payment gateway. Please try again later.');
        });
      }

      console.log("Inicializando proceso de pago con BoldCheckout.");

    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Error al procesar la solicitud');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const filteredNumbers = Array.from({ length: 1000 }, (_, i) =>
    i.toString().padStart(3, '0')
  ).filter(num => num.includes(searchTerm) && !takenNumbers.includes(num));

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          ¡Selecciona tus números de la suerte!
        </h1>
        <p className="text-gray-600">Selecciona 4 números para participar</p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar número..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
            </div>
          </div>
          <div className="flex-1">
            <div className="relative flex gap-2">
              <input
                type="text"
                placeholder="Ingrese números separados por comas..."
                value={inputValue}
                onChange={handleInputChange}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleInputSubmit}
                title="Agregar números"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedNumbers.map((number) => (
            <div
              key={number}
              className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full"
            >
              <span>{number}</span>
              <button
                onClick={() => handleRemoveNumber(number)}
                title="Eliminar número"
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {selectedNumbers.length === MAX_NUMBERS && (
          <div className="text-center">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-lg font-semibold text-blue-800">
                Total a pagar: ${PAYMENT_CONFIG.PACKAGE_PRICE.toLocaleString('es-CO')}
              </p>
              <p className="text-sm text-blue-600">
                Paquete de {MAX_NUMBERS} números
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors inline-flex items-center gap-2"
            >
              <Smartphone className="h-5 w-5" />
              Continuar
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
        <RegistrationForm
          onSubmit={handleRegistrationSubmit}
          selectedNumbers={selectedNumbers}
          isSubmitting={isProcessingPayment}
        />
      </Modal>
    </div>
  );
};

export default NumberSelector;