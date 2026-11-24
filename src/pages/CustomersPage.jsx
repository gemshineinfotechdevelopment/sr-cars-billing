import React, { useState } from 'react';
import { useBilling } from '../context/useBilling';
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  Edit3, 
  Trash2, 
  Eye, 
  History, 
  X 
} from 'lucide-react';

export default function CustomersPage() {
  const { 
    customers, 
    invoices, 
    addCustomer, 
    updateCustomer, 
    deleteCustomer, 
    setSelectedInvoiceForView, 
    formatCurrency 
  } = useBilling();

  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [historyCustomer, setHistoryCustomer] = useState(null);

  // Form State
  const initialForm = {
    id: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    gstin: ''
  };

  const [formData, setFormData] = useState(initialForm);

  const openAddModal = () => {
    setEditingCustomer(null);
    setFormData({
      id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
      name: '',
      phone: '',
      email: '',
      address: '',
      gstin: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cust) => {
    setEditingCustomer(cust);
    setFormData({
      id: cust.id,
      name: cust.name,
      phone: cust.phone,
      email: cust.email || '',
      address: cust.address || '',
      gstin: cust.gstin || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Please enter Customer Name and Mobile Number.');
      return;
    }

    const customerPayload = {
      ...formData,
      vehicles: editingCustomer?.vehicles || []
    };

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, customerPayload);
    } else {
      addCustomer(customerPayload);
    }
    setIsModalOpen(false);
  };

  // Search customers
  const filteredCustomers = customers.filter((cust) => {
    const q = searchQuery.toLowerCase();
    return (
      cust.name.toLowerCase().includes(q) ||
      cust.phone.includes(q) ||
      cust.id.toLowerCase().includes(q) ||
      cust.vehicles?.some(
        (v) =>
          v.vehicleNumber.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.brand.toLowerCase().includes(q)
      )
    );
  });

  // Calculate customer's invoices
  const getCustomerInvoices = (customerId, customerName) => {
    return invoices.filter(
      (inv) => inv.customerId === customerId || inv.customer?.name === customerName
    );
  };

  return (
    <div style={{ padding: '28px 32px 64px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          marginBottom: '26px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                color: 'var(--gold-600)',
                background: 'rgba(212, 175, 55, 0.12)',
                padding: '2px 8px',
                borderRadius: '999px'
              }}
            >
              Client Fleet Database
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              fontWeight: 900,
              color: 'var(--text-primary)'
            }}
          >
            Customer & Fleet Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
            Maintain customer records, multi-vehicle profiles, odometer readings and historic service bills.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 22px',
            fontSize: '0.86rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-full)',
            background: 'var(--gold-shimmer)',
            color: '#ffffff',
            border: 'none',
            boxShadow: 'var(--shadow-gold)',
            cursor: 'pointer'
          }}
        >
          <Plus size={18} />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: '22px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ position: 'relative', width: '100%' }}>
          <Search
            size={16}
            color="var(--gold-500)"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search by customer name, mobile number or customer ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: '38px',
              height: '38px',
              fontSize: '0.85rem',
              borderRadius: 'var(--radius-md)',
              background: '#fdfbf7',
              borderColor: 'var(--border-subtle)',
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* Customer Listing Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: '#fbf9f5',
                  borderBottom: '1.5px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  fontSize: '0.74rem',
                  textTransform: 'uppercase'
                }}
              >
                <th style={{ padding: '12px 16px' }}>Customer ID</th>
                <th style={{ padding: '12px 16px' }}>Customer Name & Contact</th>
                <th style={{ padding: '12px 16px' }}>Address & GSTIN</th>
                <th style={{ padding: '12px 16px' }}>Total Invoices</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No customer records matched your query. Click "Add Customer" to register a client.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const custInvoices = getCustomerInvoices(cust.id, cust.name);
                  const totalSpent = custInvoices.reduce((s, i) => s + (i.grandTotal || i.totalAmount || 0), 0);

                  return (
                    <tr
                      key={cust.id}
                      style={{ borderBottom: '1px solid #f5f3ed', transition: 'background-color 0.15s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fdfcf9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Customer ID */}
                      <td style={{ padding: '14px 16px', fontWeight: 800, color: 'var(--gold-600)', whiteSpace: 'nowrap' }}>
                        {cust.id}
                      </td>

                      {/* Name & Contact */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                          {cust.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                          <Phone size={12} color="var(--gold-500)" />
                          <span>{cust.phone}</span>
                        </div>
                        {cust.email && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            <Mail size={12} color="var(--gold-500)" />
                            <span>{cust.email}</span>
                          </div>
                        )}
                      </td>

                      {/* Address & GSTIN */}
                      <td style={{ padding: '14px 16px', maxWidth: '240px' }}>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                          {cust.address || '—'}
                        </div>
                        {cust.gstin ? (
                          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, marginTop: '3px' }}>
                            GST: {cust.gstin}
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                            Individual Client (No GSTIN)
                          </div>
                        )}
                      </td>

                      {/* Total Invoices & Spend */}
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 800, color: 'var(--gold-600)' }}>
                          {formatCurrency(totalSpent)}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {custInvoices.length} {custInvoices.length === 1 ? 'Invoice' : 'Invoices'}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          {/* View Customer Details */}
                          <button
                            onClick={() => setViewingCustomer(cust)}
                            title="View Customer Profile"
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: '#ffffff',
                              color: 'var(--gold-600)',
                              cursor: 'pointer'
                            }}
                          >
                            <Eye size={15} />
                          </button>

                          {/* View Service History */}
                          <button
                            onClick={() => setHistoryCustomer(cust)}
                            title="View Service History"
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              border: '1px solid #bfdbfe',
                              backgroundColor: '#eff6ff',
                              color: '#2563eb',
                              cursor: 'pointer'
                            }}
                          >
                            <History size={15} />
                          </button>

                          {/* Edit Customer */}
                          <button
                            onClick={() => openEditModal(cust)}
                            title="Edit Customer Details"
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: '#ffffff',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer'
                            }}
                          >
                            <Edit3 size={15} />
                          </button>

                          {/* Delete Customer */}
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete customer "${cust.name}"?`)) {
                                deleteCustomer(cust.id);
                              }
                            }}
                            title="Delete Customer"
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              border: '1px solid #fecaca',
                              backgroundColor: '#fff5f5',
                              color: '#dc2626',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '820px',
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
                padding: '20px 24px',
                borderBottom: '1.5px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, #ffffff 0%, #fdfbf7 100%)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={20} color="var(--gold-500)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {editingCustomer ? 'Edit Customer Details' : 'Register New Customer'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} style={{ padding: '24px', maxHeight: '80vh', overflowY: 'auto' }}>
              {/* Customer Details */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.86rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--gold-600)', letterSpacing: '1px', marginBottom: '14px' }}>
                  Customer Profile Information
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                      Customer ID
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      placeholder="CUST-001"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Vikramaditya Reddy"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                      Mobile Number *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="client@domain.com"
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                      Billing Address
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Plot, Street, Area, City, State - Pincode"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                      GSTIN (Optional)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.gstin}
                      onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                      placeholder="36AABCU9603R1ZM"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-outline"
                  style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    padding: '8px 24px',
                    fontSize: '0.85rem',
                    background: 'var(--gold-shimmer)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {editingCustomer ? 'Save Changes' : 'Register Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Full View Modal */}
      {viewingCustomer && (
        <div className="modal-backdrop" onClick={() => setViewingCustomer(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '720px',
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--border-gold)',
              boxShadow: 'var(--shadow-lg)',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--gold-600)', textTransform: 'uppercase' }}>
                  {viewingCustomer.id}
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                  {viewingCustomer.name}
                </h3>
              </div>
              <button
                onClick={() => setViewingCustomer(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '22px' }}>
              <div style={{ padding: '12px', backgroundColor: '#fdfbf7', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Mobile Number</span>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{viewingCustomer.phone}</strong>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#fdfbf7', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Email Address</span>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{viewingCustomer.email || '—'}</strong>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#fdfbf7', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>GSTIN</span>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{viewingCustomer.gstin || 'None'}</strong>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#fdfbf7', borderRadius: '8px', border: '1px solid var(--border-subtle)', gridColumn: '1 / -1' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Billing Address</span>
                <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>{viewingCustomer.address || '—'}</span>
              </div>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button
                onClick={() => {
                  setViewingCustomer(null);
                  setHistoryCustomer(viewingCustomer);
                }}
                className="btn-primary"
                style={{
                  padding: '8px 18px',
                  fontSize: '0.82rem',
                  background: 'var(--gold-shimmer)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                View Full Service & Billing History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service History Modal */}
      {historyCustomer && (
        <div className="modal-backdrop" onClick={() => setHistoryCustomer(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '820px',
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--border-gold)',
              boxShadow: 'var(--shadow-lg)',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--gold-600)', textTransform: 'uppercase' }}>
                  Service & Billing History
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                  {historyCustomer.name} ({historyCustomer.id})
                </h3>
              </div>
              <button
                onClick={() => setHistoryCustomer(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {(() => {
              const custInvoices = getCustomerInvoices(historyCustomer.id, historyCustomer.name);
              if (custInvoices.length === 0) {
                return (
                  <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No invoice records found for this customer.
                  </div>
                );
              }

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {custInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '8px',
                        backgroundColor: '#fdfbf7',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                            {inv.invoiceNumber}
                          </strong>
                          <span style={{ fontSize: '0.74rem', color: 'var(--gold-600)', fontWeight: 600 }}>
                            {inv.date}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            Job Card: {inv.jobCardNumber || 'JC-2026'}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          Vehicle: <strong>{inv.vehicle?.regNumber}</strong> ({inv.vehicle?.brand} {inv.vehicle?.model})
                        </div>

                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Services: {inv.services?.map((s) => s.name).join(', ') || 'Service'}
                          {inv.spareParts?.length > 0 && ` • Spares: ${inv.spareParts.length} items`}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--gold-600)' }}>
                          {formatCurrency(inv.grandTotal || inv.totalAmount || 0)}
                        </div>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: '999px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            backgroundColor: inv.status === 'Paid' ? '#d1fae5' : '#fef3c7',
                            color: inv.status === 'Paid' ? '#065f46' : '#92400e',
                            marginTop: '4px'
                          }}
                        >
                          {inv.status}
                        </span>
                        <div style={{ marginTop: '6px' }}>
                          <button
                            onClick={() => {
                              setSelectedInvoiceForView(inv);
                            }}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '4px',
                              border: '1px solid var(--border-gold)',
                              backgroundColor: '#ffffff',
                              color: 'var(--gold-600)',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            View Invoice
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
