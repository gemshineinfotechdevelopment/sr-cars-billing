import React from 'react';
import { useBilling } from '../../context/useBilling';
import { 
  LayoutDashboard, 
  ReceiptText, 
  Boxes, 
  BarChart3, 
  Settings as SettingsIcon,
  Crown,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { activeTab, setActiveTab, invoices, products, settings } = useBilling();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: ReceiptText,
      badge: invoices.length
    },
    {
      id: 'products',
      label: 'Products & Inventory',
      icon: Boxes,
      badge: products.length
    },
    {
      id: 'reports',
      label: 'Financial Reports',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'settings',
      label: 'Dealership Settings',
      icon: SettingsIcon,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="modal-backdrop no-print" 
          style={{ zIndex: 40 }}
          onClick={onClose} 
        />
      )}

      <aside
        className={`sidebar no-print ${isOpen ? 'open' : ''}`}
        style={{
          width: '280px',
          backgroundColor: '#ffffff',
          borderRight: '1.5px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: 'var(--shadow-sm)',
          transition: 'transform 0.3s ease'
        }}
      >
        {/* Majestic Brand Header in White & Gold */}
        <div
          style={{
            padding: '26px 24px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            background: 'linear-gradient(180deg, #fdfcf9 0%, #ffffff 100%)'
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ffffff 0%, #fbf7ee 100%)',
              border: '2px solid var(--gold-500)',
              boxShadow: '0 4px 16px var(--gold-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <Crown size={22} color="var(--gold-500)" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: '1.38rem',
                  letterSpacing: '2.5px',
                  background: 'linear-gradient(135deg, #1a1610 30%, #b8860b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {settings.dealershipName || 'SR CARS'}
              </span>
            </div>
            <div
              style={{
                fontSize: '0.68rem',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                color: 'var(--gold-600)',
                fontWeight: 700,
                marginTop: '1px'
              }}
            >
              Luxury Automotives
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div style={{ flex: 1, padding: '24px 16px', overflowY: 'auto' }}>
          <div
            style={{
              fontSize: '0.7rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
              color: 'var(--gold-600)',
              marginBottom: '12px',
              paddingLeft: '12px'
            }}
          >
            Billing & Operations
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onClose) onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: isActive
                      ? '1px solid var(--gold-500)'
                      : '1px solid transparent',
                    background: isActive
                      ? 'linear-gradient(90deg, rgba(212,175,55,0.14) 0%, rgba(212,175,55,0.03) 100%)'
                      : 'transparent',
                    color: isActive ? 'var(--gold-600)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.background = '#fdfbf7';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <Icon
                    size={20}
                    color={isActive ? 'var(--gold-500)' : 'currentColor'}
                  />
                  <span style={{ flex: 1 }}>{item.label}</span>

                  {item.badge !== null && (
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: isActive ? 'var(--gold-500)' : 'rgba(212,175,55,0.15)',
                        color: isActive ? '#ffffff' : 'var(--gold-600)'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight size={15} color="var(--gold-500)" />}
                </button>
              );
            })}
          </nav>

          {/* Luxury Showcase Callout in White & Gold */}
          <div
            style={{
              marginTop: '32px',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(145deg, #ffffff 0%, #fbf8f1 100%)',
              border: '1px solid var(--border-gold)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={16} color="var(--gold-500)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gold-600)' }}>
                Certified Studio
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Automotive invoices comply with GST regulations and OEM warranty standards.
            </p>
          </div>
        </div>

        {/* Footer info in clean White & Gold */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: '#fdfbf7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              GST: {settings.gstin?.slice(0, 8)}...
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {settings.phone}
            </div>
          </div>
          <ShieldCheck size={20} color="var(--gold-500)" title="Verified Dealership System" />
        </div>
      </aside>
    </>
  );
}
