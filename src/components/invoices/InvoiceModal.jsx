import React, { useState } from 'react';
import { useBilling } from '../../context/useBilling';
import { 
  X, 
  Plus, 
  Trash2, 
  User, 
  FileText, 
  Sparkles, 
  Check, 
  Car 
} from 'lucide-react';

function getDefaultFormData(invoiceToEdit, settings) {
  if (invoiceToEdit) {
    return {
      ...invoiceToEdit,
      discountAmount: invoiceToEdit.discountAmount || 0
    };
  }

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const nextWeek = new Date(now.getTime() + 7 * 86400000);
  const nextWeekStr = nextWeek.toISOString().split('T')[0];

  return {
    invoiceNumber: '',
    date: todayStr,
    dueDate: nextWeekStr,
    status: 'Pending',
    paymentMethod: 'Bank Transfer (NEFT/RTGS)',
    customer: {
      name: '',
      company: '',
      phone: '',
      email: '',
      address: '',
      gstin: ''
    },
    vehicle: {
      makeModel: '',
      regNumber: '',
      vin: '',
      year: now.getFullYear().toString(),
      odometer: '',
      color: ''
    },
    items: [
      {
        id: 'item-1',
        productId: '',
        name: '',
        category: 'Services',
        qty: 1,
        unitPrice: 0,
        taxPercent: settings?.taxRate || 18,
        total: 0
      }
    ],
    discountAmount: 0,
    notes: settings?.notes || ''
  };
}

