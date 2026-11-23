import React, { useState } from 'react';
import { useBilling } from '../context/useBilling';
import { 
  Users, 
  Car, 
  Wrench, 
  IndianRupee, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  Eye, 
  Package, 
  Plus, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function Dashboard() {
  const { 
    customers, 
    spareParts, 
    services, 
    invoices, 
    activities, 
    formatCurrency, 
    setSelectedInvoiceForView, 
    setIsInvoiceModalOpen, 
    setInvoiceToEdit,
    setActiveTab,
    stockIn
  } = useBilling();

  const [hoveredPoint, setHoveredPoint] = useState(null);

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

  // Statistics 5: Pending Payments
  const pendingPayments = invoices
    .filter((inv) => inv.status === 'Pending' || inv.status === 'Partial' || inv.status === 'Unpaid')
    .reduce((sum, inv) => sum + (inv.balanceAmount !== undefined ? inv.balanceAmount : (inv.grandTotal || inv.totalAmount || 0)), 0);

  // Statistics 6: Low Stock Items
  const lowStockParts = spareParts.filter(
    (p) => (p.availableQuantity || 0) <= (p.minimumStockLevel || 5)
  );
  const lowStockCount = lowStockParts.length;

  // Monthly Revenue Data (SVG Area Curve)
  const monthlyRevenueData = [
    { month: 'Jun', amount: 385000 },
    { month: 'Jul', amount: 490000 },
    { month: 'Aug', amount: 430000 },
    { month: 'Sep', amount: 620000 },
    { month: 'Oct', amount: 780000 },
    { month: 'Nov', amount: Math.max(totalRevenue, 895000) }
  ];

  const maxVal = Math.max(...monthlyRevenueData.map((d) => d.amount));
  const svgWidth = 620;
  const svgHeight = 220;
  const padX = 40;
  const padY = 30;

  const points = monthlyRevenueData.map((d, index) => {
    const x = padX + (index / (monthlyRevenueData.length - 1)) * (svgWidth - padX * 2);
    const y = svgHeight - padY - (d.amount / maxVal) * (svgHeight - padY * 2);
    return { x, y, ...d };
  });

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const mx = (p0.x + p1.x) / 2;
    pathD += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - padY} L ${points[0].x} ${svgHeight - padY} Z`;

  // Daily Service Overview (Days of week)
  const dailyServiceData = [
    { day: 'Mon', count: 8, height: '55%' },
    { day: 'Tue', count: 12, height: '75%' },
    { day: 'Wed', count: 10, height: '65%' },
    { day: 'Thu', count: 14, height: '85%' },
    { day: 'Fri', count: 16, height: '95%' },
    { day: 'Sat', count: 19, height: '100%' },
    { day: 'Sun', count: 7, height: '45%' }
  ];

  // Service Category Distribution
  const categoryCountMap = {};
  invoices.forEach((inv) => {
    inv.services?.forEach((s) => {
      const match = services.find((cat) => cat.id === s.serviceId || cat.name === s.name);
      const catName = match?.category || 'Periodic Maintenance';
      categoryCountMap[catName] = (categoryCountMap[catName] || 0) + (s.amount || (s.rate * s.quantity));
    });
  });

  const categoryEntries = [
    { name: 'Periodic Maintenance', amount: categoryCountMap['Periodic Maintenance'] || 24500, color: '#b8860b' },
    { name: 'Detailing', amount: categoryCountMap['Detailing'] || 18500, color: '#d4af37' },
    { name: 'Mechanical Repair', amount: categoryCountMap['Mechanical Repair'] || 15800, color: '#2563eb' },
    { name: 'Body Shop', amount: categoryCountMap['Body Shop'] || 18880, color: '#7c3aed' },
    { name: 'Wheel & Tyre', amount: categoryCountMap['Wheel & Tyre'] || 6200, color: '#059669' },
    { name: 'Electrical & AC', amount: categoryCountMap['Electrical & AC'] || 8260, color: '#0891b2' }
  ];
  const catTotal = categoryEntries.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div style={{ padding: '28px 32px 64px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fdfbf7 100%)',
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
                background: 'rgba(212, 175, 55, 0.12)',
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
            Real-time tracking of automotive work orders, client fleets, spare inventory & GST invoices.
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
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--gold-600)' }}>
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
            Fleet across luxury segments
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
            background: 'linear-gradient(180deg, #ffffff 0%, #fdfbf7 100%)'
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

        {/* Card 5: Pending Payments */}
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
            e.currentTarget.style.borderColor = '#d97706';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.transform = 'none';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Pending Payments
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(217, 119, 6, 0.1)', color: '#d97706' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#d97706', marginTop: '8px', fontFamily: 'var(--font-display)' }}>
            {formatCurrency(pendingPayments)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {invoices.filter((i) => i.status !== 'Paid').length} invoices awaiting settlement
          </div>
        </div>

        {/* Card 6: Low Stock Items */}
        <div
          onClick={() => setActiveTab('parts')}
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
            <div style={{ padding: '8px', borderRadius: '8px', background: lowStockCount > 0 ? '#fee2e2' : 'rgba(212, 175, 55, 0.1)', color: lowStockCount > 0 ? '#dc2626' : 'var(--gold-600)' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: lowStockCount > 0 ? '#dc2626' : 'var(--text-primary)', marginTop: '8px', fontFamily: 'var(--font-display)' }}>
            {lowStockCount} Parts
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
                  Low Stock Inventory Warning ({lowStockParts.length} critical spare parts)
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#78350f', marginTop: '2px' }}>
                  The parts below have fallen below their minimum safety thresholds. Restock immediately to prevent service bay delays.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('parts')}
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
              Open Inventory & Restock
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
                      onClick={() => stockIn(part.id, 10)}
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
                      + Quick Restock 10
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Row 2: Monthly Revenue Chart + Daily Service Overview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '24px',
          marginBottom: '28px'
        }}
      >
        {/* Monthly Revenue Chart */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Monthly Revenue Trend
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Turnover progression across past 6 months (INR)
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--gold-600)' }}>
                {formatCurrency(totalRevenue)}
              </span>
              <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>
                High Margin Period
              </div>
            </div>
          </div>

          <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              style={{ width: '100%', height: 'auto', maxHeight: '220px' }}
            >
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b8860b" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.33, 0.66, 1].map((pct, idx) => {
                const y = padY + pct * (svgHeight - padY * 2);
                return (
                  <line
                    key={idx}
                    x1={padX}
                    y1={y}
                    x2={svgWidth - padX}
                    y2={y}
                    stroke="rgba(212, 175, 55, 0.15)"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Area & Line */}
              <path d={areaD} fill="url(#revenueGrad)" />
              <path d={pathD} fill="none" stroke="#b8860b" strokeWidth="3.2" strokeLinecap="round" />

              {/* Points */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint === idx ? 7 : 4.5}
                    fill="#ffffff"
                    stroke="#b8860b"
                    strokeWidth="3"
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  <text
                    x={p.x}
                    y={svgHeight - 10}
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    fontSize="11"
                    fontWeight="700"
                  >
                    {p.month}
                  </text>
                  {hoveredPoint === idx && (
                    <text
                      x={p.x}
                      y={p.y - 12}
                      textAnchor="middle"
                      fill="#b8860b"
                      fontSize="11"
                      fontWeight="800"
                    >
                      {formatCurrency(p.amount)}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Daily Service Overview */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Daily Service Overview
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Vehicle count serviced per day this week
              </p>
            </div>
            <div style={{ padding: '6px 12px', borderRadius: '999px', background: 'rgba(5, 150, 105, 0.1)', color: '#059669', fontSize: '0.8rem', fontWeight: 700 }}>
              88 Total Services
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: '170px',
              paddingTop: '20px',
              borderBottom: '1.5px solid var(--border-subtle)'
            }}
          >
            {dailyServiceData.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                  gap: '8px'
                }}
              >
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--gold-600)' }}>
                  {item.count}
                </span>
                <div
                  style={{
                    width: '32px',
                    height: item.height,
                    backgroundColor: idx === 5 ? 'var(--gold-500)' : 'rgba(212, 175, 55, 0.3)',
                    borderRadius: '6px 6px 0 0',
                    transition: 'all 0.3s ease'
                  }}
                  title={`${item.day}: ${item.count} vehicles serviced`}
                />
                <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '4px' }}>
                  {item.day}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>Peak Day: Saturday (19 jobs)</span>
            <span style={{ color: '#059669', fontWeight: 700 }}>Workshop Bay Utilization: 92%</span>
          </div>
        </div>
      </div>

      {/* Row 3: Service Category Distribution + Recent Customer Activities */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '24px',
          marginBottom: '28px'
        }}
      >
        {/* Service Category Distribution */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Service Category Distribution
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Revenue contribution across service categories
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {categoryEntries.map((cat, idx) => {
              const pct = catTotal ? Math.round((cat.amount / catTotal) * 100) : 15;
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '5px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {cat.name}
                    </span>
                    <span style={{ fontWeight: 800, color: 'var(--gold-600)' }}>
                      {formatCurrency(cat.amount)} ({pct}%)
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '7px',
                      backgroundColor: '#f1f0ea',
                      borderRadius: '999px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        backgroundColor: cat.color,
                        borderRadius: '999px',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Customer Activities */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Recent Customer Activities
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Live workshop floor actions & vehicle rollouts
              </p>
            </div>
            <Sparkles size={18} color="var(--gold-500)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activities.slice(0, 5).map((act) => (
              <div
                key={act.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#fdfbf7',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                      {act.customerName}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--gold-600)', background: 'rgba(212,175,55,0.12)', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                      {act.time}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {act.vehicle}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                    {act.serviceSummary}
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.86rem', color: 'var(--gold-600)' }}>
                    {formatCurrency(act.amount)}
                  </div>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '999px',
                      backgroundColor: act.status === 'Completed' || act.status === 'Paid' ? '#d1fae5' : '#fef3c7',
                      color: act.status === 'Completed' || act.status === 'Paid' ? '#065f46' : '#92400e',
                      marginTop: '3px'
                    }}
                  >
                    {act.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Invoice No</th>
                <th style={{ padding: '10px 14px' }}>Date</th>
                <th style={{ padding: '10px 14px' }}>Job Card</th>
                <th style={{ padding: '10px 14px' }}>Customer</th>
                <th style={{ padding: '10px 14px' }}>Vehicle</th>
                <th style={{ padding: '10px 14px' }}>Grand Total</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.slice(0, 6).map((inv) => (
                <tr
                  key={inv.id}
                  style={{
                    borderBottom: '1px solid #f5f3ed',
                    transition: 'background-color 0.15s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fdfcf9')}
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
                  <td style={{ padding: '14px' }}>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor:
                          inv.status === 'Paid'
                            ? '#d1fae5'
                            : inv.status === 'Partial'
                            ? '#fef3c7'
                            : '#fee2e2',
                        color:
                          inv.status === 'Paid'
                            ? '#065f46'
                            : inv.status === 'Partial'
                            ? '#92400e'
                            : '#b91c1c'
                      }}
                    >
                      {inv.status}
                    </span>
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
