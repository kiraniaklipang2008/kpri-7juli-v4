
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize sample data
import { initSampleProdukData } from '@/services/produk';
import { initSamplePenjualanData } from '@/services/penjualan';

// Initialize app with proper error boundaries
const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

// Initialize sample POS data on app startup
initSampleProdukData();
initSamplePenjualanData();

const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
