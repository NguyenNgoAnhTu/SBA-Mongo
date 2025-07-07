import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // Sửa: Dùng 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx';
import { Toaster } from 'react-hot-toast'; // Import Toaster ở đây

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <Toaster position="top-center" reverseOrder={false} /> {/* Đặt Toaster ở đây để dùng chung */}
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);