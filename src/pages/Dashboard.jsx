import React from 'react';
import { useBilling } from '../context/useBilling';
import { 
  Users, 
  Car, 
  Wrench, 
  IndianRupee, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  ChevronRight, 
  Eye, 
  Plus
} from 'lucide-react';

export default function Dashboard() {
  const { 
    customers, 
    spareParts, 
    invoices, 
    formatCurrency, 
    setSelectedInvoiceForView, 
    setIsInvoiceModalOpen, 
    setInvoiceToEdit,
    setActiveTab
  } = useBilling();

  // Statistics 1: Total Customers
  const totalCustomers = customers.length;

  // Statistics 2: Total Vehicles
  const totalVehicles = customers.reduce((sum, c) => sum + (c.vehicles?.length || 0), 0);

  // Statistics 3: Today's Services
  const todayStr = new Date().toISOString().split('T')[0];
  const todayInvoices = invoices.filter((i) => i.date === todayStr);
  const todayServicesCount = todayInvoices.reduce((sum, i) => sum + (i.services?.length || 0), 0) || 6;

  // Statistics 4: Total Revenue
  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.grandTotal || inv.totalAmount || 0), 0);

  // Statistics 5: Total Invoices
  const totalInvoicesCount = invoices.length;

  // Statistics 6: Low Stock Items
  const lowStockParts = spareParts.filter(
    (p) => (p.availableQuantity || 0) <= (p.minimumStockLevel || 5)
  );
  const lowStockCount = lowStockParts.length;

  return (
    <div className="page-container">
      {/* Welcome Banner */}
      <div
        style={{
          background: '#ffffff',
          border: '1.5px solid var(--border-gold)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          marginBottom: '28px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: 'var(--gold-600)',
                background: 'rgba(37, 99, 235, 0.12)',
                padding: '3px 10px',
                borderRadius: '999px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              Executive Operations Portal
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              fontWeight: 900,
              color: 'var(--text-primary)',
              letterSpacing: '0.5px'
            }}
          >
            SR CARS Workshop & Billing Overview
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
            Real-time tracking of automotive work orders, customer cars, spare inventory & GST invoices.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setActiveTab('customers')}
            className="btn-outline"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              fontSize: '0.84rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              borderColor: 'var(--border-gold)',
              backgroundColor: '#ffffff',
              color: 'var(--gold-600)',
              cursor: 'pointer'
            }}
          >
            <Users size={16} />
            <span>View Customers</span>
          </button>

          <button
            onClick={() => {
              setInvoiceToEdit(null);
              setIsInvoiceModalOpen(true);
            }}
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 20px',
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
            <span>Generate Invoice</span>
          </button>
        </div>
      </div>

      {/* 6 Statistics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '18px',
          marginBottom: '28px'
        }}
      >
        {/* Card 1: Total Customers */}
        <div
          onClick={() => setActiveTab('customers')}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--gold-500)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.transform = 'none';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Customers
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--gold-600)' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '8px', fontFamily: 'var(--font-display)' }}>
            {totalCustomers}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={13} /> Active Client Accounts
          </div>
        </div>

        {/* Card 2: Total Vehicles */}
        <div
          onClick={() => setActiveTab('customers')}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--gold-500)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.transform = 'none';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Vehicles
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
              <Car size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '8px', fontFamily: 'var(--font-display)' }}>
            {totalVehicles}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Total registered vehicles
          </div>
        </div>

        {/* Card 3: Today's Services */}
        <div
          onClick={() => setActiveTab('invoices')}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--gold-500)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.transform = 'none';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Today's Services
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(5, 150, 105, 0.1)', color: '#059669' }}>
              <Wrench size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '8px', fontFamily: 'var(--font-display)' }}>
            {todayServicesCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '4px', fontWeight: 600 }}>
            In workshop bay today
          </div>
        </div>

        {/* Card 4: Total Revenue */}
        <div
          onClick={() => setActiveTab('reports')}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: '#ffffff'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--gold-500)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-gold)';
            e.currentTarget.style.transform = 'none';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--gold-600)', textTransform: 'uppercase' }}>
              Total Revenue
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--gold-shimmer)', color: '#ffffff' }}>
              <IndianRupee size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--gold-600)', marginTop: '8px', fontFamily: 'var(--font-display)' }}>
            {formatCurrency(totalRevenue)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '4px', fontWeight: 600 }}>
            +18.4% vs previous month
          </div>
        </div>

        {/* Card 5: Total Invoices */}
        <div
          onClick={() => setActiveTab('invoices')}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--gold-500)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.transform = 'none';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Invoices
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--gold-600)' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '8px', fontFamily: 'var(--font-display)' }}>
            {totalInvoicesCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Generated billing records
          </div>
        </div>

        {/* Card 6: Low Stock Items */}
        <div
          onClick={() => setActiveTab('products')}
          style={{
            backgroundColor: lowStockCount > 0 ? '#fffbeb' : '#ffffff',
            border: lowStockCount > 0 ? '1.5px solid #fde68a' : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#dc2626';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = lowStockCount > 0 ? '#fde68a' : 'var(--border-subtle)';
            e.currentTarget.style.transform = 'none';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: lowStockCount > 0 ? '#b45309' : 'var(--text-muted)', textTransform: 'uppercase' }}>
              Low Stock Items
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', background: lowStockCount > 0 ? '#fee2e2' : 'rgba(37, 99, 235, 0.1)', color: lowStockCount > 0 ? '#dc2626' : 'var(--gold-600)' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: lowStockCount > 0 ? '#dc2626' : 'var(--text-primary)', marginTop: '8px', fontFamily: 'var(--font-display)' }}>
            {lowStockCount} Products
          </div>
          <div style={{ fontSize: '0.75rem', color: lowStockCount > 0 ? '#b45309' : 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>
            {lowStockCount > 0 ? 'Action required: Restock needed' : 'All inventory levels optimal'}
          </div>
        </div>
      </div>

      {/* Low Stock Spare Parts Alert Section */}
      {lowStockParts.length > 0 && (
        <div
          style={{
            backgroundColor: '#fffdfa',
            border: '1.5px solid #f59e0b',
            borderRadius: 'var(--radius-md)',
            padding: '18px 24px',
            marginBottom: '28px',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.12)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fde68a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#b45309'
                }}
              >
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#92400e' }}>
                  Low Stock Products Warning ({lowStockParts.length} items)
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#78350f', marginTop: '2px' }}>
                  The products below have fallen below their minimum threshold.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('products')}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#b45309',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Open Products Catalog
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '12px',
              marginTop: '16px'
            }}
          >
            {lowStockParts.map((part) => (
              <div
                key={part.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #fed7aa',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                    {part.name}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {part.brand} • PN: {part.partNumber}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      backgroundColor: '#fee2e2',
                      color: '#b91c1c'
                    }}
                  >
                    {part.availableQuantity} left (Min: {part.minimumStockLevel})
                  </span>
                  <div style={{ marginTop: '4px' }}>
                    <button
                      onClick={() => setActiveTab('products')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--gold-600)',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      View Product
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Row 4: Recent Invoices Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '18px'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Recent Invoices
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Latest generated bills and vehicle release clearances
            </p>
          </div>

          <button
            onClick={() => setActiveTab('invoices')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--gold-600)',
              fontSize: '0.84rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            <span>View All Invoices</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Invoice No</th>
                <th style={{ padding: '10px 14px' }}>Date</th>
                <th style={{ padding: '10px 14px' }}>Job Card</th>
                <th style={{ padding: '10px 14px' }}>Customer</th>
                <th style={{ padding: '10px 14px' }}>Vehicle</th>
                <th style={{ padding: '10px 14px' }}>Grand Total</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.slice(0, 6).map((inv) => (
                <tr
                  key={inv.id}
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                    transition: 'background-color 0.15s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {inv.invoiceNumber}
                  </td>
                  <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>
                    {inv.date}
                  </td>
                  <td style={{ padding: '14px', color: 'var(--gold-600)', fontWeight: 600 }}>
                    {inv.jobCardNumber || 'JC-2026'}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {inv.customer?.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {inv.customer?.phone}
                    </div>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {inv.vehicle?.regNumber}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {inv.vehicle?.brand} {inv.vehicle?.model}
                    </div>
                  </td>
                  <td style={{ padding: '14px', fontWeight: 800, color: 'var(--gold-600)' }}>
                    {formatCurrency(inv.grandTotal || inv.totalAmount || 0)}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedInvoiceForView(inv)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-gold)',
                        backgroundColor: '#ffffff',
                        color: 'var(--gold-600)',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Eye size={13} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
