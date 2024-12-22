import { Customer } from '../types';

const YOPMAIL_DOMAIN = 'yopmail.com';

export const createTemporaryEmail = (identifier: string): string => {
  return `${identifier}@${YOPMAIL_DOMAIN}`;
};

export const sendConfirmationEmail = async (customer: Customer, numbers: string[]): Promise<void> => {
  const tempEmail = createTemporaryEmail(`rifa_${Date.now()}`);
  
  console.log('Email confirmation details:', {
    to: customer.email,
    tempCopy: tempEmail,
    subject: '¡Confirmación de participación - iPhone 13 Pro Max!',
    numbers,
    customer
  });
  
  // In production, you would send this to your backend
  // For now, we'll just log the temporary email for testing
  console.log(`Check your confirmation at: https://yopmail.com/en/?login=${tempEmail}`);
};