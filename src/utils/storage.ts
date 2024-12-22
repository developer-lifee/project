import { Purchase } from '../types';

const STORAGE_KEY = 'lottery_purchases';

export const getPurchases = (): Purchase[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const savePurchase = (purchase: Purchase): void => {
  const purchases = getPurchases();
  purchases.push(purchase);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(purchases));
};

export const isNumberTaken = (number: string): boolean => {
  const purchases = getPurchases();
  return purchases.some(purchase => purchase.numbers.includes(number));
};