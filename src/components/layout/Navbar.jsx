import React, { useState, useEffect, useMemo } from 'react';
import { useBilling } from '../../context/useBilling';
import { 
  Plus, 
  Search, 
  Menu,
  Clock,
  Sparkles,
  Users,
  Wrench,
  Package,
  ReceiptText,
  AlertTriangle
} from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const { 
    setIsInvoiceModalOpen, 
    setInvoiceToEdit, 
    invoices, 
    customers,
    services,
    spareParts, 
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

  // Universal search across Invoices, Customers, Services & Spare Parts
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return { invoices: [], customers: [], services: [], spareParts: [] };
    }
    const q = searchQuery.toLowerCase();
    
    const matchedInvoices = invoices.filter(
      (inv) =>
        inv.invoiceNumber?.toLowerCase().includes(q) ||
        inv.customer?.name?.toLowerCase().includes(q) ||
        inv.customer?.phone?.includes(q) ||
        inv.vehicle?.regNumber?.toLowerCase().includes(q) ||
        inv.vehicle?.model?.toLowerCase().includes(q) ||
        inv.jobCardNumber?.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedCustomers = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.vehicles?.some((v) => v.vehicleNumber.toLowerCase().includes(q) || v.model.toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedServices = services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedSpareParts = spareParts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.partNumber.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    ).slice(0, 4);

    return {
      invoices: matchedInvoices,
      customers: matchedCustomers,
      services: matchedServices,
      spareParts: matchedSpareParts
    };
  }, [searchQuery, invoices, customers, services, spareParts]);

  const hasAnyResults = 
    searchResults.invoices.length > 0 || 
    searchResults.customers.length > 0 || 
    searchResults.services.length > 0 || 
    searchResults.spareParts.length > 0;

  const handleOpenNewInvoice = () => {
    setInvoiceToEdit(null);
    setIsInvoiceModalOpen(true);
  };

  const lowStockCount = spareParts.filter(
    (p) => (p.availableQuantity || 0) <= (p.minimumStockLevel || 5)
  ).length;

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, maxWidth: '520px' }}>
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
            placeholder="Search customers, vehicles, services, products, invoices..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            style={{
              paddingLeft: '40px',
              height: '40px',
              fontSize: '0.84rem',
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
                maxHeight: '420px',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--gold-600)', fontWeight: 800 }}>
                  Quick Search Results
                </span>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  Close
                </button>
              </div>

              {!hasAnyResults && (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No matches found for "{searchQuery}"
                </div>
              )}

              {/* Invoices match */}
              {searchResults.invoices.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--gold-600)', fontWeight: 700, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ReceiptText size={14} /> Invoices ({searchResults.invoices.length})
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
                        padding: '8px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.82rem',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--gold-100)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div>
                        <strong>{inv.invoiceNumber}</strong> • {inv.customer?.name}
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {inv.vehicle?.regNumber} • {inv.vehicle?.brand} {inv.vehicle?.model}
                        </div>
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--gold-600)' }}>
                        ₹{(inv.grandTotal || inv.totalAmount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Customers match */}
              {searchResults.customers.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--gold-600)', fontWeight: 700, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={14} /> Customers ({searchResults.customers.length})
                  </div>
                  {searchResults.customers.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setActiveTab('customers');
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.82rem',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--gold-100)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div>
                        <strong>{c.name}</strong> • {c.phone}
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {c.vehicles?.map((v) => v.vehicleNumber).join(', ') || 'No vehicles registered'}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--gold-600)', fontWeight: 700 }}>
                        {c.id}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Products match */}
              {searchResults.spareParts.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--gold-600)', fontWeight: 700, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Package size={14} /> Products ({searchResults.spareParts.length})
                  </div>
                  {searchResults.spareParts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setActiveTab('products');
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.82rem',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--gold-100)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div>
                        <strong>{p.name}</strong> • {p.partNumber}
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Brand: {p.brand} | In Stock: {p.availableQuantity} units
                        </div>
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--gold-600)' }}>
                        ₹{p.sellingPrice?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Services match */}
              {searchResults.services.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--gold-600)', fontWeight: 700, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Wrench size={14} /> Services ({searchResults.services.length})
                  </div>
                  {searchResults.services.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setActiveTab('services');
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.82rem',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--gold-100)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div>
                        <strong>{s.name}</strong> • {s.category}
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Duration: {s.estimatedDuration}
                        </div>
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--gold-600)' }}>
                        ₹{s.price?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions, Date & Quick New Invoice */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        {lowStockCount > 0 && (
          <button
            onClick={() => setActiveTab('products')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '999px',
              border: '1px solid #fde68a',
              backgroundColor: '#fef3c7',
              color: '#b45309',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <AlertTriangle size={15} />
            <span>{lowStockCount} Products Low in Stock</span>
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
          <Clock size={16} color="var(--gold-500)" />
          <span style={{ fontWeight: 600 }}>{currentTime}</span>
        </div>

        {/* Generate Invoice Primary CTA */}
        <button
          onClick={handleOpenNewInvoice}
          className="btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
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
          <Plus size={17} />
          <span>New Invoice</span>
        </button>
      </div>
    </header>
  );
}
