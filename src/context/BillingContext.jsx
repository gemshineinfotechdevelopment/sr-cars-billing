import React, { createContext, useState, useEffect } from 'react';
import { 
  initialCustomers, 
  initialServices, 
  initialSpareParts, 
  initialInvoices, 
  initialSettings, 
  initialEmployees, 
  initialCustomerActivities 
} from '../data/mockData';

export const BillingContext = createContext();
export { useBilling } from './useBilling';

export function BillingProvider({ children }) {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sr_cars_theme') || 'white-gold';
  });

  // Active page tab: 'dashboard' | 'customers' | 'services' | 'parts' | 'invoices' | 'reports' | 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Customers state
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('sr_cars_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  // Services catalog
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('sr_cars_services');
    return saved ? JSON.parse(saved) : initialServices;
  });

  // Spare Parts Inventory
  const [spareParts, setSpareParts] = useState(() => {
    const saved = localStorage.getItem('sr_cars_spare_parts');
    return saved ? JSON.parse(saved) : initialSpareParts;
  });

  // Invoices & Billing
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('sr_cars_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  // Dealership & System Settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('sr_cars_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  // Employees & Team Management
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('sr_cars_employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  // Garage Activities Stream
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('sr_cars_activities');
    return saved ? JSON.parse(saved) : initialCustomerActivities;
  });

  // Modals & UI States
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceToEdit, setInvoiceToEdit] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sr_cars_theme', theme);
  }, [theme]);

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem('sr_cars_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('sr_cars_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('sr_cars_spare_parts', JSON.stringify(spareParts));
  }, [spareParts]);

  useEffect(() => {
    localStorage.setItem('sr_cars_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('sr_cars_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('sr_cars_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('sr_cars_activities', JSON.stringify(activities));
  }, [activities]);

  // Toast Notification System
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Currency Formatter
  const formatCurrency = (amount) => {
    const symbol = settings?.currency || '₹';
    const num = Number(amount) || 0;
    if (symbol === '₹') {
      return symbol + ' ' + num.toLocaleString('en-IN');
    }
    return symbol + ' ' + num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  // -------------------------
  // Customer Handlers
  // -------------------------
  const addCustomer = (customerData) => {
    const newCustomer = {
      ...customerData,
      id: customerData.id || `CUST-${String(customers.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
      vehicles: customerData.vehicles || []
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    showToast(`Customer "${newCustomer.name}" added successfully.`);
    return newCustomer;
  };

  const updateCustomer = (id, updatedData) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    );
    showToast('Customer record updated successfully.');
  };

  const deleteCustomer = (id) => {
    const target = customers.find((c) => c.id === id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    showToast(`Customer "${target?.name || id}" removed.`, 'info');
  };

  const addVehicleToCustomer = (customerId, vehicleData) => {
    const newVehicle = {
      ...vehicleData,
      id: vehicleData.id || `VEH-${Date.now().toString().slice(-4)}`
    };
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          return {
            ...c,
            vehicles: [...(c.vehicles || []), newVehicle]
          };
        }
        return c;
      })
    );
    showToast(`Vehicle ${newVehicle.vehicleNumber} added to customer.`);
    return newVehicle;
  };

  // -------------------------
  // Services Handlers
  // -------------------------
  const addService = (serviceData) => {
    const newService = {
      ...serviceData,
      id: serviceData.id || `SRV-${String(services.length + 1).padStart(3, '0')}`,
      price: Number(serviceData.price) || 0,
      gstPercentage: Number(serviceData.gstPercentage) || 18,
      status: serviceData.status || 'Active'
    };
    setServices((prev) => [newService, ...prev]);
    showToast(`Service "${newService.name}" created.`);
    return newService;
  };

  const updateService = (id, updatedData) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              ...updatedData,
              price: Number(updatedData.price ?? s.price),
              gstPercentage: Number(updatedData.gstPercentage ?? s.gstPercentage)
            }
          : s
      )
    );
    showToast('Service details updated.');
  };

  const deleteService = (id) => {
    const target = services.find((s) => s.id === id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    showToast(`Service "${target?.name || id}" deleted.`, 'info');
  };

  const toggleServiceStatus = (id) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s
      )
    );
    showToast('Service status changed.');
  };

  // -------------------------
  // Spare Parts Handlers
  // -------------------------
  const addSparePart = (partData) => {
    const newPart = {
      ...partData,
      id: partData.id || `PRT-${String(spareParts.length + 101)}`,
      purchasePrice: Number(partData.purchasePrice) || 0,
      sellingPrice: Number(partData.sellingPrice) || 0,
      availableQuantity: Number(partData.availableQuantity) || 0,
      minimumStockLevel: Number(partData.minimumStockLevel) || 5,
      gstPercentage: Number(partData.gstPercentage) || 18
    };
    setSpareParts((prev) => [newPart, ...prev]);
    showToast(`Spare part "${newPart.name}" added to inventory.`);
    return newPart;
  };

  const updateSparePart = (id, updatedData) => {
    setSpareParts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...updatedData,
              purchasePrice: Number(updatedData.purchasePrice ?? p.purchasePrice),
              sellingPrice: Number(updatedData.sellingPrice ?? p.sellingPrice),
              availableQuantity: Number(updatedData.availableQuantity ?? p.availableQuantity),
              minimumStockLevel: Number(updatedData.minimumStockLevel ?? p.minimumStockLevel),
              gstPercentage: Number(updatedData.gstPercentage ?? p.gstPercentage)
            }
          : p
      )
    );
    showToast('Spare part updated.');
  };

  const deleteSparePart = (id) => {
    const target = spareParts.find((p) => p.id === id);
    setSpareParts((prev) => prev.filter((p) => p.id !== id));
    showToast(`Spare part "${target?.name || id}" deleted.`, 'info');
  };

  // Stock In Functionality
  const stockIn = (partId, quantity, notes = '') => {
    const qtyToAdd = Number(quantity);
    if (!qtyToAdd || qtyToAdd <= 0) return;

    setSpareParts((prev) =>
      prev.map((p) =>
        p.id === partId
          ? { ...p, availableQuantity: p.availableQuantity + qtyToAdd }
          : p
      )
    );
    const target = spareParts.find((p) => p.id === partId);
    showToast(`Stock added: +${qtyToAdd} units for "${target?.name || partId}".`);
  };

  // Stock Out Functionality
  const stockOut = (partId, quantity, notes = '') => {
    const qtyToReduce = Number(quantity);
    if (!qtyToReduce || qtyToReduce <= 0) return;

    setSpareParts((prev) =>
      prev.map((p) =>
        p.id === partId
          ? { ...p, availableQuantity: Math.max(0, p.availableQuantity - qtyToReduce) }
          : p
      )
    );
    const target = spareParts.find((p) => p.id === partId);
    showToast(`Stock out: -${qtyToReduce} units for "${target?.name || partId}".`, 'info');
  };

  // -------------------------
  // Invoice Handlers & Inventory Sync
  // -------------------------
  const addInvoice = (invoiceData) => {
    const invCount = invoices.length + 1;
    const prefix = settings?.invoicePrefix || 'SRC-2026-';
    const autoNumber = invoiceData.invoiceNumber || `${prefix}${String(invCount).padStart(3, '0')}`;

    const newInvoice = {
      ...invoiceData,
      id: invoiceData.id || `inv-${Date.now()}`,
      invoiceNumber: autoNumber,
      totalAmount: invoiceData.grandTotal || invoiceData.totalAmount || 0,
      createdAt: new Date().toISOString()
    };

    // Update state:
    setInvoices((prev) => [newInvoice, ...prev]);

    // RULE: "When a spare part is added to an invoice, update inventory only after the invoice is confirmed."
    // Deduct stock for each spare part item used in this invoice!
    if (newInvoice.spareParts && newInvoice.spareParts.length > 0) {
      setSpareParts((prevParts) => {
        const partsCopy = [...prevParts];
        newInvoice.spareParts.forEach((usedPart) => {
          if (!usedPart.partId && !usedPart.id) return;
          const pIndex = partsCopy.findIndex(
            (p) => p.id === usedPart.partId || p.id === usedPart.id || p.partNumber === usedPart.partNumber
          );
          if (pIndex !== -1) {
            const deductQty = Number(usedPart.quantity) || 1;
            partsCopy[pIndex] = {
              ...partsCopy[pIndex],
              availableQuantity: Math.max(0, partsCopy[pIndex].availableQuantity - deductQty)
            };
          }
        });
        return partsCopy;
      });
    }

    // Add activity record
    const newActivity = {
      id: `ACT-${Date.now()}`,
      customerName: newInvoice.customer?.name || 'Customer',
      vehicle: `${newInvoice.vehicle?.brand || ''} ${newInvoice.vehicle?.model || ''} (${newInvoice.vehicle?.regNumber || ''})`.trim(),
      serviceSummary: newInvoice.services?.map((s) => s.name).join(', ') || 'Automotive Service',
      time: 'Just now',
      amount: newInvoice.grandTotal || 0,
      status: newInvoice.paymentStatus || newInvoice.status || 'Paid',
      advisor: 'Rahul Deshmukh'
    };
    setActivities((prev) => [newActivity, ...prev.slice(0, 19)]);

    showToast(`Invoice #${autoNumber} generated successfully! Inventory synchronized.`);
    return newInvoice;
  };

  const updateInvoice = (id, updatedData) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              ...updatedData,
              totalAmount: updatedData.grandTotal || updatedData.totalAmount || inv.totalAmount
            }
          : inv
      )
    );
    showToast(`Invoice updated successfully!`);
  };

  const deleteInvoice = (id) => {
    const target = invoices.find((inv) => inv.id === id);
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    showToast(`Invoice ${target ? '#' + target.invoiceNumber : id} deleted.`, 'info');
  };

  const markPayment = (id, amountPaid, paymentMethod = 'UPI', transactionId = '') => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          const grandTotal = inv.grandTotal || inv.totalAmount || 0;
          const totalPaid = Math.min(grandTotal, (inv.amountPaid || 0) + Number(amountPaid));
          const balance = Math.max(0, grandTotal - totalPaid);
          const paymentStatus = balance === 0 ? 'Paid' : 'Partial';

          return {
            ...inv,
            amountPaid: totalPaid,
            balanceAmount: balance,
            status: paymentStatus,
            paymentStatus,
            paymentMethod: paymentMethod || inv.paymentMethod,
            transactionId: transactionId || inv.transactionId || `PAY-${Date.now()}`
          };
        }
        return inv;
      })
    );
    showToast(`Payment recorded successfully!`);
  };

  // -------------------------
  // Settings & Employees
  // -------------------------
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('System & company settings updated successfully!');
  };

  const addEmployee = (empData) => {
    const newEmp = {
      ...empData,
      id: empData.id || `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      status: empData.status || 'Active'
    };
    setEmployees((prev) => [...prev, newEmp]);
    showToast(`Employee "${newEmp.name}" added.`);
  };

  const updateEmployee = (id, updatedData) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updatedData } : e))
    );
    showToast('Employee updated.');
  };

  const deleteEmployee = (id) => {
    const target = employees.find((e) => e.id === id);
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    showToast(`Employee ${target?.name || id} removed.`, 'info');
  };

  const resetToDefaults = () => {
    setCustomers(initialCustomers);
    setServices(initialServices);
    setSpareParts(initialSpareParts);
    setInvoices(initialInvoices);
    setSettings(initialSettings);
    setEmployees(initialEmployees);
    setActivities(initialCustomerActivities);

    localStorage.removeItem('sr_cars_customers');
    localStorage.removeItem('sr_cars_services');
    localStorage.removeItem('sr_cars_spare_parts');
    localStorage.removeItem('sr_cars_invoices');
    localStorage.removeItem('sr_cars_settings');
    localStorage.removeItem('sr_cars_employees');
    localStorage.removeItem('sr_cars_activities');

    showToast('Reset to default SR CARS automotive database.', 'info');
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'white-gold' ? 'ivory-gold' : 'white-gold'));
  };

  return (
    <BillingContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        
        // Data collections
        customers,
        services,
        spareParts,
        products: spareParts, // backwards compatibility alias
        invoices,
        settings,
        employees,
        activities,
        
        // Formatter
        formatCurrency,
        
        // Customer Handlers
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addVehicleToCustomer,
        
        // Service Handlers
        addService,
        updateService,
        deleteService,
        toggleServiceStatus,
        
        // Spare Parts Handlers
        addSparePart,
        updateSparePart,
        deleteSparePart,
        stockIn,
        stockOut,
        
        // Invoice Handlers
        addInvoice,
        updateInvoice,
        deleteInvoice,
        markPayment,
        
        // Settings & Employees
        updateSettings,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        resetToDefaults,
        
        // Modals & Notifications
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