export default function InvoiceModal() {
  const { 
    isInvoiceModalOpen, 
    setIsInvoiceModalOpen, 
    invoiceToEdit, 
    products, 
    settings, 
    addInvoice, 
    updateInvoice 
  } = useBilling();

  const [formData, setFormData] = useState(() => getDefaultFormData(invoiceToEdit, settings));

  if (!isInvoiceModalOpen) return null;

  const handleCustomerChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      customer: { ...prev.customer, [field]: value }
    }));
  };

  const handleVehicleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      vehicle: { ...prev.vehicle, [field]: value }
    }));
  };

  const handleItemSelectProduct = (index, prodId) => {
    const selectedProd = products.find((p) => p.id === prodId);
    if (!selectedProd) return;

    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        productId: selectedProd.id,
        name: selectedProd.name,
        category: selectedProd.category,
        unitPrice: selectedProd.price,
        total: (Number(newItems[index].qty) || 1) * selectedProd.price
      };
      return { ...prev, items: newItems };
    });
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      const current = { ...newItems[index], [field]: value };
      
      const qty = Number(field === 'qty' ? value : current.qty) || 0;
      const unitPrice = Number(field === 'unitPrice' ? value : current.unitPrice) || 0;
      current.total = qty * unitPrice;
      
      newItems[index] = current;
      return { ...prev, items: newItems };
    });
  };

  const addItemRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: 'item-' + Date.now(),
          productId: '',
          name: '',
          category: 'Services',
          qty: 1,
          unitPrice: 0,
          taxPercent: settings.taxRate || 18,
          total: 0
        }
      ]
    }));
  };

  const removeItemRow = (index) => {
    if (formData.items.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // Financial calculations
  const subtotal = formData.items.reduce((sum, itm) => sum + (Number(itm.total) || 0), 0);
  const discount = Math.min(Number(formData.discountAmount) || 0, subtotal);
  const taxableAmount = Math.max(0, subtotal - discount);
  const taxRate = Number(settings.taxRate) || 18;
  const taxAmount = Math.round(taxableAmount * (taxRate / 100));
  const grandTotal = taxableAmount + taxAmount;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.customer.name.trim()) {
      alert('Please enter customer name');
      return;
    }
    if (!formData.vehicle.makeModel.trim()) {
      alert('Please enter vehicle model');
      return;
    }
    if (formData.items.some((i) => !i.name.trim())) {
      alert('Please ensure all items have a description/name');
      return;
    }

    const payload = {
      ...formData,
      subtotal,
      discountAmount: discount,
      taxableAmount,
      taxAmount,
      totalAmount: grandTotal
    };

    if (invoiceToEdit) {
      updateInvoice(invoiceToEdit.id, payload);
    } else {
      addInvoice(payload);
    }

    setIsInvoiceModalOpen(false);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsInvoiceModalOpen(false)}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '960px', width: '95%' }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '24px 28px',
            borderBottom: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(212,175,55,0.06) 0%, transparent 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--gold-subtle)',
                border: '1px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold-400)'
              }}
            >
              <FileText size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                {invoiceToEdit ? `Edit Invoice #${invoiceToEdit.invoiceNumber}` : 'Create Luxury Automotive Invoice'}
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Official billing statement with vehicle profile, catalog items and GST taxation
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsInvoiceModalOpen(false)}
            className="btn-icon"
            style={{ width: '32px', height: '32px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
          {/* Top Row: Meta Dates & Status */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
              padding: '16px',
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div>
              <label className="form-label">Invoice Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label">Payment Due Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label">Payment Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
            <div>
              <label className="form-label">Settlement Mode</label>
              <select
                className="form-select"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <option value="Bank Transfer (NEFT/RTGS)">Bank Transfer (NEFT/RTGS)</option>
                <option value="UPI Instant / IMPS">UPI Instant / IMPS</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Corporate Wire">Corporate Wire</option>
                <option value="Automotive Financing">Automotive Financing</option>
                <option value="Cash Deposit">Cash Deposit</option>
              </select>
            </div>
          </div>

          {/* Section 1: Client & Vehicle Information Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '24px',
              marginBottom: '28px'
            }}
          >
            {/* Customer Details Box */}
            <div
              style={{
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                background: 'rgba(255,255,255,0.01)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--gold-400)' }}>
                <User size={16} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Client Information
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label className="form-label">Client / Entity Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Vikramaditya Singhania"
                    value={formData.customer.name}
                    onChange={(e) => handleCustomerChange('name', e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="+91 98765 43210"
                      value={formData.customer.phone}
                      onChange={(e) => handleCustomerChange('phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="client@luxury.com"
                      value={formData.customer.email}
                      onChange={(e) => handleCustomerChange('email', e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                  <div>
                    <label className="form-label">Company / Firm Name (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Singhania Holdings & Infra"
                      value={formData.customer.company}
                      onChange={(e) => handleCustomerChange('company', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">GSTIN / Tax ID</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="36AAECS4592K1Z9"
                      value={formData.customer.gstin}
                      onChange={(e) => handleCustomerChange('gstin', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Billing Address</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Villa / Suite, Street, City, Pincode"
                    value={formData.customer.address}
                    onChange={(e) => handleCustomerChange('address', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Profile Box */}
            <div
              style={{
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                background: 'rgba(255,255,255,0.01)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--accent-blue)' }}>
                <Car size={16} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Vehicle Specification
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label className="form-label">Make & Model *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Porsche Macan GTS 2.9L Twin-Turbo"
                    value={formData.vehicle.makeModel}
                    onChange={(e) => handleVehicleChange('makeModel', e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label">Registration / Plate No</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="TS 09 EU 4499"
                      value={formData.vehicle.regNumber}
                      onChange={(e) => handleVehicleChange('regNumber', e.target.value)}
                      style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}
                    />
                  </div>
                  <div>
                    <label className="form-label">Chassis / VIN Number</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="WP1ZZZ95ZPL120894"
                      value={formData.vehicle.vin}
                      onChange={(e) => handleVehicleChange('vin', e.target.value)}
                      style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label">Model Year</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="2024"
                      value={formData.vehicle.year}
                      onChange={(e) => handleVehicleChange('year', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Odometer</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="14,800 KM"
                      value={formData.vehicle.odometer}
                      onChange={(e) => handleVehicleChange('odometer', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Exterior Color</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Crayon Grey"
                      value={formData.vehicle.color}
                      onChange={(e) => handleVehicleChange('color', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Line Items Table */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="var(--gold-400)" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Line Items & Services Catalog
                </h3>
              </div>

              <button
                type="button"
                className="btn-outline-gold"
                onClick={addItemRow}
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                <Plus size={14} />
                <span>Add Item / Service</span>
              </button>
            </div>

            <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <table className="luxury-table" style={{ minWidth: '700px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '40%' }}>Item / Service Description</th>
                    <th style={{ width: '16%' }}>Category</th>
                    <th style={{ width: '10%' }}>Qty</th>
                    <th style={{ width: '18%' }}>Unit Price ({settings.currency})</th>
                    <th style={{ width: '12%' }}>Total ({settings.currency})</th>
                    <th style={{ width: '4%' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>
                        <select
                          className="form-select"
                          value={item.productId || ''}
                          onChange={(e) => handleItemSelectProduct(index, e.target.value)}
                          style={{ marginBottom: '6px', fontSize: '0.78rem', padding: '6px 10px' }}
                        >
                          <option value="">-- Quick Pick from Showroom Catalog --</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              [{p.category}] {p.name} - ₹{p.price.toLocaleString('en-IN')}
                            </option>
                          ))}
                        </select>

                        <input
                          type="text"
                          className="form-input"
                          placeholder="Item name / service specification"
                          value={item.name}
                          onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                          required
                        />
                      </td>

                      <td>
                        <select
                          className="form-select"
                          value={item.category}
                          onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                        >
                          <option value="Vehicles">Vehicles</option>
                          <option value="Services">Services</option>
                          <option value="Detailing">Detailing</option>
                          <option value="Spare Parts">Spare Parts</option>
                          <option value="Accessories">Accessories</option>
                        </select>
                      </td>

                      <td>
                        <input
                          type="number"
                          className="form-input"
                          min="1"
                          value={item.qty}
                          onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                          required
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          className="form-input"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                          required
                        />
                      </td>

                      <td>
                        <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                          {(Number(item.total) || 0).toLocaleString('en-IN')}
                        </span>
                      </td>

                      <td>
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItemRow(index)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--status-overdue)',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
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

          {/* Section 3: Summary Breakdown & Notes */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
              gap: '24px',
              marginBottom: '28px'
            }}
          >
            {/* Notes & Terms Box */}
            <div>
              <label className="form-label">Invoice Notes / Warranty & Inspection Remarks</label>
              <textarea
                className="form-textarea"
                rows="4"
                placeholder="Enter client instructions, vehicle diagnostics status, warranty terms..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            {/* Calculations Box */}
            <div
              style={{
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                border: '1px solid var(--border-gold)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Items Subtotal:</span>
                <span style={{ fontWeight: 600 }}>{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Discount / Concession ({settings.currency}):</span>
                <input
                  type="number"
                  min="0"
                  style={{ width: '110px', textAlign: 'right', padding: '4px 8px' }}
                  className="form-input"
                  value={formData.discountAmount}
                  onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Taxable Value:</span>
                <span style={{ fontWeight: 600 }}>{taxableAmount.toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  Automotive GST ({taxRate}%):
                </span>
                <span style={{ fontWeight: 600, color: 'var(--gold-400)' }}>{taxAmount.toLocaleString('en-IN')}</span>
              </div>

              <div
                style={{
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-medium)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline'
                }}
              >
                <span style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Grand Total:
                </span>
                <span
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: 'var(--gold-400)',
                    fontFamily: 'var(--font-sans)'
                  }}
                >
                  {settings.currency} {grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '14px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-subtle)'
            }}
          >
            <button
              type="button"
              className="btn-outline"
              onClick={() => setIsInvoiceModalOpen(false)}
            >
              Cancel
            </button>

            <button type="submit" className="btn-gold" style={{ padding: '10px 28px' }}>
              <Check size={18} />
              <span>{invoiceToEdit ? 'Save Invoice Changes' : 'Generate & Authorize Invoice'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
