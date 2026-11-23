import React, { useState, useEffect, useMemo } from 'react';
import { useBilling } from '../../context/useBilling';
import { 
  Plus, 
  Search, 
  Menu,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const { 
    setIsInvoiceModalOpen, 
    setInvoiceToEdit, 
    invoices, 
    products, 
    setActiveTab,
    setSelectedInvoiceForView
  } = useBilling();

  const [currentTime, setCurrentTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }) + ' • ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Quick universal search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return { invoices: [], products: [] };
    }
    const q = searchQuery.toLowerCase();
    
    const matchedInvoices = invoices.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.customer.name.toLowerCase().includes(q) ||
        inv.vehicle.regNumber.toLowerCase().includes(q) ||
        inv.vehicle.makeModel.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedProducts = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    ).slice(0, 4);

    return {
      invoices: matchedInvoices,
      products: matchedProducts
    };
  }, [searchQuery, invoices, products]);

  const handleOpenNewInvoice = () => {
    setInvoiceToEdit(null);
    setIsInvoiceModalOpen(true);
  };

  const overdueCount = invoices.filter((i) => i.status === 'Overdue').length;

  return (
    <header
      className="top-navbar no-print"
      style={{
        height: '70px',
        backgroundColor: '#ffffff',
        borderBottom: '1.5px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        position: 'sticky',
        top: 0,
        zIndex: 35,
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Left: Mobile Toggle & Quick Universal Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, maxWidth: '480px' }}>
        <button
          className="btn-icon mobile-menu-btn"
          onClick={onToggleSidebar}
          style={{ display: 'none' }}
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        {/* Global Search Bar */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search
            size={17}
            color="var(--gold-500)"
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search invoices, clients, vehicles (VIN/Reg), products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            style={{
              paddingLeft: '40px',
              height: '40px',
              fontSize: '0.85rem',
              borderRadius: 'var(--radius-full)',
              background: '#fdfbf7',
              borderColor: 'var(--border-subtle)'
            }}
          />

          {/* Quick Search Dropdown */}
          {isSearchOpen && searchQuery.trim() && (
            <div
              style={{
                position: 'absolute',
                top: '48px',
                left: 0,
                right: 0,
                backgroundColor: '#ffffff',
                border: '1.5px solid var(--border-gold)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '12px',
                zIndex: 100,
                maxHeight: '380px',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--gold-600)', fontWeight: 800 }}>
                  Search Results
                </span>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  Close
                </button>
              </div>

              {/* Invoices match */}
              {searchResults.invoices.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gold-600)', fontWeight: 700, padding: '4px 8px' }}>
                    Invoices & Vehicles
                  </div>
                  {searchResults.invoices.map((inv) => (
                    <div
                      key={inv.id}
                      onClick={() => {
                        setSelectedInvoiceForView(inv);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background 0.2s',
                        fontSize: '0.84rem'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fdfbf7')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div>
                        <strong>{inv.invoiceNumber}</strong> • {inv.customer.name}
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {inv.vehicle.makeModel} ({inv.vehicle.regNumber})
                        </div>
                      </div>
                      <span className={`badge badge-${inv.status.toLowerCase()}`}>{inv.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Products match */}
              {searchResults.products.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gold-600)', fontWeight: 700, padding: '4px 8px' }}>
                    Catalog & Parts
                  </div>
                  {searchResults.products.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setActiveTab('products');
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background 0.2s',
                        fontSize: '0.84rem'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fdfbf7')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div>
                        <strong>{p.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {p.sku} • {p.category}
                        </div>
                      </div>
                      <span style={{ color: 'var(--gold-600)', fontWeight: 700, fontSize: '0.82rem' }}>
                        ₹ {p.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.invoices.length === 0 && searchResults.products.length === 0 && (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No matches found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Actions: Clock, Overdue Notification, Create Invoice */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Dealership Clock */}
        <div
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            fontWeight: 600,
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: '#ffffff',
            border: '1px solid var(--border-gold)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Sparkles size={14} color="var(--gold-500)" />
          {currentTime || 'SR Live'}
        </div>

        {/* Overdue alert indicator */}
        {overdueCount > 0 && (
          <button
            onClick={() => setActiveTab('invoices')}
            className="btn-icon"
            title={`${overdueCount} Overdue Invoices Requiring Attention`}
            style={{ position: 'relative', color: 'var(--status-overdue)', borderColor: 'var(--status-overdue-border)' }}
          >
            <ShieldAlert size={19} />
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'var(--status-overdue)',
                color: '#fff',
                fontSize: '0.68rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {overdueCount}
            </span>
          </button>
        )}

        {/* Main Action: Create Invoice Button */}
        <button
          onClick={handleOpenNewInvoice}
          className="btn-gold"
          style={{ padding: '8px 20px', fontSize: '0.88rem' }}
        >
          <Plus size={18} />
          <span>Create Invoice</span>
        </button>
      </div>
    </header>
  );
}
