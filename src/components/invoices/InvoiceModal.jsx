import React, { useState, useEffect } from 'react';
import { useBilling } from '../../context/useBilling';
import { 
  Plus, 
  Trash2, 
  Check, 
  ArrowLeft,
  Wrench,
  Package
} from 'lucide-react';

export default function InvoiceModal() {
  const { 
    isInvoiceModalOpen, 
    setIsInvoiceModalOpen, 
    invoiceToEdit, 
    customers, 
    services, 
    spareParts, 
    settings, 
    addInvoice, 
    updateInvoice, 
    setSelectedInvoiceForView, 
    formatCurrency 
  } = useBilling();

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Default state initialization
  const [formData, setFormData] = useState(() => {
    if (invoiceToEdit) {
      return {
        ...invoiceToEdit,
        services: invoiceToEdit.services || [],
        spareParts: invoiceToEdit.spareParts || []
      };
    }

    const autoNumber = `${settings?.invoicePrefix || 'SRC-2026-'}${String(Date.now()).slice(-3)}`;
    const autoJobCard = `JC-2026-${String(Date.now()).slice(-4)}`;

    return {
      invoiceNumber: autoNumber,
      date: todayStr,
      jobCardNumber: autoJobCard,
      invoiceType: 'Tax Invoice',

      customerId: '',
      customer: {
        name: '',
        phone: '',
        email: '',
        address: '',
        gstin: ''
      },

      vehicleId: '',
      vehicle: {
        regNumber: '',
        brand: '',
        model: '',
        odometer: ''
      },

      services: [
        {
          id: 'srv-' + Date.now(),
          serviceId: '',
          name: '',
          quantity: 1,
          rate: 0,
          amount: 0
        }
      ],

      spareParts: [],

      subtotal: 0,
      gst: 0,
      grandTotal: 0,

      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      amountPaid: 0,
      balanceAmount: 0,
      notes: ''
    };
  });

  const [activeServiceSuggest, setActiveServiceSuggest] = useState(null);
  const [activePartSuggest, setActivePartSuggest] = useState(null);

  // Automatically calculate totals
  useEffect(() => {
    let sSubtotal = 0;
    (formData.services || []).forEach((s) => {
      const q = Number(s.quantity) || 1;
      const r = Number(s.rate) || 0;
      sSubtotal += q * r;
    });

    let pSubtotal = 0;
    (formData.spareParts || []).forEach((p) => {
      const q = Number(p.quantity) || 1;
      const up = Number(p.unitPrice) || 0;
      pSubtotal += q * up;
    });

    const subtotal = sSubtotal + pSubtotal;
    const gst = Math.round(subtotal * 0.18);
    const grandTotal = subtotal + gst;

    setFormData((prev) => {
      const paid = grandTotal;
      const balance = 0;
      return {
        ...prev,
        serviceSubtotal: sSubtotal,
        sparePartsSubtotal: pSubtotal,
        grossTotal: subtotal,
        subtotal,
        taxableAmount: subtotal,
        cgst: Math.round(gst / 2),
        sgst: Math.round(gst / 2),
        gst,
        grandTotal,
        amountPaid: paid,
        balanceAmount: balance,
        status: 'Paid',
        paymentStatus: 'Paid'
      };
    });
  }, [formData.services, formData.spareParts]);

  // When customer is selected from dropdown
  const handleSelectCustomer = (e) => {
    const custId = e.target.value;
    if (!custId) {
      setFormData((prev) => ({
        ...prev,
        customerId: '',
        vehicleId: ''
      }));
      return;
    }

    const selectedCust = customers.find((c) => c.id === custId);
    if (!selectedCust) return;

    const firstVehicle = selectedCust.vehicles && selectedCust.vehicles.length > 0 ? selectedCust.vehicles[0] : null;

    setFormData((prev) => ({
      ...prev,
      customerId: selectedCust.id,
      customer: {
        name: selectedCust.name,
        phone: selectedCust.phone,
        email: selectedCust.email || '',
        address: selectedCust.address || '',
        gstin: selectedCust.gstin || ''
      },
      vehicleId: firstVehicle ? firstVehicle.id : '',
      vehicle: firstVehicle
        ? {
            regNumber: firstVehicle.vehicleNumber,
            brand: firstVehicle.brand || '',
            model: firstVehicle.model || '',
            odometer: firstVehicle.odometer || ''
          }
        : prev.vehicle
    }));
  };

  // Service Row Handlers
  const handleAddService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          id: 'srv-' + Date.now() + Math.random().toString().slice(-3),
          serviceId: '',
          name: '',
          quantity: 1,
          rate: 0,
          amount: 0
        }
      ]
    }));
  };

  const handleRemoveService = (index) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const handleServiceSelect = (index, srv) => {
    if (!srv) return;
    setFormData((prev) => {
      const next = [...prev.services];
      const rate = srv.price || 0;
      const q = Number(next[index]?.quantity) || 1;
      next[index] = {
        ...next[index],
        serviceId: srv.id,
        name: srv.name,
        rate,
        amount: q * rate
      };
      return { ...prev, services: next };
    });
  };

  const handleServiceChange = (index, field, value) => {
    setFormData((prev) => {
      const next = [...prev.services];
      const updated = { ...next[index], [field]: value };

      // When typing service name, automatically check for match in catalog
      if (field === 'name') {
        const query = value.trim().toLowerCase();
        const matched = services.find((s) => s.name.toLowerCase() === query);
        if (matched) {
          updated.serviceId = matched.id;
          updated.rate = matched.price || 0;
        } else {
          updated.serviceId = '';
        }
      }

      const q = Number(field === 'quantity' ? value : updated.quantity) || 1;
      const r = Number(field === 'rate' ? value : updated.rate) || 0;
      updated.amount = q * r;
      next[index] = updated;
      return { ...prev, services: next };
    });
  };

  // Spare Part Row Handlers
  const handleAddPart = () => {
    setFormData((prev) => ({
      ...prev,
      spareParts: [
        ...prev.spareParts,
        {
          id: 'part-' + Date.now() + Math.random().toString().slice(-3),
          partId: '',
          name: '',
          partNumber: '',
          quantity: 1,
          unitPrice: 0,
          amount: 0
        }
      ]
    }));
  };

  const handleRemovePart = (index) => {
    setFormData((prev) => ({
      ...prev,
      spareParts: prev.spareParts.filter((_, i) => i !== index)
    }));
  };

  const handlePartSelect = (index, part) => {
    if (!part) return;
    setFormData((prev) => {
      const next = [...prev.spareParts];
      const unitPrice = part.sellingPrice || 0;
      const q = Number(next[index]?.quantity) || 1;
      next[index] = {
        ...next[index],
        partId: part.id,
        name: part.name,
        partNumber: part.partNumber || '',
        unitPrice,
        amount: q * unitPrice
      };
      return { ...prev, spareParts: next };
    });
  };

  const handlePartChange = (index, field, value) => {
    setFormData((prev) => {
      const next = [...prev.spareParts];
      const updated = { ...next[index], [field]: value };

      // When typing part name, automatically check for match by name or partNumber
      if (field === 'name') {
        const query = value.trim().toLowerCase();
        const matched = spareParts.find(
          (p) =>
            p.name.toLowerCase() === query ||
            (p.partNumber && p.partNumber.toLowerCase() === query)
        );
        if (matched) {
          updated.partId = matched.id;
          updated.partNumber = matched.partNumber || '';
          updated.unitPrice = matched.sellingPrice || 0;
        } else {
          updated.partId = '';
          updated.partNumber = '';
        }
      }

      const q = Number(field === 'quantity' ? value : updated.quantity) || 1;
      const up = Number(field === 'unitPrice' ? value : updated.unitPrice) || 0;
      updated.amount = q * up;
      next[index] = updated;
      return { ...prev, spareParts: next };
    });
  };

  // Submit Handler
  const handleConfirmInvoice = (e) => {
    e.preventDefault();

    if (!formData.customer.name.trim()) {
      alert('Please enter Customer Name.');
      return;
    }
    if (!formData.customer.phone.trim()) {
      alert('Please enter Mobile Number.');
      return;
    }
    if (formData.customer.phone.trim().length !== 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.vehicle.regNumber.trim()) {
      alert('Please enter Vehicle Number (e.g. TS 09 EA 4589).');
      return;
    }

    if (formData.services.length === 0 && formData.spareParts.length === 0) {
      alert('Please add at least one service or spare part item.');
      return;
    }

    let finalizedInvoice;
    if (invoiceToEdit) {
      updateInvoice(invoiceToEdit.id, formData);
      finalizedInvoice = { ...formData, id: invoiceToEdit.id };
    } else {
      finalizedInvoice = addInvoice(formData);
    }

    setIsInvoiceModalOpen(false);
    setSelectedInvoiceForView(finalizedInvoice);
  };

  if (!isInvoiceModalOpen) return null;

  return (
    <div className="page-container" style={{ maxWidth: '1440px', padding: '24px 32px 64px' }}>
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '16px 24px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            type="button"
            onClick={() => setIsInvoiceModalOpen(false)}
            className="btn-outline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 700,
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Invoices</span>
          </button>

          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {invoiceToEdit ? `Edit Invoice #${formData.invoiceNumber}` : 'New Invoice'}
            </h1>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Invoice #{formData.invoiceNumber} • {formData.date}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setIsInvoiceModalOpen(false)}
            className="btn-outline"
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: '#ffffff'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="invoice-form"
            className="btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 20px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.84rem',
              fontWeight: 700,
              background: 'var(--gold-shimmer)',
              color: '#ffffff',
              border: 'none',
              boxShadow: 'var(--shadow-gold)',
              cursor: 'pointer'
            }}
          >
            <Check size={16} />
            <span>Save & Generate Invoice</span>
          </button>
        </div>
      </div>

      <form id="invoice-form" onSubmit={handleConfirmInvoice} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* 1. Customer & Vehicle Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '20px 24px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Customer & Vehicle Details
            </span>

            {customers.length > 0 && (
              <div style={{ minWidth: '260px' }}>
                <select
                  className="form-input"
                  value={formData.customerId}
                  onChange={handleSelectCustomer}
                  style={{ height: '36px', fontSize: '0.82rem', padding: '0 10px', backgroundColor: '#ffffff' }}
                >
                  <option value="">Quick select existing customer...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Customer Name *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. John Doe"
                value={formData.customer.name}
                onChange={(e) => setFormData({ ...formData, customer: { ...formData.customer, name: e.target.value } })}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Mobile Number *
              </label>
              <input
                type="tel"
                className="form-input"
                placeholder="e.g. 9876543210"
                value={formData.customer.phone}
                maxLength={10}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormData({
                    ...formData,
                    customer: { ...formData.customer, phone: cleaned }
                  });
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Email Address <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. john@example.com (optional)"
                value={formData.customer.email || ''}
                onChange={(e) => setFormData({ ...formData, customer: { ...formData.customer, email: e.target.value } })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Billing Address
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="City, Area, Address"
                value={formData.customer.address}
                onChange={(e) => setFormData({ ...formData, customer: { ...formData.customer, address: e.target.value } })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Vehicle Number *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. TS 09 EA 4589"
                value={formData.vehicle.regNumber}
                onChange={(e) => setFormData({ ...formData, vehicle: { ...formData.vehicle, regNumber: e.target.value.toUpperCase() } })}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Vehicle Model
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Mercedes-Benz E 220d"
                value={formData.vehicle.model}
                onChange={(e) => setFormData({ ...formData, vehicle: { ...formData.vehicle, model: e.target.value } })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Odometer Reading
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 34,500 km"
                value={formData.vehicle.odometer}
                onChange={(e) => setFormData({ ...formData, vehicle: { ...formData.vehicle, odometer: e.target.value } })}
              />
            </div>
          </div>
        </div>

        {/* 2. Services Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '20px 24px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wrench size={16} color="var(--gold-500)" />
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Services (Labor)
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddService}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-gold)',
                backgroundColor: 'var(--gold-100)',
                color: 'var(--gold-600)',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Plus size={14} />
              <span>Add Service</span>
            </button>
          </div>

          {formData.services.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              No services added. Click "Add Service" to add labor charges.
            </div>
          ) : (
            <div style={{ overflow: 'visible', position: 'relative' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Service Description</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', width: '140px' }}>Rate (₹)</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', width: '140px' }}>Amount (₹)</th>
                    <th style={{ padding: '8px 10px', width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.services.map((row, index) => {
                    const query = (row.name || '').toLowerCase().trim();
                    const matches = query.length >= 2
                      ? services.filter((s) =>
                          s.name.toLowerCase().includes(query) ||
                          (s.category && s.category.toLowerCase().includes(query))
                        ).slice(0, 8)
                      : [];

                    return (
                      <tr key={row.id || index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '8px 10px', position: 'relative', zIndex: activeServiceSuggest === index ? 50 : (formData.services.length - index) }}>
                          <div style={{ position: 'relative', width: '100%' }}>
                            <input
                              type="text"
                              className="form-input"
                              value={row.name}
                              onChange={(e) => {
                                const val = e.target.value;
                                handleServiceChange(index, 'name', val);
                                if (val.trim().length >= 2) {
                                  setActiveServiceSuggest(index);
                                } else {
                                  setActiveServiceSuggest(null);
                                }
                              }}
                              onFocus={() => {
                                if ((row.name || '').trim().length >= 2) {
                                  setActiveServiceSuggest(index);
                                }
                              }}
                              onBlur={() => setTimeout(() => setActiveServiceSuggest(null), 250)}
                              placeholder="Type service name (e.g. Wash, Alignment)..."
                              style={{ height: '36px', fontSize: '0.82rem', padding: '0 12px', width: '100%' }}
                            />

                            {activeServiceSuggest === index && query.length >= 2 && matches.length > 0 && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: 'calc(100% + 4px)',
                                  left: 0,
                                  right: 0,
                                  zIndex: 100,
                                  backgroundColor: '#ffffff',
                                  borderRadius: '8px',
                                  border: '1px solid var(--border-gold)',
                                  boxShadow: '0 10px 28px rgba(0,0,0,0.12)',
                                  maxHeight: '220px',
                                  overflowY: 'auto'
                                }}
                              >
                                {matches.map((s) => (
                                  <div
                                    key={s.id}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      handleServiceSelect(index, s);
                                      setActiveServiceSuggest(null);
                                    }}
                                    style={{
                                      padding: '9px 14px',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      borderBottom: '1px solid #f7f5ee',
                                      transition: 'background 0.15s ease'
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                                  >
                                    <div>
                                      <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-primary)' }}>{s.name}</div>
                                      {s.category && (
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.category}</div>
                                      )}
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--gold-600)', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                                      ₹{s.price?.toLocaleString('en-IN')}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>

                        <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                          <input
                            type="number"
                            className="form-input"
                            value={row.rate}
                            onChange={(e) => handleServiceChange(index, 'rate', e.target.value)}
                            min="0"
                            style={{ height: '36px', fontSize: '0.82rem', padding: '0 10px', textAlign: 'right' }}
                          />
                        </td>

                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {formatCurrency(row.amount)}
                        </td>

                        <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleRemoveService(index)}
                            style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 3. Spare Parts Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '20px 24px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={16} color="var(--gold-500)" />
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Spare Parts & Materials
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddPart}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-gold)',
                backgroundColor: 'var(--gold-100)',
                color: 'var(--gold-600)',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Plus size={14} />
              <span>Add Part</span>
            </button>
          </div>

          {formData.spareParts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              No spare parts added. Click "Add Part" to add parts or materials.
            </div>
          ) : (
            <div style={{ overflow: 'visible', position: 'relative' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Part Description</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', width: '90px' }}>Qty</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', width: '130px' }}>Price (₹)</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', width: '130px' }}>Amount (₹)</th>
                    <th style={{ padding: '8px 10px', width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.spareParts.map((row, index) => {
                    const matchedPart = spareParts.find((p) => p.id === row.partId || p.name.toLowerCase() === (row.name || '').trim().toLowerCase());
                    const query = (row.name || '').toLowerCase().trim();
                    const matches = query.length >= 2
                      ? spareParts.filter((p) =>
                          p.name.toLowerCase().includes(query) ||
                          (p.partNumber && p.partNumber.toLowerCase().includes(query)) ||
                          (p.brand && p.brand.toLowerCase().includes(query))
                        ).slice(0, 8)
                      : [];

                    return (
                      <tr key={row.id || index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '8px 10px', position: 'relative', zIndex: activePartSuggest === index ? 50 : (formData.spareParts.length - index) }}>
                          <div style={{ position: 'relative', width: '100%' }}>
                            <input
                              type="text"
                              className="form-input"
                              value={row.name}
                              onChange={(e) => {
                                const val = e.target.value;
                                handlePartChange(index, 'name', val);
                                if (val.trim().length >= 2) {
                                  setActivePartSuggest(index);
                                } else {
                                  setActivePartSuggest(null);
                                }
                              }}
                              onFocus={() => {
                                if ((row.name || '').trim().length >= 2) {
                                  setActivePartSuggest(index);
                                }
                              }}
                              onBlur={() => setTimeout(() => setActivePartSuggest(null), 250)}
                              placeholder="Type part name (e.g. Oil, Filter, Brake)..."
                              style={{ height: '36px', fontSize: '0.82rem', padding: '0 12px', width: '100%' }}
                            />

                            {activePartSuggest === index && query.length >= 2 && matches.length > 0 && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: 'calc(100% + 4px)',
                                  left: 0,
                                  right: 0,
                                  zIndex: 100,
                                  backgroundColor: '#ffffff',
                                  borderRadius: '8px',
                                  border: '1px solid var(--border-gold)',
                                  boxShadow: '0 10px 28px rgba(0,0,0,0.12)',
                                  maxHeight: '220px',
                                  overflowY: 'auto'
                                }}
                              >
                                {matches.map((p) => (
                                  <div
                                    key={p.id}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      handlePartSelect(index, p);
                                      setActivePartSuggest(null);
                                    }}
                                    style={{
                                      padding: '9px 14px',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      borderBottom: '1px solid #f7f5ee',
                                      transition: 'background 0.15s ease'
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                                  >
                                    <div>
                                      <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-primary)' }}>{p.name}</div>
                                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                        {p.brand} {p.partNumber ? `• ${p.partNumber}` : ''} • Stock: {p.availableQuantity}
                                      </div>
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--gold-600)', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                                      ₹{p.sellingPrice?.toLocaleString('en-IN')}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {matchedPart && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '0.72rem' }}>
                                {matchedPart.partNumber && (
                                  <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                    #{matchedPart.partNumber}
                                  </span>
                                )}
                                <span style={{ color: matchedPart.availableQuantity <= 5 ? '#dc2626' : '#059669', fontWeight: 600 }}>
                                  • Available Stock: {matchedPart.availableQuantity} units
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                          <input
                            type="number"
                            className="form-input"
                            value={row.quantity}
                            onChange={(e) => handlePartChange(index, 'quantity', e.target.value)}
                            min="1"
                            style={{ height: '36px', fontSize: '0.82rem', padding: '0 10px', textAlign: 'center' }}
                          />
                        </td>

                        <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                          <input
                            type="number"
                            className="form-input"
                            value={row.unitPrice}
                            onChange={(e) => handlePartChange(index, 'unitPrice', e.target.value)}
                            min="0"
                            style={{ height: '36px', fontSize: '0.82rem', padding: '0 10px', textAlign: 'right' }}
                          />
                        </td>

                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {formatCurrency(row.amount)}
                        </td>

                        <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleRemovePart(index)}
                            style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 4. Payment & Totals Summary */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '20px 24px',
            boxShadow: 'var(--shadow-sm)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'center'
          }}
        >
          {/* Payment Options */}
          <div style={{ minWidth: '240px' }}>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Payment Method
            </label>
            <select
              className="form-input"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              style={{ height: '38px', fontSize: '0.84rem' }}
            >
              <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
              <option value="Card">Card</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          {/* Totals & Submit */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', gap: '20px', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              <span>Subtotal: <strong>{formatCurrency(formData.subtotal)}</strong></span>
              <span>GST (18%): <strong>{formatCurrency(formData.gst)}</strong></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Grand Total:</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--gold-600)' }}>
                {formatCurrency(formData.grandTotal)}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setIsInvoiceModalOpen(false)}
                className="btn-outline"
                style={{ padding: '10px 20px', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 26px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--gold-shimmer)',
                  color: '#ffffff',
                  border: 'none',
                  boxShadow: 'var(--shadow-gold)',
                  cursor: 'pointer'
                }}
              >
                <Check size={18} />
                <span>Save & Generate Invoice</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
