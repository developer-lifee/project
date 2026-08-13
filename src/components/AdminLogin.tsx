import React, { useState } from 'react';
import Modal from './Modal';

interface AdminLoginProps {
  isOpen: boolean;
  onLogin: () => void;
  onClose: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onLogin, onClose }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      onLogin();
      onClose();
      setError("");
    } else {
      setError("Contraseña incorrecta");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4 text-center">Login Admin</h2>
      <form onSubmit={handleLogin}>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          autoFocus
        />
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Ingresar
        </button>
      </form>
    </Modal>
  );
};

export default AdminLogin;
