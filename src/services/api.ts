import { CustomerData } from '../types';

export const saveCustomerData = async (data: CustomerData): Promise<void> => {
  try {
    const response = await fetch('https://rifa.sheerit.com.co/datos.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al guardar los datos');
    }
    
    const successData = await response.json();
    alert(successData.message);
  } catch (error) {
    console.error('Error saving customer data:', error);
    throw new Error((error as Error).message || 'No se pudieron guardar los datos. Por favor, intente nuevamente.');
  }
};

export const getTakenNumbers = async (): Promise<string[]> => {
  try {
    const response = await fetch('https://rifa.sheerit.com.co/numeros_tomados.php');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al obtener los números tomados');
    }
    const data = await response.json();
    return data.takenNumbers;
  } catch (error) {
    console.error('Error fetching taken numbers:', error);
    throw new Error((error as Error).message || 'No se pudieron obtener los números tomados. Por favor, intente nuevamente.');
  }
};

export async function savePurchase(customerData: any): Promise<void> {
  try {
    const response = await fetch('https://rifa.sheerit.com.co/procesar-pago.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    });
    if (!response.ok) {
      throw new Error('Error al registrar la compra');
    }
  } catch (error) {
    console.error('Error en savePurchase:', error);
  }
}