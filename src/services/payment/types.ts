export interface PaymentMethod {
  max: number;
  min: number;
}

export interface PaymentMethods {
  [key: string]: PaymentMethod;
}

export interface PaymentResponse {
  payload: {
    payment_methods?: { [key: string]: PaymentMethod };
    payment_link?: string;
    url?: string;
  };
  errors: string[];
}