import { Customer } from '../types';

// Simulated email service for browser environment
export const sendConfirmationEmail = async (customer: Customer, numbers: string[]): Promise<boolean> => {
  // In a real production environment, you would:
  // 1. Call your backend API endpoint to handle email sending
  // 2. The backend would use nodemailer or another email service
  
  console.log('Email would be sent with following details:', {
    to: customer.email,
    subject: '¡Confirmación de participación - iPhone 13 Pro Max!',
    numbers,
    customer
  });

  // For demo purposes, we'll simulate a successful email send
  return true;
};