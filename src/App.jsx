import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import ProductsPage from "./pages/ProductsPage";
import AddProductPage from "./pages/AddProductPage";

const AppLayout = () => {
  const [newProducts, setNewProducts] = useState([]);

  const handleProductAdded = (product) => {
    setNewProducts((prev) => [product, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<ProductsPage newProducts={newProducts} />} />
          <Route
            path="/add-product"
            element={
              <ProtectedRoute>
                <AddProductPage onProductAdded={handleProductAdded} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="border-t border-ink/10 py-6 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-display font-bold text-ink text-sm">
            Shop<span className="text-vermillion">Dip</span>
          </span>
          <span className="font-mono text-xs text-ink/30 uppercase tracking-widest">
            © by Ardiva Putri Tava (dipa)
          </span>
        </div>
      </footer>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
