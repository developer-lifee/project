import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CustomerData } from '../types';

const schema = z.object({
  firstName: z.string().min(2, 'El nombre es requerido'),
  lastName: z.string().min(2, 'El apellido es requerido'),
  email: z.string().email('Email inválido'),
  whatsapp: z.string().min(10, 'Número de WhatsApp inválido'),
});

interface Props {
  onSubmit: (data: CustomerData) => void;
  selectedNumbers: string[];
  isSubmitting: boolean; // Add this line
}

const RegistrationForm: React.FC<Props> = ({ onSubmit, selectedNumbers, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerData>({
    resolver: zodResolver(schema),
  });

  const onFormSubmit = (data: Omit<CustomerData, 'numbers'>) => {
    onSubmit({ ...data, numbers: selectedNumbers });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Datos de Registro</h2>
        
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          {...register('firstName')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
        />
        {errors.firstName && (
          <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Apellido</label>
        <input
          {...register('lastName')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
        />
        {errors.lastName && (
          <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          {...register('email')}
          type="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
        <input
          {...register('whatsapp')}
          type="tel"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
        />
        {errors.whatsapp && (
          <p className="mt-1 text-sm text-red-600">{errors.whatsapp.message}</p>
        )}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="font-medium text-blue-800">Números seleccionados:</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedNumbers.map((number) => (
            <span key={number} className="bg-blue-100 px-3 py-1 rounded-full text-blue-800">
              {number}
            </span>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Continuar al Pago'}
      </button>
    </form>
  );
};

export default RegistrationForm;