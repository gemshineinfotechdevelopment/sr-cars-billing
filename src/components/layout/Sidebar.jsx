import React, { useState } from 'react';
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
  ShieldCheck,
  Menu
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { 
    activeTab, 
    setActiveTab, 
    isInvoiceModalOpen,
    setIsInvoiceModalOpen,
    customers, 
    services, 
    spareParts, 
    invoices, 
    settings 
  } = useBilling();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sr_cars_sidebar_collapsed') === 'true';
  });

  const handleToggleSidebar = () => {
    if (window.innerWidth <= 900) {
      if (onClose) onClose();
    } else {
      setIsCollapsed((prev) => {
        const next = !prev;
        localStorage.setItem('sr_cars_sidebar_collapsed', String(next));
        return next;
      });
    }
  };

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
      badge: invoices.length
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
        className={`sidebar no-print ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}
        style={{
          width: isCollapsed ? '76px' : '280px',
          backgroundColor: '#ffffff',
          borderRight: '1.5px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: 'var(--shadow-sm)',
          transition: 'width 0.25s ease, transform 0.3s ease'
        }}
      >
        {/* Majestic Brand Header in Pure White & Blue */}
        <div
          style={{
            padding: isCollapsed ? '18px 10px' : '20px 18px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            background: '#ffffff',
            gap: '10px'
          }}
        >
          {!isCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, overflow: 'hidden' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '11px',
                  background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
                  border: '2px solid var(--blue-500)',
                  boxShadow: '0 4px 14px var(--blue-glow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Crown size={20} color="var(--blue-500)" />
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 900,
                      fontSize: '1.25rem',
                      letterSpacing: '2px',
                      background: 'linear-gradient(135deg, #0f172a 30%, #2563eb 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {settings.dealershipName || 'SR CARS'}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '0.66rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1.3px',
                    color: 'var(--blue-600)',
                    fontWeight: 700,
                    marginTop: '1px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Automotive Center
                </div>
              </div>
            </div>
          )}

          {/* Hamburger Menu Button */}
          <button
            type="button"
            onClick={handleToggleSidebar}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label="Toggle Sidebar Navigation"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '1px solid var(--border-blue, #2563eb)',
              backgroundColor: isCollapsed ? 'var(--blue-100)' : '#ffffff',
              color: 'var(--blue-600)',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--blue-100)';
            }}
            onMouseLeave={(e) => {
              if (!isCollapsed) e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Navigation Section */}
        <div style={{ flex: 1, padding: isCollapsed ? '16px 8px' : '20px 14px', overflowY: 'auto' }}>
          {!isCollapsed && (
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
          )}

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = !isInvoiceModalOpen && activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsInvoiceModalOpen(false);
                    if (onClose) onClose();
                  }}
                  title={item.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    gap: isCollapsed ? '0px' : '12px',
                    width: '100%',
                    padding: isCollapsed ? '11px 0' : '11px 13px',
                    borderRadius: 'var(--radius-md)',
                    border: isActive
                      ? '1.5px solid var(--gold-500)'
                      : '1px solid transparent',
                    background: isActive
                      ? 'linear-gradient(90deg, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0.03) 100%)'
                      : 'transparent',
                    color: isActive ? 'var(--gold-600)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.background = '#f8fafc';
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
                  {!isCollapsed && <span style={{ flex: 1 }}>{item.label}</span>}

                  {!isCollapsed && item.badge !== null && (
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
                            : 'rgba(37,99,235,0.12)',
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
                  {!isCollapsed && isActive && <ChevronRight size={15} color="var(--gold-500)" />}

                  {isCollapsed && item.badge !== null && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '6px',
                        right: '8px',
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--gold-500)'
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Info */}
        <div
          style={{
            padding: isCollapsed ? '14px 8px' : '14px 18px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between'
          }}
        >
          {!isCollapsed && (
            <div>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                GST: {settings.gstin || '36AABCU9603R1ZM'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {settings.phone}
              </div>
            </div>
          )}
          <ShieldCheck
            size={19}
            color="var(--gold-500)"
            title={`Certified Automotive Billing${settings.gstin ? ` • GST: ${settings.gstin}` : ''}`}
          />
        </div>
      </aside>
    </>
  );
}
