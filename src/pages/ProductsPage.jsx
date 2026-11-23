import React, { useState } from 'react';
import { useBilling } from '../context/useBilling';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X
} from 'lucide-react';

export default function ProductsPage() {
  const { 
    spareParts, 
    addSparePart, 
    updateSparePart, 
    deleteSparePart, 
    formatCurrency 
  } = useBilling();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [brandFilter, setBrandFilter] = useState('ALL');

  // Add / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const initialForm = {
    id: '',
    name: '',
    partNumber: '',
    brand: 'Bosch',
    category: 'Filters',
    sellingPrice: '',
    availableQuantity: '',
    gstPercentage: 18
  };

  const [formData, setFormData] = useState(initialForm);

  // Distinct categories & brands
  const categories = ['ALL', ...Array.from(new Set(spareParts.map((p) => p.category)))];
  const brands = ['ALL', ...Array.from(new Set(spareParts.map((p) => p.brand)))];

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      id: `PRD-${String(spareParts.length + 101)}`,
      name: '',
      partNumber: '',
      brand: 'Bosch',
      category: 'Filters',
      sellingPrice: '',
      availableQuantity: '',
      gstPercentage: 18
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      id: prod.id,
      name: prod.name,
      partNumber: prod.partNumber || '',
      brand: prod.brand || 'OEM',
      category: prod.category || 'General',
      sellingPrice: prod.sellingPrice || '',
      availableQuantity: prod.availableQuantity || 0,
      gstPercentage: prod.gstPercentage || 18
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sellingPrice) {
      alert('Please fill in Product Name and Selling Price.');
      return;
    }

    if (editingProduct) {
      updateSparePart(editingProduct.id, formData);
    } else {
      addSparePart(formData);
    }
    setIsModalOpen(false);
  };

  // Filtered Products
  const filteredProducts = spareParts.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(q) ||
      (p.partNumber && p.partNumber.toLowerCase().includes(q)) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      p.id.toLowerCase().includes(q);

    if (!matchSearch) return false;

    const matchCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    const matchBrand = brandFilter === 'ALL' || p.brand === brandFilter;

    return matchCategory && matchBrand;
  });

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
              Store & Catalog
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
            Products Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
            Add, update and manage automotive products, brand catalog, selling prices and quantities.
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
          <span>Add Product</span>
        </button>
      </div>

      {/* KPI Overview Pills */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '22px', flexWrap: 'wrap' }}>
        <div style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem' }}>
          <Package size={16} color="var(--gold-500)" />
          <span style={{ color: 'var(--text-muted)' }}>Total Products:</span>
          <strong>{spareParts.length}</strong>
        </div>

        <div style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Total Brands:</span>
          <strong>{brands.length - 1} Brands</strong>
        </div>
      </div>

      {/* Search & Filter Bar */}
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
            placeholder="Search products by name, code, brand or category..."
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
        </div>
      </div>

      {/* Products Table */}
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
                <th style={{ padding: '12px 16px' }}>Product ID</th>
                <th style={{ padding: '12px 16px' }}>Product Name & Code</th>
                <th style={{ padding: '12px 16px' }}>Brand</th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>Selling Price</th>
                <th style={{ padding: '12px 16px' }}>Available Quantity</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr
                    key={prod.id}
                    style={{ borderBottom: '1px solid #f5f3ed', transition: 'background-color 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fdfcf9')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* ID */}
                    <td style={{ padding: '14px 16px', fontWeight: 800, color: 'var(--gold-600)', whiteSpace: 'nowrap' }}>
                      {prod.id}
                    </td>

                    {/* Name & Code */}
                    <td style={{ padding: '14px 16px', maxWidth: '280px' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                        {prod.name}
                      </div>
                      {prod.partNumber && (
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                          Code: {prod.partNumber}
                        </div>
                      )}
                    </td>

                    {/* Brand */}
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: '#fbf7ee',
                          border: '1px solid var(--border-gold)',
                          color: 'var(--gold-600)',
                          fontSize: '0.76rem',
                          fontWeight: 700
                        }}
                      >
                        {prod.brand || 'OEM'}
                      </span>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {prod.category}
                    </td>

                    {/* Price */}
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--text-primary)' }}>
                        {formatCurrency(prod.sellingPrice)}
                      </div>
                    </td>

                    {/* Quantity */}
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: '999px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          backgroundColor: '#ecfdf5',
                          color: '#065f46',
                          border: '1px solid #a7f3d0'
                        }}
                      >
                        {prod.availableQuantity || 0} Units
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          onClick={() => openEditModal(prod)}
                          title="Edit Product"
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
                            if (window.confirm(`Delete product "${prod.name}"?`)) {
                              deleteSparePart(prod.id);
                            }
                          }}
                          title="Delete Product"
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '620px',
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
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Product ID *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="PRD-101"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Fully Synthetic Engine Oil 5W-40"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Product Code / SKU
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.partNumber}
                    onChange={(e) => setFormData({ ...formData, partNumber: e.target.value.toUpperCase() })}
                    placeholder="e.g. CAS-5W40-4L"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Brand *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Castrol, Bosch, Mobil 1..."
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
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
                    <option value="General">General</option>
                  </select>
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
                    placeholder="4200"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                  Available Quantity / Stock *
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
                  {editingProduct ? 'Save Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
