import React, { useState } from 'react';
import { BillingProvider } from './context/BillingContext';
import { useBilling } from './context/useBilling';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import ToastContainer from './components/common/ToastContainer';
import InvoiceModal from './components/invoices/InvoiceModal';
import InvoiceViewModal from './components/invoices/InvoiceViewModal';

// 7 Dedicated Application Pages
import Dashboard from './pages/Dashboard';
import CustomersPage from './pages/CustomersPage';
import ServicesPage from './pages/ServicesPage';
import ProductsPage from './pages/ProductsPage';
import InvoicesPage from './pages/InvoicesPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

import './App.css';

function MainApp() {
  const { activeTab, invoiceToEdit, isInvoiceModalOpen } = useBilling();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="main-content">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'customers' && <CustomersPage />}
          {activeTab === 'services' && <ServicesPage />}
          {(activeTab === 'products' || activeTab === 'parts') && <ProductsPage />}
          {activeTab === 'invoices' && <InvoicesPage />}
          {activeTab === 'reports' && <ReportsPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      {isInvoiceModalOpen && (
        <InvoiceModal key={invoiceToEdit ? invoiceToEdit.id : 'new-invoice'} />
      )}
      <InvoiceViewModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <BillingProvider>
      <MainApp />
    </BillingProvider>
  );
}
