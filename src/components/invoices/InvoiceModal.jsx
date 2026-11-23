import React, { useState, useEffect } from 'react';
import { useBilling } from '../../context/useBilling';
import { 
  X, 
  Plus, 
  Trash2, 
  User, 
  Car, 
  ReceiptText, 
  Wrench, 
  Package, 
  CreditCard, 
  Check, 
  Calculator
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
      // Section A: Invoice Information
      invoiceNumber: autoNumber,
      date: todayStr,
      jobCardNumber: autoJobCard,
      invoiceType: 'Tax Invoice',

      // Section B: Customer Information
      customerId: '',
      customer: {
        name: '',
        phone: '',
        email: '',
        address: '',
        gstin: ''
      },

      // Section C: Vehicle Information
      vehicleId: '',
      vehicle: {
        regNumber: '',
        brand: '',
        model: '',
        odometer: ''
      },

      // Section D: Service Details
      services: [
        {
          id: 'srv-' + Date.now(),
          serviceId: '',
          name: 'General Service',
          quantity: 1,
          rate: 4800,
          discount: 0,
          gst: 18,
          amount: 5664
        }
      ],

      // Section E: Spare Parts Details
      spareParts: [
        {
          id: 'part-' + Date.now(),
          partId: '',
          name: 'Fully Synthetic Engine Oil 5W-40 (4L)',
          partNumber: 'CAS-EDG-5W40-4L',
          quantity: 1,
          unitPrice: 4200,
          discount: 0,
          gst: 18,
          amount: 4956
        }
      ],

      // Section F: Billing Summary
      serviceSubtotal: 0,
      sparePartsSubtotal: 0,
      grossTotal: 0,
      discountAmount: 0,
      taxableAmount: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      roundOff: 0,
      grandTotal: 0,

      // Section G: Payment Details
      paymentMethod: 'UPI',
      amountPaid: 0,
      balanceAmount: 0,
      paymentStatus: 'Paid',
      transactionId: '',
      notes: settings?.notes || 'Thank you for choosing SR CARS. Precision engineering & warranty assured.'
    };
  });

  // When customer is selected from dropdown, populate info & available vehicles
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
            brand: firstVehicle.brand,
            model: firstVehicle.model,
            odometer: firstVehicle.odometer || ''
          }
        : { regNumber: '', brand: '', model: '', odometer: '' }
    }));
  };

  // When vehicle is selected
  const handleSelectVehicle = (e) => {
    const vehId = e.target.value;
    const currentCust = customers.find((c) => c.id === formData.customerId);
    const targetVeh = currentCust?.vehicles?.find((v) => v.id === vehId);

    if (targetVeh) {
      setFormData((prev) => ({
        ...prev,
        vehicleId: targetVeh.id,
        vehicle: {
          regNumber: targetVeh.vehicleNumber,
          brand: targetVeh.brand,
          model: targetVeh.model,
          odometer: targetVeh.odometer || ''
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        vehicleId: vehId
      }));
    }
  };

  // Section D: Service Handlers
  const handleAddServiceRow = () => {
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
          discount: 0,
          gst: 18,
          amount: 0
        }
      ]
    }));
  };

  const handleRemoveServiceRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const handleServiceSelect = (index, srvId) => {
    const srv = services.find((s) => s.id === srvId);
    if (!srv) return;

    setFormData((prev) => {
      const nextServices = [...prev.services];
      const qty = nextServices[index].quantity || 1;
      const rate = srv.price || 0;
      const discount = nextServices[index].discount || 0;
      const gst = srv.gstPercentage || 18;
      const discountedVal = Math.max(0, qty * rate - discount);
      const amount = Math.round(discountedVal * (1 + gst / 100));

      nextServices[index] = {
        ...nextServices[index],
        serviceId: srv.id,
        name: srv.name,
        rate,
        gst,
        amount
      };
      return { ...prev, services: nextServices };
    });
  };

  const handleServiceFieldChange = (index, field, value) => {
    setFormData((prev) => {
      const nextServices = [...prev.services];
      const updatedRow = { ...nextServices[index], [field]: value };
      const qty = Number(field === 'quantity' ? value : updatedRow.quantity) || 1;
      const rate = Number(field === 'rate' ? value : updatedRow.rate) || 0;
      const discount = Number(field === 'discount' ? value : updatedRow.discount) || 0;
      const gst = Number(field === 'gst' ? value : updatedRow.gst) || 18;

      const discountedVal = Math.max(0, qty * rate - discount);
      updatedRow.amount = Math.round(discountedVal * (1 + gst / 100));
      nextServices[index] = updatedRow;
      return { ...prev, services: nextServices };
    });
  };

  // Section E: Spare Parts Handlers
  const handleAddSparePartRow = () => {
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
          discount: 0,
          gst: 18,
          amount: 0
        }
      ]
    }));
  };

  const handleRemoveSparePartRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      spareParts: prev.spareParts.filter((_, i) => i !== index)
    }));
  };

  const handleSparePartSelect = (index, partId) => {
    const part = spareParts.find((p) => p.id === partId);
    if (!part) return;

    setFormData((prev) => {
      const nextParts = [...prev.spareParts];
      const qty = nextParts[index].quantity || 1;
      const unitPrice = part.sellingPrice || 0;
      const discount = nextParts[index].discount || 0;
      const gst = part.gstPercentage || 18;
      const discountedVal = Math.max(0, qty * unitPrice - discount);
      const amount = Math.round(discountedVal * (1 + gst / 100));

      nextParts[index] = {
        ...nextParts[index],
        partId: part.id,
        name: part.name,
        partNumber: part.partNumber,
        unitPrice,
        gst,
        amount
      };
      return { ...prev, spareParts: nextParts };
    });
  };

  const handleSparePartFieldChange = (index, field, value) => {
    setFormData((prev) => {
      const nextParts = [...prev.spareParts];
      const updatedRow = { ...nextParts[index], [field]: value };
      const qty = Number(field === 'quantity' ? value : updatedRow.quantity) || 1;
      const unitPrice = Number(field === 'unitPrice' ? value : updatedRow.unitPrice) || 0;
      const discount = Number(field === 'discount' ? value : updatedRow.discount) || 0;
      const gst = Number(field === 'gst' ? value : updatedRow.gst) || 18;

      const discountedVal = Math.max(0, qty * unitPrice - discount);
      updatedRow.amount = Math.round(discountedVal * (1 + gst / 100));
      nextParts[index] = updatedRow;
      return { ...prev, spareParts: nextParts };
    });
  };

  // Section F: Billing Summary Automatic Recalculation
  // Automatically calculate all amounts whenever quantities, prices or discounts change!
  useEffect(() => {
    let sSubtotal = 0;
    let sDiscount = 0;
    let sTax = 0;

    formData.services.forEach((s) => {
      const q = Number(s.quantity) || 1;
      const r = Number(s.rate) || 0;
      const d = Number(s.discount) || 0;
      const gst = Number(s.gst) || 18;
      const taxable = Math.max(0, q * r - d);
      sSubtotal += q * r;
      sDiscount += d;
      sTax += taxable * (gst / 100);
    });

    let pSubtotal = 0;
    let pDiscount = 0;
    let pTax = 0;

    formData.spareParts.forEach((p) => {
      const q = Number(p.quantity) || 1;
      const up = Number(p.unitPrice) || 0;
      const d = Number(p.discount) || 0;
      const gst = Number(p.gst) || 18;
      const taxable = Math.max(0, q * up - d);
      pSubtotal += q * up;
      pDiscount += d;
      pTax += taxable * (gst / 100);
    });

    const grossTotal = sSubtotal + pSubtotal;
    const totalDiscount = sDiscount + pDiscount;
    const taxableAmount = Math.max(0, grossTotal - totalDiscount);
    const totalTax = sTax + pTax;

    const cgst = Math.round((totalTax / 2) * 100) / 100;
    const sgst = Math.round((totalTax / 2) * 100) / 100;
    const igst = 0;

    const rawGrandTotal = taxableAmount + totalTax;
    const roundedGrandTotal = Math.round(rawGrandTotal);
    const roundOff = Math.round((roundedGrandTotal - rawGrandTotal) * 100) / 100;

    setFormData((prev) => {
      const amountPaid = prev.paymentStatus === 'Paid' ? roundedGrandTotal : prev.amountPaid;
      const balanceAmount = Math.max(0, roundedGrandTotal - amountPaid);

      return {
        ...prev,
        serviceSubtotal: sSubtotal,
        sparePartsSubtotal: pSubtotal,
        grossTotal,
        discountAmount: totalDiscount,
        taxableAmount,
        cgst,
        sgst,
        igst,
        roundOff,
        grandTotal: roundedGrandTotal,
        totalAmount: roundedGrandTotal,
        amountPaid,
        balanceAmount
      };
    });
  }, [formData.services, formData.spareParts]);

  // Handle Save / Confirm Invoice
  const handleConfirmInvoice = (e) => {
    e.preventDefault();
    if (!formData.customer?.name?.trim() || !formData.customer?.phone?.trim()) {
      alert('Please fill in Customer Name and Mobile Number.');
      return;
    }

    if (!formData.vehicle?.regNumber?.trim()) {
      alert('Please fill in Vehicle Number (e.g. TS 09 EA 4589).');
      return;
    }

    if (formData.services.length === 0 && formData.spareParts.length === 0) {
      alert('Please add at least one service or spare part item.');
      return;
    }

    // Save
    let finalizedInvoice;
    if (invoiceToEdit) {
      updateInvoice(invoiceToEdit.id, formData);
      finalizedInvoice = { ...formData, id: invoiceToEdit.id };
    } else {
      finalizedInvoice = addInvoice(formData);
    }

    setIsInvoiceModalOpen(false);

    // Also open the printable view modal for direct viewing / printing!
    setSelectedInvoiceForView(finalizedInvoice);
  };

  const customerList = customers;
  const currentCustomerVehicles = customers.find((c) => c.id === formData.customerId)?.vehicles || [];

  if (!isInvoiceModalOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => setIsInvoiceModalOpen(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '1060px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '2px solid var(--border-gold)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '18px 26px',
            borderBottom: '1.5px solid var(--border-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #ffffff 0%, #fdfbf7 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ReceiptText size={22} color="var(--gold-500)" />
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                {invoiceToEdit ? `Edit Invoice #${formData.invoiceNumber}` : 'Create Professional Invoice & Billing'}
              </h2>
              <span style={{ fontSize: '0.74rem', color: 'var(--gold-600)', fontWeight: 700 }}>
                Sections A through G • Automatic Tax Calculation & Inventory Sync
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsInvoiceModalOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleConfirmInvoice} style={{ padding: '24px 28px', maxHeight: '82vh', overflowY: 'auto' }}>
          {/* SECTION A: INVOICE INFORMATION */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--gold-600)', letterSpacing: '1px' }}>
                A. Invoice Information
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '4px' }}>
                  Invoice Number (Auto-generated) *
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '4px' }}>
                  Invoice Date *
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '4px' }}>
                  Job Card Number *
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.jobCardNumber}
                  onChange={(e) => setFormData({ ...formData, jobCardNumber: e.target.value })}
                  placeholder="JC-2026-1042"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '4px' }}>
                  Invoice Type *
                </label>
                <select
                  className="form-input"
                  value={formData.invoiceType}
                  onChange={(e) => setFormData({ ...formData, invoiceType: e.target.value })}
                >
                  <option value="Tax Invoice">Tax Invoice</option>
                  <option value="Proforma Invoice">Proforma Invoice</option>
                  <option value="Estimate / Quotation">Estimate / Quotation</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION B & C: CUSTOMER & VEHICLE INFORMATION */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '22px', marginBottom: '24px' }}>
            {/* Section B: Customer Information */}
            <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#fdfbf7', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--gold-600)', letterSpacing: '1px' }}>
                  B. Customer Information
                </span>
                <User size={16} color="var(--gold-500)" />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-muted)' }}>
                  Select Existing Customer (Auto-populates)
                </label>
                <select
                  className="form-input"
                  value={formData.customerId}
                  onChange={handleSelectCustomer}
                  style={{ backgroundColor: '#ffffff' }}
                >
                  <option value="">-- Choose Existing Client or Enter Below --</option>
                  {customerList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone}) - {c.id}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '4px' }}>
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.customer.name}
                    onChange={(e) => setFormData({ ...formData, customer: { ...formData.customer, name: e.target.value } })}
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '4px' }}>
                    Mobile Number *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.customer.phone}
                    onChange={(e) => setFormData({ ...formData, customer: { ...formData.customer, phone: e.target.value } })}
                    placeholder="+91..."
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '4px' }}>
                  Billing Address
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.customer.address}
                  onChange={(e) => setFormData({ ...formData, customer: { ...formData.customer, address: e.target.value } })}
                  placeholder="Address"
                />
              </div>
            </div>

            {/* Section C: Vehicle Information */}
            <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#fdfbf7', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--gold-600)', letterSpacing: '1px' }}>
                  C. Vehicle Information
                </span>
                <Car size={16} color="var(--gold-500)" />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-muted)' }}>
                  Select Customer Vehicle
                </label>
                <select
                  className="form-input"
                  value={formData.vehicleId}
                  onChange={handleSelectVehicle}
                  style={{ backgroundColor: '#ffffff' }}
                >
                  <option value="">-- Select from Client Fleet or Type Below --</option>
                  {currentCustomerVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.vehicleNumber} ({v.brand} {v.model})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '4px' }}>
                    Vehicle Number (Reg) *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.vehicle.regNumber}
                    onChange={(e) => setFormData({ ...formData, vehicle: { ...formData.vehicle, regNumber: e.target.value.toUpperCase() } })}
                    placeholder="TS 09 EA 4589"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '4px' }}>
                    Brand / Make
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.vehicle.brand}
                    onChange={(e) => setFormData({ ...formData, vehicle: { ...formData.vehicle, brand: e.target.value } })}
                    placeholder="e.g. Mercedes-Benz"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '4px' }}>
                    Model
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.vehicle.model}
                    onChange={(e) => setFormData({ ...formData, vehicle: { ...formData.vehicle, model: e.target.value } })}
                    placeholder="e.g. E-Class E 220d"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '4px' }}>
                    Current Odometer Reading
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.vehicle.odometer}
                    onChange={(e) => setFormData({ ...formData, vehicle: { ...formData.vehicle, odometer: e.target.value } })}
                    placeholder="e.g. 34,500 km"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION D: SERVICE DETAILS (Dynamic Multi-Row) */}
          <div style={{ marginBottom: '24px', borderTop: '1.5px solid var(--border-subtle)', paddingTop: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wrench size={18} color="var(--gold-500)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--gold-600)', letterSpacing: '1px' }}>
                  D. Service Details (Labor & Operations)
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddServiceRow}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-gold)',
                  backgroundColor: 'var(--gold-100)',
                  color: 'var(--gold-600)',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Plus size={14} />
                <span>Add Service Row</span>
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#fbf9f5', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '8px 10px', minWidth: '220px' }}>Service Name</th>
                    <th style={{ padding: '8px 10px', width: '80px' }}>Quantity</th>
                    <th style={{ padding: '8px 10px', width: '110px' }}>Rate (₹)</th>
                    <th style={{ padding: '8px 10px', width: '90px' }}>Discount (₹)</th>
                    <th style={{ padding: '8px 10px', width: '90px' }}>GST (%)</th>
                    <th style={{ padding: '8px 10px', width: '110px' }}>Amount (₹)</th>
                    <th style={{ padding: '8px 10px', width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.services.map((row, index) => (
                    <tr key={row.id || index} style={{ borderBottom: '1px solid #f5f3ed' }}>
                      <td style={{ padding: '8px 10px' }}>
                        <select
                          className="form-input"
                          value={row.serviceId}
                          onChange={(e) => handleServiceSelect(index, e.target.value)}
                          style={{ height: '32px', fontSize: '0.8rem', marginBottom: '4px' }}
                        >
                          <option value="">-- Choose from Catalog --</option>
                          {services.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} (₹{s.price})
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          className="form-input"
                          value={row.name}
                          onChange={(e) => handleServiceFieldChange(index, 'name', e.target.value)}
                          placeholder="Or type custom service description..."
                          style={{ height: '30px', fontSize: '0.78rem' }}
                        />
                      </td>

                      <td style={{ padding: '8px 10px' }}>
                        <input
                          type="number"
                          className="form-input"
                          value={row.quantity}
                          onChange={(e) => handleServiceFieldChange(index, 'quantity', e.target.value)}
                          min="1"
                          style={{ height: '32px', fontSize: '0.8rem' }}
                        />
                      </td>

                      <td style={{ padding: '8px 10px' }}>
                        <input
                          type="number"
                          className="form-input"
                          value={row.rate}
                          onChange={(e) => handleServiceFieldChange(index, 'rate', e.target.value)}
                          min="0"
                          style={{ height: '32px', fontSize: '0.8rem' }}
                        />
                      </td>

                      <td style={{ padding: '8px 10px' }}>
                        <input
                          type="number"
                          className="form-input"
                          value={row.discount}
                          onChange={(e) => handleServiceFieldChange(index, 'discount', e.target.value)}
                          min="0"
                          style={{ height: '32px', fontSize: '0.8rem' }}
                        />
                      </td>

                      <td style={{ padding: '8px 10px' }}>
                        <select
                          className="form-input"
                          value={row.gst}
                          onChange={(e) => handleServiceFieldChange(index, 'gst', Number(e.target.value))}
                          style={{ height: '32px', fontSize: '0.8rem' }}
                        >
                          <option value={18}>18%</option>
                          <option value={28}>28%</option>
                          <option value={12}>12%</option>
                          <option value={0}>0%</option>
                        </select>
                      </td>

                      <td style={{ padding: '8px 10px', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {formatCurrency(row.amount)}
                      </td>

                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        {formData.services.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveServiceRow(index)}
                            style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION E: PRODUCT DETAILS (Dynamic Multi-Row) */}
          <div style={{ marginBottom: '24px', borderTop: '1.5px solid var(--border-subtle)', paddingTop: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={18} color="var(--gold-500)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--gold-600)', letterSpacing: '1px' }}>
                  E. Products & Materials Details
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddSparePartRow}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-gold)',
                  backgroundColor: 'var(--gold-100)',
                  color: 'var(--gold-600)',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Plus size={14} />
                <span>Add Product Row</span>
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#fbf9f5', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '8px 10px', minWidth: '220px' }}>Part Name</th>
                    <th style={{ padding: '8px 10px', width: '130px' }}>Part Number</th>
                    <th style={{ padding: '8px 10px', width: '80px' }}>Quantity</th>
                    <th style={{ padding: '8px 10px', width: '110px' }}>Unit Price (₹)</th>
                    <th style={{ padding: '8px 10px', width: '90px' }}>Discount (₹)</th>
                    <th style={{ padding: '8px 10px', width: '90px' }}>GST (%)</th>
                    <th style={{ padding: '8px 10px', width: '110px' }}>Amount (₹)</th>
                    <th style={{ padding: '8px 10px', width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.spareParts.map((row, index) => {
                    const matchedPart = spareParts.find((p) => p.id === row.partId);
                    return (
                      <tr key={row.id || index} style={{ borderBottom: '1px solid #f5f3ed' }}>
                        <td style={{ padding: '8px 10px' }}>
                          <select
                            className="form-input"
                            value={row.partId}
                            onChange={(e) => handleSparePartSelect(index, e.target.value)}
                            style={{ height: '32px', fontSize: '0.8rem', marginBottom: '4px' }}
                          >
                            <option value="">-- Select from Inventory Catalog --</option>
                            {spareParts.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({p.brand} - Stock: {p.availableQuantity})
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            className="form-input"
                            value={row.name}
                            onChange={(e) => handleSparePartFieldChange(index, 'name', e.target.value)}
                            placeholder="Part Name"
                            style={{ height: '30px', fontSize: '0.78rem' }}
                          />
                          {matchedPart && (
                            <div style={{ fontSize: '0.7rem', color: matchedPart.availableQuantity <= 5 ? '#dc2626' : '#059669', marginTop: '2px', fontWeight: 600 }}>
                              Available Stock: {matchedPart.availableQuantity} units
                            </div>
                          )}
                        </td>

                        <td style={{ padding: '8px 10px' }}>
                          <input
                            type="text"
                            className="form-input"
                            value={row.partNumber}
                            onChange={(e) => handleSparePartFieldChange(index, 'partNumber', e.target.value)}
                            placeholder="PN-1234"
                            style={{ height: '32px', fontSize: '0.8rem' }}
                          />
                        </td>

                        <td style={{ padding: '8px 10px' }}>
                          <input
                            type="number"
                            className="form-input"
                            value={row.quantity}
                            onChange={(e) => handleSparePartFieldChange(index, 'quantity', e.target.value)}
                            min="1"
                            style={{ height: '32px', fontSize: '0.8rem' }}
                          />
                        </td>

                        <td style={{ padding: '8px 10px' }}>
                          <input
                            type="number"
                            className="form-input"
                            value={row.unitPrice}
                            onChange={(e) => handleSparePartFieldChange(index, 'unitPrice', e.target.value)}
                            min="0"
                            style={{ height: '32px', fontSize: '0.8rem' }}
                          />
                        </td>

                        <td style={{ padding: '8px 10px' }}>
                          <input
                            type="number"
                            className="form-input"
                            value={row.discount}
                            onChange={(e) => handleSparePartFieldChange(index, 'discount', e.target.value)}
                            min="0"
                            style={{ height: '32px', fontSize: '0.8rem' }}
                          />
                        </td>

                        <td style={{ padding: '8px 10px' }}>
                          <select
                            className="form-input"
                            value={row.gst}
                            onChange={(e) => handleSparePartFieldChange(index, 'gst', Number(e.target.value))}
                            style={{ height: '32px', fontSize: '0.8rem' }}
                          >
                            <option value={18}>18%</option>
                            <option value={28}>28%</option>
                            <option value={12}>12%</option>
                            <option value={5}>5%</option>
                          </select>
                        </td>

                        <td style={{ padding: '8px 10px', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {formatCurrency(row.amount)}
                        </td>

                        <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleRemoveSparePartRow(index)}
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
          </div>

          {/* SECTION F & G: BILLING SUMMARY & PAYMENT DETAILS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', borderTop: '1.5px solid var(--border-subtle)', paddingTop: '20px' }}>
            {/* Section F: Billing Summary */}
            <div style={{ padding: '20px', borderRadius: '10px', backgroundColor: '#fdfbf7', border: '1.5px solid var(--border-gold)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Calculator size={18} color="var(--gold-500)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--gold-600)', letterSpacing: '1px' }}>
                  F. Billing Summary
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Service Subtotal:</span>
                  <strong>{formatCurrency(formData.serviceSubtotal)}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Products Subtotal:</span>
                  <strong>{formatCurrency(formData.sparePartsSubtotal)}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-primary)', borderTop: '1px dashed #e5e0d4', paddingTop: '6px' }}>
                  <span>Gross Total:</span>
                  <strong>{formatCurrency(formData.grossTotal)}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                  <span>Total Discount:</span>
                  <strong>- {formatCurrency(formData.discountAmount)}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', borderTop: '1px dashed #e5e0d4', paddingTop: '6px' }}>
                  <span>Taxable Amount:</span>
                  <strong>{formatCurrency(formData.taxableAmount)}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  <span>CGST (9%):</span>
                  <span>{formatCurrency(formData.cgst)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  <span>SGST (9%):</span>
                  <span>{formatCurrency(formData.sgst)}</span>
                </div>

                {formData.igst > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    <span>IGST:</span>
                    <span>{formatCurrency(formData.igst)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  <span>Round Off:</span>
                  <span>{formatCurrency(formData.roundOff)}</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '2px solid var(--gold-500)',
                    paddingTop: '10px',
                    marginTop: '6px'
                  }}
                >
                  <span style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                    Grand Total:
                  </span>
                  <span style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--gold-600)', fontFamily: 'var(--font-display)' }}>
                    {formatCurrency(formData.grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Section G: Payment Details */}
            <div style={{ padding: '20px', borderRadius: '10px', backgroundColor: '#fdfbf7', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <CreditCard size={18} color="var(--gold-500)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--gold-600)', letterSpacing: '1px' }}>
                  G. Payment Details
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, marginBottom: '4px' }}>
                    Payment Method
                  </label>
                  <select
                    className="form-input"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  >
                    <option value="UPI">UPI (GooglePay / PhonePe / Paytm)</option>
                    <option value="Card">Credit / Debit Card (POS)</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT / RTGS / IMPS)</option>
                    <option value="Cash">Cash at Workshop Counter</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, marginBottom: '4px' }}>
                      Amount Paid (₹) *
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.amountPaid}
                      onChange={(e) => {
                        const paid = Number(e.target.value) || 0;
                        const bal = Math.max(0, formData.grandTotal - paid);
                        const status = bal === 0 ? 'Paid' : paid > 0 ? 'Partial' : 'Unpaid';
                        setFormData({
                          ...formData,
                          amountPaid: paid,
                          balanceAmount: bal,
                          paymentStatus: status,
                          status
                        });
                      }}
                      min="0"
                      max={formData.grandTotal}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, marginBottom: '4px' }}>
                      Balance Amount (₹)
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.balanceAmount}
                      readOnly
                      style={{ backgroundColor: '#f5f3ed', color: '#b91c1c', fontWeight: 700 }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, marginBottom: '4px' }}>
                      Payment Status *
                    </label>
                    <select
                      className="form-input"
                      value={formData.paymentStatus}
                      onChange={(e) => {
                        const status = e.target.value;
                        const paid = status === 'Paid' ? formData.grandTotal : status === 'Unpaid' ? 0 : formData.amountPaid;
                        const bal = Math.max(0, formData.grandTotal - paid);
                        setFormData({
                          ...formData,
                          paymentStatus: status,
                          status,
                          amountPaid: paid,
                          balanceAmount: bal
                        });
                      }}
                    >
                      <option value="Paid">Paid (Full Settlement)</option>
                      <option value="Partial">Partial (Part Settlement)</option>
                      <option value="Unpaid">Unpaid (Awaiting Payment)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, marginBottom: '4px' }}>
                      Transaction / Ref ID
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.transactionId}
                      onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                      placeholder="e.g. UPI/391024/HDFC"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, marginBottom: '4px' }}>
                    Job Card Notes / Remarks
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Notes printed on invoice..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              marginTop: '26px',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '18px'
            }}
          >
            <button
              type="button"
              onClick={() => setIsInvoiceModalOpen(false)}
              className="btn-outline"
              style={{ padding: '9px 20px', fontSize: '0.86rem' }}
            >
              Cancel
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="submit"
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 24px',
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
        </form>
      </div>
    </div>
  );
}
