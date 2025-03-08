import React, { useState } from 'react';
import Modal from './Modal';

interface AdminLoginProps {
  isOpen: boolean;nal to required
  onLogin: () => void;
  onClose: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onLogin, onClose }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();ge.setItem("isAdmin", "true");
    if (password === "admin123") {
      localStorage.setItem("isAdmin", "true"); Always close the modal after successful login
      onLogin();
      onClose();
      setError("");
    } else {
      setError("Contraseña incorrecta");
    }
  };propagation to prevent closing when clicking inside the form

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4 text-center">Login Admin</h2>
      <form onSubmit={handleLogin}>
        <input
          type="password"ssName="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
          placeholder="Contraseña"Close} // Close when clicking the backdrop
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"p-6 rounded shadow max-w-sm w-full"
          autoFocus{handleContentClick}
        />
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <button
          type="submit" hover:text-gray-700 text-2xl font-bold focus:outline-none"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Ingresar
        </button>
      </form>xt-xl font-bold mb-4 text-center">Login Admin</h2>
    </Modal>
  );input
};ssword"
lder="Contraseña"
export default AdminLogin;ue={password}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
