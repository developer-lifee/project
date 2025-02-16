import React, { useState, useEffect } from 'react';
import NumberSelector from './components/NumberSelector';
import ProductDetails from './components/ProductDetails'; // Use editable version in admin mode
import ProductDetailsModal from './components/ProductDetailsModal';
import AdminLogin from './components/AdminLogin';

function App() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  useEffect(() => {
    const adminFlag = localStorage.getItem("isAdmin");
    if (adminFlag === "true") {
      setIsAdmin(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Fixed button for Admin/Cliente */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => {
            if (isAdmin) {
              setIsAdmin(false);
              localStorage.removeItem("isAdmin");
            } else {
              setShowAdminLogin(true);
            }
          }}
          className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition-colors"
        >
          {isAdmin ? "Cliente" : "Admin"}
        </button>
      </div>

      {showAdminLogin && !isAdmin && (
        <AdminLogin onLogin={() => { setIsAdmin(true); setShowAdminLogin(false); }} />
      )}

      <div className="container mx-auto">
        {isAdmin ? (
          // Editable product details only for admin
          <ProductDetails isAdmin={true} />
        ) : (
          // Regular users see product details on demand via modal
          <ProductDetailsModal />
        )}
        <NumberSelector isAdmin={isAdmin} />
      </div>
    </div>
  );
}

export default App;