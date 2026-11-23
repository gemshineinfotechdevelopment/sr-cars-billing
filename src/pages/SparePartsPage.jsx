import React, { useState } from 'react';
import { useBilling } from '../context/useBilling';
import { 
  Package, 
  Plus, 
  Search, 
  AlertTriangle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Edit3, 
  Trash2, 
  X
} from 'lucide-react';

export default function SparePartsPage() {
  const { 
    spareParts, 
    addSparePart, 
    updateSparePart, 
    deleteSparePart, 
    stockIn, 
    stockOut, 
    formatCurrency 
  } = useBilling();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [brandFilter, setBrandFilter] = useState('ALL');
  const [stockStatusFilter, setStockStatusFilter] = useState('ALL'); // ALL | LOW_STOCK | IN_STOCK

  // Modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState(null);

  // Stock In / Out Modal
  const [stockModal, setStockModal] = useState({
    isOpen: false,
    mode: 'IN', // 'IN' or 'OUT'
    part: null,
    quantity: 1,
    notes: ''
  });

  const initialForm = {
    id: '',
    name: '',
    partNumber: '',
    brand: 'Bosch',
    category: 'Filters',
    hsnCode: '84212300',
    purchasePrice: '',
    sellingPrice: '',
    availableQuantity: '',
    minimumStockLevel: 5,
    gstPercentage: 18
  };

  const [formData, setFormData] = useState(initialForm);

  // Distinct categories and brands
  const categories = ['ALL', ...Array.from(new Set(spareParts.map((p) => p.category)))];
  const brands = ['ALL', ...Array.from(new Set(spareParts.map((p) => p.brand)))];

  const lowStockParts = spareParts.filter(
    (p) => (p.availableQuantity || 0) <= (p.minimumStockLevel || 5)
  );

  const openAddModal = () => {
    setEditingPart(null);
    setFormData({
      id: `PRT-${String(spareParts.length + 101)}`,
      name: '',
      partNumber: '',
      brand: 'Bosch',
      category: 'Filters',
      hsnCode: '84212300',
      purchasePrice: '',
      sellingPrice: '',
      availableQuantity: '',
      minimumStockLevel: 5,
      gstPercentage: 18
    });
    setIsAddEditModalOpen(true);
  };

  const openEditModal = (part) => {
    setEditingPart(part);
    setFormData({
      id: part.id,
      name: part.name,
      partNumber: part.partNumber,
      brand: part.brand || 'OEM',
      category: part.category || 'General',
      hsnCode: part.hsnCode || '8708',
      purchasePrice: part.purchasePrice || '',
      sellingPrice: part.sellingPrice || '',
      availableQuantity: part.availableQuantity || 0,
      minimumStockLevel: part.minimumStockLevel || 5,
      gstPercentage: part.gstPercentage || 18
    });
    setIsAddEditModalOpen(true);
  };

  const handleSavePart = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.partNumber.trim() || !formData.sellingPrice) {
      alert('Please fill Part Name, Part Number and Selling Price.');
      return;
    }

    if (editingPart) {
      updateSparePart(editingPart.id, formData);
    } else {
      addSparePart(formData);
    }
    setIsAddEditModalOpen(false);
  };

  const openStockModal = (part, mode) => {
    setStockModal({
      isOpen: true,
      mode,
      part,
      quantity: 5,
      notes: mode === 'IN' ? 'Supplier Restock' : 'Workshop Bay Consumption'
    });
  };

  const handleStockSubmit = (e) => {
    e.preventDefault();
    if (!stockModal.part || !stockModal.quantity || stockModal.quantity <= 0) return;

    if (stockModal.mode === 'IN') {
      stockIn(stockModal.part.id, stockModal.quantity, stockModal.notes);
    } else {
      stockOut(stockModal.part.id, stockModal.quantity, stockModal.notes);
    }
    setStockModal({ isOpen: false, mode: 'IN', part: null, quantity: 1, notes: '' });
  };

  // Filtered Parts
  const filteredParts = spareParts.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(q) ||
      p.partNumber.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.hsnCode && p.hsnCode.includes(q)) ||
      p.id.toLowerCase().includes(q);

    if (!matchSearch) return false;

    const matchCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    const matchBrand = brandFilter === 'ALL' || p.brand === brandFilter;

    let matchStock = true;
    if (stockStatusFilter === 'LOW_STOCK') {
      matchStock = (p.availableQuantity || 0) <= (p.minimumStockLevel || 5);
    } else if (stockStatusFilter === 'IN_STOCK') {
      matchStock = (p.availableQuantity || 0) > (p.minimumStockLevel || 5);
    }

    return matchCategory && matchBrand && matchStock;
  });

  const totalInventoryValue = spareParts.reduce(
    (sum, p) => sum + (p.purchasePrice || 0) * (p.availableQuantity || 0),
    0
  );

  const totalRetailValue = spareParts.reduce(
    (sum, p) => sum + (p.sellingPrice || 0) * (p.availableQuantity || 0),
    0
  );

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
              OEM & Performance Parts Inventory
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
            Spare Parts Inventory Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
            Monitor available quantities, HSN codes, automated stock-in/stock-out, and minimum safety levels.
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
          <span>Add Spare Part</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div style={{ padding: '16px 20px', borderRadius: '10px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Part SKU Records
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
            {spareParts.length}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {Array.from(new Set(spareParts.map((p) => p.brand))).length} Leading Brands
          </div>
        </div>

        <div style={{ padding: '16px 20px', borderRadius: '10px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Inventory Cost Valuation
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--gold-600)', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
            {formatCurrency(totalInventoryValue)}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Retail Value: {formatCurrency(totalRetailValue)}
          </div>
        </div>

        <div
          onClick={() => setStockStatusFilter('LOW_STOCK')}
          style={{
            padding: '16px 20px',
            borderRadius: '10px',
            backgroundColor: lowStockParts.length > 0 ? '#fffbeb' : '#ffffff',
            border: lowStockParts.length > 0 ? '1.5px solid #fde68a' : '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: lowStockParts.length > 0 ? '#b45309' : 'var(--text-muted)', textTransform: 'uppercase' }}>
            Low Stock Alerts
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: lowStockParts.length > 0 ? '#dc2626' : '#059669', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
            {lowStockParts.length} Parts Critical
          </div>
          <div style={{ fontSize: '0.74rem', color: lowStockParts.length > 0 ? '#b45309' : '#059669', marginTop: '2px', fontWeight: 600 }}>
            {lowStockParts.length > 0 ? 'Click to filter low stock items' : 'All stocks above safety threshold'}
          </div>
        </div>
      </div>

      {/* Low Stock Banner Alert */}
      {lowStockParts.length > 0 && stockStatusFilter !== 'LOW_STOCK' && (
        <div
          style={{
            backgroundColor: '#fffdfa',
            border: '1.5px solid #f59e0b',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#fef3c7', color: '#b45309' }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <strong style={{ fontSize: '0.92rem', color: '#92400e' }}>
                Stock Warning: {lowStockParts.length} spare parts are at or below minimum threshold!
              </strong>
              <div style={{ fontSize: '0.78rem', color: '#78350f', marginTop: '2px' }}>
                {lowStockParts.map((p) => `${p.name} (${p.availableQuantity} left)`).join(', ')}
              </div>
            </div>
          </div>

          <button
            onClick={() => setStockStatusFilter('LOW_STOCK')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              backgroundColor: '#b45309',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Show Low Stock Only
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: '22px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <Search
            size={16}
            color="var(--gold-500)"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search parts by name, part number, brand, category, HSN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: '38px',
              height: '38px',
              fontSize: '0.84rem',
              borderRadius: 'var(--radius-md)',
              background: '#fdfbf7',
              borderColor: 'var(--border-subtle)',
              width: '100%'
            }}
          />
        </div>

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <select
            className="form-input"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ height: '38px', fontSize: '0.82rem', padding: '0 10px', minWidth: '150px' }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'All Categories' : c}
              </option>
            ))}
          </select>

          <select
            className="form-input"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            style={{ height: '38px', fontSize: '0.82rem', padding: '0 10px', minWidth: '130px' }}
          >
            {brands.map((b) => (
              <option key={b} value={b}>
                {b === 'ALL' ? 'All Brands' : b}
              </option>
            ))}
          </select>

          <select
            className="form-input"
            value={stockStatusFilter}
            onChange={(e) => setStockStatusFilter(e.target.value)}
            style={{ height: '38px', fontSize: '0.82rem', padding: '0 10px' }}
          >
            <option value="ALL">All Stock Levels</option>
            <option value="LOW_STOCK">Low Stock Alert Only</option>
            <option value="IN_STOCK">Well Stocked</option>
          </select>

          {stockStatusFilter !== 'ALL' && (
            <button
              onClick={() => setStockStatusFilter('ALL')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gold-600)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Spare Parts Inventory Table */}
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
                <th style={{ padding: '12px 14px' }}>Part ID / PN</th>
                <th style={{ padding: '12px 14px' }}>Part Name & Brand</th>
                <th style={{ padding: '12px 14px' }}>Category & HSN</th>
                <th style={{ padding: '12px 14px' }}>Pricing (Buy / Sell)</th>
                <th style={{ padding: '12px 14px' }}>Available Qty</th>
                <th style={{ padding: '12px 14px' }}>Min Stock</th>
                <th style={{ padding: '12px 14px' }}>Stock Control</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredParts.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No spare parts matched your search or filters.
                  </td>
                </tr>
              ) : (
                filteredParts.map((part) => {
                  const isLowStock = (part.availableQuantity || 0) <= (part.minimumStockLevel || 5);

                  return (
                    <tr
                      key={part.id}
                      style={{
                        borderBottom: '1px solid #f5f3ed',
                        backgroundColor: isLowStock ? '#fffdf7' : 'transparent',
                        transition: 'background-color 0.15s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fdfcf9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isLowStock ? '#fffdf7' : 'transparent')}
                    >
                      {/* Part ID & Number */}
                      <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 800, color: 'var(--gold-600)' }}>
                          {part.id}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {part.partNumber}
                        </div>
                      </td>

                      {/* Part Name & Brand */}
                      <td style={{ padding: '14px', maxWidth: '240px' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                          {part.name}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--gold-600)', fontWeight: 700, marginTop: '2px' }}>
                          Brand: {part.brand}
                        </div>
                      </td>

                      {/* Category & HSN */}
                      <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          {part.category}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          HSN: {part.hsnCode || '8708'} • {part.gstPercentage || 18}% GST
                        </div>
                      </td>

                      {/* Pricing */}
                      <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                          {formatCurrency(part.sellingPrice)}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Cost: {formatCurrency(part.purchasePrice || 0)}
                        </div>
                      </td>

                      {/* Available Qty */}
                      <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 10px',
                              borderRadius: '999px',
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              backgroundColor: isLowStock ? '#fee2e2' : '#d1fae5',
                              color: isLowStock ? '#b91c1c' : '#065f46',
                              border: isLowStock ? '1px solid #fecaca' : '1px solid #a7f3d0'
                            }}
                          >
                            {isLowStock && <AlertTriangle size={13} />}
                            <span>{part.availableQuantity} Units</span>
                          </span>
                        </div>
                      </td>

                      {/* Min Stock */}
                      <td style={{ padding: '14px', color: 'var(--text-muted)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                        {part.minimumStockLevel} Units
                      </td>

                      {/* Stock Control (+ Stock In / - Stock Out) */}
                      <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => openStockModal(part, 'IN')}
                            title="Stock In (Add Quantity)"
                            style={{
                              padding: '5px 9px',
                              borderRadius: '6px',
                              border: '1px solid #a7f3d0',
                              backgroundColor: '#ecfdf5',
                              color: '#059669',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                          >
                            <ArrowDownLeft size={13} />
                            <span>Stock In</span>
                          </button>

                          <button
                            onClick={() => openStockModal(part, 'OUT')}
                            title="Stock Out (Consume/Deduct Quantity)"
                            style={{
                              padding: '5px 9px',
                              borderRadius: '6px',
                              border: '1px solid #fed7aa',
                              backgroundColor: '#fff7ed',
                              color: '#c2410c',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                          >
                            <ArrowUpRight size={13} />
                            <span>Stock Out</span>
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => openEditModal(part)}
                            title="Edit Spare Part"
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
                              if (window.confirm(`Delete part "${part.name}"?`)) {
                                deleteSparePart(part.id);
                              }
                            }}
                            title="Delete Spare Part"
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

      {/* Add / Edit Spare Part Modal */}
      {isAddEditModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddEditModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '680px',
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
                <Package size={20} color="var(--gold-500)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {editingPart ? 'Edit Spare Part Record' : 'Add New Spare Part'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddEditModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePart} style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Part ID *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="PRT-101"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Part Name *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Front Ceramic Brake Pad Set"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Part Number / OEM Code *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.partNumber}
                    onChange={(e) => setFormData({ ...formData, partNumber: e.target.value.toUpperCase() })}
                    placeholder="BRM-BP-4412"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Brand / Manufacturer *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Bosch, Brembo, Mobil 1, Castrol..."
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Category
                  </label>
                  <select
                    className="form-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Lubricants & Fluids">Lubricants & Fluids</option>
                    <option value="Filters">Filters</option>
                    <option value="Braking System">Braking System</option>
                    <option value="Ignition & Electrical">Ignition & Electrical</option>
                    <option value="Suspension & Steering">Suspension & Steering</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Engine Parts">Engine Parts</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    HSN Code
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.hsnCode}
                    onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })}
                    placeholder="87083000"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Purchase Cost (₹)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    placeholder="5400"
                    min="0"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    placeholder="8500"
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
                    <option value={18}>18% (Standard Auto)</option>
                    <option value={28}>28% (Airbags, Tyres, AC)</option>
                    <option value={12}>12%</option>
                    <option value={5}>5%</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Initial / Available Qty *
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.availableQuantity}
                    onChange={(e) => setFormData({ ...formData, availableQuantity: e.target.value })}
                    placeholder="10"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Minimum Safety Stock Level *
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.minimumStockLevel}
                    onChange={(e) => setFormData({ ...formData, minimumStockLevel: e.target.value })}
                    placeholder="5"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
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
                  {editingPart ? 'Save Part' : 'Add to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock In / Stock Out Modal */}
      {stockModal.isOpen && stockModal.part && (
        <div className="modal-backdrop" onClick={() => setStockModal({ ...stockModal, isOpen: false })}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '460px',
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: `2px solid ${stockModal.mode === 'IN' ? '#059669' : '#d97706'}`,
              boxShadow: 'var(--shadow-lg)',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {stockModal.mode === 'IN' ? (
                  <ArrowDownLeft size={22} color="#059669" />
                ) : (
                  <ArrowUpRight size={22} color="#d97706" />
                )}
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {stockModal.mode === 'IN' ? 'Stock In (Receive Inventory)' : 'Stock Out (Issue / Consume)'}
                </h3>
              </div>
              <button
                onClick={() => setStockModal({ ...stockModal, isOpen: false })}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#fdfbf7', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginBottom: '18px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {stockModal.part.name}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                PN: {stockModal.part.partNumber} | Current Stock: <strong>{stockModal.part.availableQuantity} units</strong>
              </div>
            </div>

            <form onSubmit={handleStockSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                  {stockModal.mode === 'IN' ? 'Units to Add to Stock *' : 'Units to Deduct from Stock *'}
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={stockModal.quantity}
                  onChange={(e) => setStockModal({ ...stockModal, quantity: Math.max(1, Number(e.target.value)) })}
                  min="1"
                  max={stockModal.mode === 'OUT' ? stockModal.part.availableQuantity : 10000}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                  Reason / Reference Notes
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={stockModal.notes}
                  onChange={(e) => setStockModal({ ...stockModal, notes: e.target.value })}
                  placeholder="e.g. PO-8921 Restock or Bay 3 Job Card"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setStockModal({ ...stockModal, isOpen: false })}
                  className="btn-outline"
                  style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 20px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: stockModal.mode === 'IN' ? '#059669' : '#d97706',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  {stockModal.mode === 'IN' ? 'Confirm Stock In' : 'Confirm Stock Out'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
