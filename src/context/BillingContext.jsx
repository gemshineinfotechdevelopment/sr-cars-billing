import React, { createContext, useState, useEffect } from 'react';
import { initialProducts, initialInvoices, initialSettings } from '../data/mockData';

export const BillingContext = createContext();
export { useBilling } from './useBilling';

export function BillingProvider({ children }) {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sr_cars_theme') || 'dark';
  });

  // Active page state: 'dashboard' | 'invoices' | 'products' | 'reports' | 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Invoices state
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('sr_cars_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  // Products & services catalog
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('sr_cars_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  // Settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('sr_cars_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  // Modals & UI States
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceToEdit, setInvoiceToEdit] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Sync theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sr_cars_theme', theme);
  }, [theme]);

  // Persist Invoices
  useEffect(() => {
    localStorage.setItem('sr_cars_invoices', JSON.stringify(invoices));
  }, [invoices]);

  // Persist Products
  useEffect(() => {
    localStorage.setItem('sr_cars_products', JSON.stringify(products));
  }, [products]);

  // Persist Settings
  useEffect(() => {
    localStorage.setItem('sr_cars_settings', JSON.stringify(settings));
  }, [settings]);

  // Toast Notification System
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Currency Formatter
  const formatCurrency = (amount) => {
    const symbol = settings.currency || '₹';
    const num = Number(amount) || 0;
    if (symbol === '₹') {
      return symbol + ' ' + num.toLocaleString('en-IN');
    }
    return symbol + ' ' + num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  // Invoice Handlers
  const addInvoice = (invoiceData) => {
    const newInvoice = {
      ...invoiceData,
      id: 'inv-' + Date.now(),
      invoiceNumber: invoiceData.invoiceNumber || `${settings.invoicePrefix}${String(invoices.length + 1).padStart(3, '0')}`
    };
    setInvoices([newInvoice, ...invoices]);
    showToast(`Invoice #${newInvoice.invoiceNumber} generated successfully!`);
    return newInvoice;
  };

  const updateInvoice = (id, updatedData) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, ...updatedData } : inv))
    );
    showToast(`Invoice updated successfully!`);
  };

  const deleteInvoice = (id) => {
    const target = invoices.find((inv) => inv.id === id);
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    showToast(`Invoice ${target ? '#' + target.invoiceNumber : ''} deleted.`, 'info');
  };

  const markAsPaid = (id) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: 'Paid', paidAt: new Date().toISOString().split('T')[0] } : inv
      )
    );
    showToast(`Invoice marked as Paid!`);
  };

  // Product Handlers
  const addProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: 'prod-' + Date.now(),
      price: Number(productData.price) || 0,
      cost: Number(productData.cost) || 0,
      stock: Number(productData.stock) || 0
    };
    setProducts([newProduct, ...products]);
    showToast(`"${newProduct.name}" added to catalog.`);
    return newProduct;
  };

  const updateProduct = (id, updatedData) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...updatedData,
              price: Number(updatedData.price ?? p.price),
              cost: Number(updatedData.cost ?? p.cost),
              stock: Number(updatedData.stock ?? p.stock)
            }
          : p
      )
    );
    showToast(`Product updated successfully!`);
  };

  const deleteProduct = (id) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(`"${target ? target.name : 'Item'}" removed from catalog.`, 'info');
  };

  // Settings Handlers
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Dealership settings saved successfully!');
  };

  const resetToDefaults = () => {
    setInvoices(initialInvoices);
    setProducts(initialProducts);
    setSettings(initialSettings);
    localStorage.removeItem('sr_cars_invoices');
    localStorage.removeItem('sr_cars_products');
    localStorage.removeItem('sr_cars_settings');
    showToast('Reset to default SR CARS luxury showroom data.', 'info');
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <BillingContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        invoices,
        products,
        settings,
        formatCurrency,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        markAsPaid,
        addProduct,
        updateProduct,
        deleteProduct,
        updateSettings,
        resetToDefaults,
        selectedInvoiceForView,
        setSelectedInvoiceForView,
        isInvoiceModalOpen,
        setIsInvoiceModalOpen,
        invoiceToEdit,
        setInvoiceToEdit,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </BillingContext.Provider>
  );
}
