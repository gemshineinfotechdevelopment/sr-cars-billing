import React, { useState } from 'react';
import { useBilling } from '../context/useBilling';
import { 
  Wrench, 
  Plus, 
  Search, 
  Clock, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  X, 
  Layers
} from 'lucide-react';

export default function ServicesPage() {
  const { 
    services, 
    addService, 
    updateService, 
    deleteService, 
    toggleServiceStatus, 
    formatCurrency 
  } = useBilling();

  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const initialForm = {
    id: '',
    name: '',
    description: '',
    category: 'Periodic Maintenance',
    price: '',
    gstPercentage: 18,
    estimatedDuration: '1 hour',
    status: 'Active'
  };

  const [formData, setFormData] = useState(initialForm);

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      id: `SRV-${String(services.length + 1).padStart(3, '0')}`,
      name: '',
      description: '',
      category: 'Periodic Maintenance',
      price: '',
      gstPercentage: 18,
      estimatedDuration: '1 hour',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      id: service.id,
      name: service.name,
      description: service.description || '',
      category: service.category || 'Periodic Maintenance',
      price: service.price || '',
      gstPercentage: service.gstPercentage || 18,
      estimatedDuration: service.estimatedDuration || '1 hour',
      status: service.status || 'Active'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      alert('Please fill in Service Name and Price.');
      return;
    }

    if (editingService) {
      updateService(editingService.id, formData);
    } else {
      addService(formData);
    }
    setIsModalOpen(false);
  };

  // Filtered Services
  const filteredServices = services.filter((srv) => {
    const q = searchQuery.toLowerCase();
    return (
      srv.name.toLowerCase().includes(q) ||
      srv.id.toLowerCase().includes(q) ||
      (srv.description && srv.description.toLowerCase().includes(q)) ||
      srv.category.toLowerCase().includes(q)
    );
  });

  const activeCount = services.filter((s) => s.status === 'Active').length;
  const inactiveCount = services.length - activeCount;

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
              Labor & Service Catalog
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
            Automotive Service Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
            Configure workshop labor rates, GST percentages, job duration and active service menus.
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
          <span>Add New Service</span>
        </button>
      </div>

      {/* Summary KPI Pills */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '22px', flexWrap: 'wrap' }}>
        <div style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem' }}>
          <Layers size={16} color="var(--gold-500)" />
          <span style={{ color: 'var(--text-muted)' }}>Total Services:</span>
          <strong>{services.length}</strong>
        </div>

        <div style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#ffffff', border: '1px solid #d1fae5', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem' }}>
          <CheckCircle2 size={16} color="#059669" />
          <span style={{ color: 'var(--text-muted)' }}>Active Menu:</span>
          <strong style={{ color: '#059669' }}>{activeCount}</strong>
        </div>

        {inactiveCount > 0 && (
          <div style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#ffffff', border: '1px solid #fee2e2', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem' }}>
            <XCircle size={16} color="#dc2626" />
            <span style={{ color: 'var(--text-muted)' }}>Inactive / Seasonal:</span>
            <strong style={{ color: '#dc2626' }}>{inactiveCount}</strong>
          </div>
        )}
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
            placeholder="Search by service name, category or service ID..."
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

      {/* Services Table */}
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
                <th style={{ padding: '12px 16px' }}>Service ID</th>
                <th style={{ padding: '12px 16px' }}>Service Name & Details</th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>Rate & GST</th>
                <th style={{ padding: '12px 16px' }}>Est. Duration</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No services found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredServices.map((srv) => {
                  const rate = Number(srv.price) || 0;
                  const gst = Number(srv.gstPercentage) || 18;
                  const totalWithGst = Math.round(rate * (1 + gst / 100));

                  return (
                    <tr
                      key={srv.id}
                      style={{
                        borderBottom: '1px solid #f5f3ed',
                        opacity: srv.status === 'Inactive' ? 0.65 : 1,
                        transition: 'background-color 0.15s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fdfcf9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Service ID */}
                      <td style={{ padding: '14px 16px', fontWeight: 800, color: 'var(--gold-600)', whiteSpace: 'nowrap' }}>
                        {srv.id}
                      </td>

                      {/* Name & Description */}
                      <td style={{ padding: '14px 16px', maxWidth: '320px' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                          {srv.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px', lineHeight: 1.3 }}>
                          {srv.description}
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 9px',
                            borderRadius: '6px',
                            backgroundColor: '#fbf7ee',
                            border: '1px solid var(--border-gold)',
                            color: 'var(--gold-600)',
                            fontSize: '0.76rem',
                            fontWeight: 700
                          }}
                        >
                          {srv.category}
                        </span>
                      </td>

                      {/* Rate & GST */}
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                          {formatCurrency(rate)}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          +{gst}% GST = <strong>{formatCurrency(totalWithGst)}</strong>
                        </div>
                      </td>

                      {/* Duration */}
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <Clock size={13} color="var(--gold-500)" />
                          <span>{srv.estimatedDuration || '1 hour'}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={() => toggleServiceStatus(srv.id)}
                          title="Click to toggle Active/Inactive"
                          style={{
                            padding: '3px 10px',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: srv.status === 'Active' ? '#d1fae5' : '#e5e7eb',
                            color: srv.status === 'Active' ? '#065f46' : '#4b5563',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {srv.status === 'Active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          <span>{srv.status}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => openEditModal(srv)}
                            title="Edit Service"
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

                          <button
                            onClick={() => {
                              if (window.confirm(`Delete service "${srv.name}"?`)) {
                                deleteService(srv.id);
                              }
                            }}
                            title="Delete Service"
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

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '580px',
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--border-gold)',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden'
            }}
          >
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
                <Wrench size={20} color="var(--gold-500)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                      Service ID *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      placeholder="SRV-001"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                      Service Name *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Engine Oil Change"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Service Description
                  </label>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe tasks included in this service..."
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                      Category *
                    </label>
                    <select
                      className="form-input"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Periodic Maintenance">Periodic Maintenance</option>
                      <option value="Washing & Cleaning">Washing & Cleaning</option>
                      <option value="Detailing">Detailing</option>
                      <option value="Wheel & Tyre">Wheel & Tyre</option>
                      <option value="Electrical & AC">Electrical & AC</option>
                      <option value="Mechanical Repair">Mechanical Repair</option>
                      <option value="Body Shop">Body Shop</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="1800"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                      GST (%)
                    </label>
                    <select
                      className="form-input"
                      value={formData.gstPercentage}
                      onChange={(e) => setFormData({ ...formData, gstPercentage: Number(e.target.value) })}
                    >
                      <option value={18}>18% (Standard)</option>
                      <option value={28}>28% (Luxury)</option>
                      <option value={12}>12%</option>
                      <option value={5}>5%</option>
                      <option value={0}>0% (Exempt)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                      Estimated Duration
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.estimatedDuration}
                      onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                      placeholder="e.g. 45 mins, 2 hours"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                      Status
                    </label>
                    <select
                      className="form-input"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

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
                    padding: '8px 22px',
                    fontSize: '0.85rem',
                    background: 'var(--gold-shimmer)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {editingService ? 'Save Service' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
