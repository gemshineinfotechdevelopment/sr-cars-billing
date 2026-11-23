import React from 'react';
import { useBilling } from '../../context/useBilling';
import { Plus, Menu } from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const { 
    setIsInvoiceModalOpen, 
    setInvoiceToEdit 
  } = useBilling();

  const handleOpenNewInvoice = () => {
    setInvoiceToEdit(null);
    setIsInvoiceModalOpen(true);
  };

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
      {/* Left: Mobile Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          className="btn-icon mobile-menu-btn"
          onClick={onToggleSidebar}
          style={{ display: 'none' }}
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Right: Quick New Invoice CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
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
