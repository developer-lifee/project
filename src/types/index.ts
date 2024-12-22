export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string;
  numbers: string[];
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}