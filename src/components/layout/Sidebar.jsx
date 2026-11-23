import React from 'react';
import { useBilling } from '../../context/useBilling';
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  Package, 
  ReceiptText, 
  BarChart3, 
  Settings as SettingsIcon,
  Crown,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { 
    activeTab, 
    setActiveTab, 
    customers, 
    services, 
    spareParts, 
    invoices, 
    settings 
  } = useBilling();

  const pendingInvoicesCount = invoices.filter(
    (i) => i.status === 'Pending' || i.status === 'Unpaid' || i.status === 'Partial'
  ).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
      badge: customers.length
    },
    {
      id: 'services',
      label: 'Services',
      icon: Wrench,
      badge: services.filter((s) => s.status === 'Active').length
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      badge: spareParts.length
    },
    {
      id: 'invoices',
      label: 'Invoice & Billing',
      icon: ReceiptText,
      badge: pendingInvoicesCount > 0 ? `${pendingInvoicesCount} Due` : invoices.length
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'settings',
      label: 'Settings',
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
            padding: '24px 22px 18px',
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
              Automotive Center
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div style={{ flex: 1, padding: '20px 14px', overflowY: 'auto' }}>
          <div
            style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
              color: 'var(--gold-600)',
              marginBottom: '10px',
              paddingLeft: '12px'
            }}
          >
            Garage Management System
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
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
                    padding: '11px 13px',
                    borderRadius: 'var(--radius-md)',
                    border: isActive
                      ? '1.5px solid var(--gold-500)'
                      : '1px solid transparent',
                    background: isActive
                      ? 'linear-gradient(90deg, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.04) 100%)'
                      : 'transparent',
                    color: isActive ? 'var(--gold-600)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.9rem',
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
                    size={19}
                    color={isActive ? 'var(--gold-500)' : 'currentColor'}
                  />
                  <span style={{ flex: 1 }}>{item.label}</span>

                  {item.badge !== null && (
                    <span
                      style={{
                        padding: '2px 7px',
                        borderRadius: '999px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        background: item.badgeWarning 
                          ? '#fef3c7' 
                          : isActive 
                            ? 'var(--gold-500)' 
                            : 'rgba(212,175,55,0.14)',
                        color: item.badgeWarning 
                          ? '#b45309' 
                          : isActive 
                            ? '#ffffff' 
                            : 'var(--gold-600)',
                        border: item.badgeWarning ? '1px solid #fde68a' : 'none'
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
        </div>

        {/* Footer Info */}
        <div
          style={{
            padding: '14px 18px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: '#fdfbf7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              GST: {settings.gstin || '36AABCU9603R1ZM'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {settings.phone}
            </div>
          </div>
          <ShieldCheck size={19} color="var(--gold-500)" title="Certified Automotive Billing" />
        </div>
      </aside>
    </>
  );
}
