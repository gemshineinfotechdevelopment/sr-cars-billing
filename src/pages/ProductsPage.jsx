import React, { useState } from 'react';
import { useBilling } from '../context/useBilling';
import { 
  Plus, 
  Search, 
  Boxes, 
  Edit3, 
  Trash2, 
  LayoutGrid, 
  List, 
  X
} from 'lucide-react';

export default function ProductsPage() {
  const { 
    products, 
    formatCurrency, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    settings 
  } = useBilling();

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [itemForm, setItemForm] = useState({
    name: '',
    category: 'Services',
    sku: '',
    price: '',
    cost: '',
    stock: '',
    warranty: '',
    compatibility: '',
    description: ''
  });

  const categories = ['ALL', 'Vehicles', 'Detailing', 'Services', 'Spare Parts', 'Accessories'];

  const handleOpenAdd = () => {
    setEditingItem(null);
    setItemForm({
      name: '',
      category: 'Services',
      sku: 'SRC-' + Math.floor(1000 + Math.random() * 9000),
      price: '',
      cost: '',
      stock: 10,
      warranty: '1 Year Warranty',
      compatibility: 'Luxury Cars',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingItem(prod);
    setItemForm({
      name: prod.name,
      category: prod.category,
      sku: prod.sku,
      price: prod.price,
      cost: prod.cost,
      stock: prod.stock,
      warranty: prod.warranty || '',
      compatibility: prod.compatibility || '',
      description: prod.description || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!itemForm.name.trim()) {
      alert('Please enter item name');
      return;
    }

    const payload = {
      ...itemForm,
      price: Number(itemForm.price) || 0,
      cost: Number(itemForm.cost) || 0,
      stock: Number(itemForm.stock) || 0
    };

    if (editingItem) {
      updateProduct(editingItem.id, payload);
    } else {
      addProduct(payload);
    }

    setIsModalOpen(false);
  };

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      (p.compatibility && p.compatibility.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q));

    const matchCategory = selectedCategory === 'ALL' || p.category === selectedCategory;

    let matchStock = true;
    if (stockFilter === 'LOW_STOCK') matchStock = p.stock > 0 && p.stock <= 5;
    if (stockFilter === 'IN_STOCK') matchStock = p.stock > 0;
    if (stockFilter === 'OUT_OF_STOCK') matchStock = p.stock === 0;

    return matchSearch && matchCategory && matchStock;
  });

  const totalItemsCount = products.length;
  const totalValuation = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const vehiclesCount = products.filter((p) => p.category === 'Vehicles').reduce((sum, p) => sum + p.stock, 0);

  return (
    <div style={{ padding: '32px 32px 64px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      {/* Page Header in White & Gold */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          marginBottom: '28px'
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              fontWeight: 900,
              letterSpacing: '1px',
              color: 'var(--text-primary)',
              margin: '0 0 4px'
            }}
          >
            Showroom Catalog & Inventory
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage luxury automobiles, detailing packages, workshop service rates, and genuine spare parts.
          </p>
        </div>

        <button className="btn-gold" onClick={handleOpenAdd}>
          <Plus size={18} />
          <span>Add New Product / Service</span>
        </button>
      </div>

      {/* KPI 4-Card Inventory Metrics in White & Gold */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div className="luxury-card" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
            Total Catalog Offerings
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
            {totalItemsCount} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>items</span>
          </div>
        </div>

        <div className="luxury-card luxury-card-gold" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--gold-600)', fontWeight: 800 }}>
            Stock Asset Valuation
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--gold-600)', marginTop: '4px' }}>
            {formatCurrency(totalValuation)}
          </div>
        </div>

        <div className="luxury-card" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
            Showroom Vehicle Fleet
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-blue)', marginTop: '4px' }}>
            {vehiclesCount} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Luxury Cars</span>
          </div>
        </div>

        <div className="luxury-card" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
            Restock Alerts
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: lowStockCount > 0 ? 'var(--status-pending)' : 'var(--status-paid)', marginTop: '4px' }}>
            {lowStockCount} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Low stock items</span>
          </div>
        </div>
      </div>

      {/* Filter and Category Pills Toolbar in White & Gold */}
      <div
        className="luxury-card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius-full)',
                border: selectedCategory === cat ? '1.5px solid var(--gold-500)' : '1px solid var(--border-subtle)',
                background: selectedCategory === cat ? 'var(--gold-subtle)' : '#ffffff',
                color: selectedCategory === cat ? 'var(--gold-600)' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat === 'ALL' ? 'All Catalog' : cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search
              size={15}
              color="var(--gold-500)"
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Search catalog, SKU, vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '32px', height: '36px', fontSize: '0.82rem' }}
            />
          </div>

          <select
            className="form-select"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            style={{ width: 'auto', height: '36px', padding: '4px 10px', fontSize: '0.82rem' }}
          >
            <option value="ALL">All Stock Levels</option>
            <option value="IN_STOCK">In Stock Only</option>
            <option value="LOW_STOCK">Low Stock (&le; 5)</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>

          <div
            style={{
              display: 'flex',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden'
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '6px 10px',
                border: 'none',
                background: viewMode === 'grid' ? 'var(--gold-subtle)' : '#ffffff',
                color: viewMode === 'grid' ? 'var(--gold-600)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
              title="Card Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '6px 10px',
                border: 'none',
                background: viewMode === 'table' ? 'var(--gold-subtle)' : '#ffffff',
                color: viewMode === 'table' ? 'var(--gold-600)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
              title="Data Table View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {filteredProducts.length === 0 ? (
        <div className="luxury-card" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Boxes size={48} style={{ margin: '0 auto 12px', opacity: 0.5, color: 'var(--gold-500)' }} />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '6px', fontWeight: 800 }}>
            No Matching Products or Services
          </h3>
          <p style={{ fontSize: '0.85rem' }}>
            Adjust your search query or category filters.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}
        >
          {filteredProducts.map((p) => {
            const isVehicle = p.category === 'Vehicles';
            const isLowStock = p.stock > 0 && p.stock <= 5;
            const isOutOfStock = p.stock === 0;

            return (
              <div
                key={p.id}
                className="luxury-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: isVehicle ? '1.5px solid var(--gold-500)' : '1px solid var(--border-subtle)',
                  background: isVehicle
                    ? 'linear-gradient(160deg, #fdfbf7 0%, #ffffff 60%)'
                    : '#ffffff'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#fbf7ee',
                        color: '#85580a',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {p.category}
                    </span>

                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.74rem',
                        color: 'var(--gold-600)',
                        fontWeight: 700
                      }}
                    >
                      {p.sku}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.08rem',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      marginBottom: '8px',
                      lineHeight: 1.3
                    }}
                  >
                    {p.name}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: '16px',
                      minHeight: '38px'
                    }}
                  >
                    {p.description || 'Verified automotive component and certified showroom specifications.'}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {p.compatibility && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          background: 'rgba(37, 99, 235, 0.08)',
                          color: 'var(--accent-blue)',
                          borderRadius: '4px',
                          border: '1px solid rgba(37, 99, 235, 0.2)',
                          fontWeight: 600
                        }}
                      >
                        {p.compatibility}
                      </span>
                    )}

                    {p.warranty && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          background: 'rgba(5, 150, 105, 0.08)',
                          color: 'var(--status-paid)',
                          borderRadius: '4px',
                          border: '1px solid rgba(5, 150, 105, 0.2)',
                          fontWeight: 600
                        }}
                      >
                        {p.warranty}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Showroom Price
                    </div>
                    <div
                      style={{
                        fontSize: '1.3rem',
                        fontWeight: 900,
                        color: 'var(--gold-600)',
                        fontFamily: 'var(--font-sans)'
                      }}
                    >
                      {formatCurrency(p.price)}
                    </div>
                    <div style={{ fontSize: '0.74rem', marginTop: '2px' }}>
                      {isOutOfStock ? (
                        <span style={{ color: 'var(--status-overdue)', fontWeight: 700 }}>Out of Stock</span>
                      ) : isLowStock ? (
                        <span style={{ color: 'var(--status-pending)', fontWeight: 700 }}>Only {p.stock} units left!</span>
                      ) : (
                        <span style={{ color: 'var(--status-paid)', fontWeight: 700 }}>{p.stock} in stock</span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      className="btn-icon"
                      title="Edit Item Details"
                      onClick={() => handleOpenEdit(p)}
                      style={{ width: '34px', height: '34px' }}
                    >
                      <Edit3 size={15} />
                    </button>

                    <button
                      className="btn-icon"
                      title="Delete from Catalog"
                      onClick={() => {
                        if (window.confirm(`Delete "${p.name}" from catalog?`)) {
                          deleteProduct(p.id);
                        }
                      }}
                      style={{ width: '34px', height: '34px', color: 'var(--status-overdue)' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="luxury-card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Code / SKU</th>
                <th>Item / Vehicle Name</th>
                <th>Category</th>
                <th>Vehicle Fitment</th>
                <th>Stock Qty</th>
                <th>Selling Price</th>
                <th>Cost Base</th>
                <th>Warranty</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--gold-600)', fontWeight: 700 }}>
                    {p.sku}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.description?.slice(0, 50)}...</div>
                  </td>
                  <td>
                    <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>{p.category}</span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {p.compatibility || 'Universal'}
                  </td>
                  <td>
                    <span
                      style={{
                        fontWeight: 700,
                        color: p.stock === 0 ? 'var(--status-overdue)' : p.stock <= 5 ? 'var(--status-pending)' : 'var(--status-paid)'
                      }}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--gold-600)', fontFamily: 'var(--font-sans)', fontSize: '0.95rem' }}>
                      {formatCurrency(p.price)}
                    </strong>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontFamily: 'var(--font-sans)' }}>
                    {p.cost ? formatCurrency(p.cost) : '—'}
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {p.warranty || 'Standard'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        className="btn-icon"
                        title="Edit Item"
                        onClick={() => handleOpenEdit(p)}
                        style={{ width: '32px', height: '32px' }}
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        className="btn-icon"
                        title="Delete Item"
                        onClick={() => {
                          if (window.confirm(`Delete "${p.name}"?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        style={{ width: '32px', height: '32px', color: 'var(--status-overdue)' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '680px', width: '95%', backgroundColor: '#ffffff' }}
          >
            <div
              style={{
                padding: '22px 26px',
                borderBottom: '1.5px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(180deg, #fdfbf7 0%, #ffffff 100%)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'var(--gold-subtle)',
                    border: '1.5px solid var(--border-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold-600)'
                  }}
                >
                  <Boxes size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    {editingItem ? 'Edit Showroom Offering' : 'Add New Product / Vehicle Offering'}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Add specification, billing rate, warranty, and inventory units
                  </span>
                </div>
              </div>

              <button onClick={() => setIsModalOpen(false)} className="btn-icon" style={{ width: '30px', height: '30px' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveItem} style={{ padding: '24px 26px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="form-label">Item / Service / Vehicle Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. BMW M340i xDrive Sedan or Kavaca 9H Ceramic Coating"
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={itemForm.category}
                      onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                    >
                      <option value="Vehicles">Vehicles (Luxury Cars)</option>
                      <option value="Detailing">Detailing & PPF</option>
                      <option value="Services">Services & Repairs</option>
                      <option value="Spare Parts">Spare Parts</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">SKU / OEM Code</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. AUTO-BMW-M340I"
                      value={itemForm.sku}
                      onChange={(e) => setItemForm({ ...itemForm, sku: e.target.value })}
                      style={{ fontFamily: 'var(--font-mono)' }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                  <div>
                    <label className="form-label">Selling Price ({settings.currency}) *</label>
                    <input
                      type="number"
                      className="form-input"
                      min="0"
                      placeholder="7490000"
                      value={itemForm.price}
                      onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Cost / Wholesale Base</label>
                    <input
                      type="number"
                      className="form-input"
                      min="0"
                      placeholder="6850000"
                      value={itemForm.cost}
                      onChange={(e) => setItemForm({ ...itemForm, cost: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">Stock Units / Qty *</label>
                    <input
                      type="number"
                      className="form-input"
                      min="0"
                      placeholder="1"
                      value={itemForm.stock}
                      onChange={(e) => setItemForm({ ...itemForm, stock: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
                  <div>
                    <label className="form-label">Vehicle Compatibility / Model Year</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. BMW G20 3-Series / 2024+"
                      value={itemForm.compatibility}
                      onChange={(e) => setItemForm({ ...itemForm, compatibility: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">Warranty Details</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 3 Years BSI Plus"
                      value={itemForm.warranty}
                      onChange={(e) => setItemForm({ ...itemForm, warranty: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Description & Technical Specifications</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="Provide engine details, material composition, application layers, or inclusions..."
                    value={itemForm.description}
                    onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  marginTop: '24px',
                  paddingTop: '18px',
                  borderTop: '1px solid var(--border-subtle)'
                }}
              >
                <button type="button" className="btn-outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-gold">
                  <span>{editingItem ? 'Save Updates' : 'Add to Catalog'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
