import React, { useState } from 'react';
import { useBilling } from '../context/useBilling';
import { 
  Clock, 
  Car, 
  TrendingUp, 
  ArrowUpRight, 
  Printer, 
  CheckCircle2, 
  Plus, 
  FileSpreadsheet,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function Dashboard() {
  const { 
    invoices, 
    products, 
    settings, 
    formatCurrency, 
    setSelectedInvoiceForView, 
    setIsInvoiceModalOpen, 
    setInvoiceToEdit,
    markAsPaid,
    setActiveTab 
  } = useBilling();

  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Compute metrics
  const totalRevenue = invoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
  
  const paidInvoices = invoices.filter((i) => i.status === 'Paid');
  const paidAmount = paidInvoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);

  const pendingInvoices = invoices.filter((i) => i.status === 'Pending');
  const pendingAmount = pendingInvoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);

  const overdueInvoices = invoices.filter((i) => i.status === 'Overdue');
  const overdueAmount = overdueInvoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);

  // Inventory value
  const totalInventoryValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const luxuryCarsInStock = products.filter((p) => p.category === 'Vehicles').reduce((acc, p) => acc + p.stock, 0);

  // Category revenue split
  const categoryMap = {};
  invoices.forEach((inv) => {
    inv.items?.forEach((item) => {
      const cat = item.category || 'General';
      categoryMap[cat] = (categoryMap[cat] || 0) + (item.total || 0);
    });
  });

  const categoryList = Object.entries(categoryMap).map(([name, val]) => ({
    name,
    amount: val,
    percent: totalRevenue ? Math.round((val / totalRevenue) * 100) : 0
  })).sort((a, b) => b.amount - a.amount);

  // 6-Month Chart Data points
  const chartData = [
    { month: 'Jun', amount: 3200000 },
    { month: 'Jul', amount: 4800000 },
    { month: 'Aug', amount: 4100000 },
    { month: 'Sep', amount: 6500000 },
    { month: 'Oct', amount: 7900000 },
    { month: 'Nov', amount: totalRevenue || 9996170 }
  ];

  const maxVal = Math.max(...chartData.map((d) => d.amount));
  const svgWidth = 650;
  const svgHeight = 220;
  const paddingX = 45;
  const paddingY = 30;

  // Generate SVG smooth path coordinates
  const points = chartData.map((d, index) => {
    const x = paddingX + (index / (chartData.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - (d.amount / maxVal) * (svgHeight - paddingY * 2);
    return { x, y, ...d };
  });

  // Simple smooth curve path generator
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const mx = (p0.x + p1.x) / 2;
    pathD += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  return (
    <div style={{ padding: '32px 32px 64px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      {/* Top Welcome & Quick Action Bar in White & Gold */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          marginBottom: '32px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.75rem',
                fontWeight: 900,
                letterSpacing: '1px',
                color: 'var(--text-primary)'
              }}
            >
              Dealership Command Center
            </span>
            <span className="badge badge-gold">
              <Sparkles size={13} color="var(--gold-600)" /> Live Showroom
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Comprehensive billing metrics, invoices, vehicle services & luxury inventory overview.
          </p>
        </div>

        {/* Quick action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="btn-outline"
            onClick={() => setActiveTab('reports')}
          >
            <FileSpreadsheet size={16} />
            <span>Financial Report</span>
          </button>

          <button
            className="btn-gold"
            onClick={() => {
              setInvoiceToEdit(null);
              setIsInvoiceModalOpen(true);
            }}
          >
            <Plus size={18} />
            <span>Generate Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI 4-Card Luxury White & Gold Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}
      >
        {/* Metric 1: Total Billed Revenue */}
        <div className="luxury-card luxury-card-gold" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--gold-600)', letterSpacing: '0.5px' }}>
              Total Gross Billed
            </span>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1.5px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold-600)'
              }}
            >
              <TrendingUp size={22} />
            </div>
          </div>
          <div style={{ fontSize: '1.95rem', fontWeight: 900, fontFamily: 'var(--font-sans)', color: 'var(--text-primary)', marginBottom: '8px' }}>
            {formatCurrency(totalRevenue)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--status-paid)', fontWeight: 600 }}>
            <ArrowUpRight size={16} />
            <span>+24.6% vs previous quarter</span>
          </div>
        </div>

        {/* Metric 2: Settled / Paid Invoices */}
        <div className="luxury-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
              Collected Cashflow
            </span>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'var(--status-paid-bg)',
                border: '1px solid var(--status-paid-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--status-paid)'
              }}
            >
              <CheckCircle2 size={22} />
            </div>
          </div>
          <div style={{ fontSize: '1.95rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>
            {formatCurrency(paidAmount)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--status-paid)' }}>{paidInvoices.length} invoices</strong> settled in full
          </div>
        </div>

        {/* Metric 3: Pending & Overdue */}
        <div className="luxury-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
              Outstanding Balance
            </span>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: overdueInvoices.length > 0 ? 'var(--status-overdue-bg)' : 'var(--status-pending-bg)',
                border: overdueInvoices.length > 0 ? '1px solid var(--status-overdue-border)' : '1px solid var(--status-pending-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: overdueInvoices.length > 0 ? 'var(--status-overdue)' : 'var(--status-pending)'
              }}
            >
              <Clock size={22} />
            </div>
          </div>
          <div style={{ fontSize: '1.95rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>
            {formatCurrency(pendingAmount + overdueAmount)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--status-pending)', fontWeight: 600 }}>{pendingInvoices.length} Pending</span>
            {overdueInvoices.length > 0 && (
              <span className="badge badge-overdue" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                {overdueInvoices.length} Overdue
              </span>
            )}
          </div>
        </div>

        {/* Metric 4: Showroom & Service Inventory */}
        <div className="luxury-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
              Inventory Valuation
            </span>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(37, 99, 235, 0.1)',
                border: '1px solid rgba(37, 99, 235, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-blue)'
              }}
            >
              <Car size={22} />
            </div>
          </div>
          <div style={{ fontSize: '1.95rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>
            {formatCurrency(totalInventoryValue)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <strong>{luxuryCarsInStock} Luxury Vehicles</strong> & {products.length} catalog items
          </div>
        </div>
      </div>

      {/* Main Analytics Row: Interactive SVG Revenue Curve & Category Breakdown in White & Gold */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.1fr)',
          gap: '24px',
          marginBottom: '32px'
        }}
      >
        {/* Interactive Revenue Trend */}
        <div className="luxury-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Revenue Trajectory
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Monthly sales volume & invoice settlements (in {settings.currency})
              </p>
            </div>
            <span className="badge badge-gold">Fiscal 2026</span>
          </div>

          {/* SVG Chart in White & Gold */}
          <div style={{ position: 'relative', width: '100%', flex: 1, minHeight: '220px' }}>
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity="0.28" />
                  <stop offset="70%" stopColor="#d4af37" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c59b27" />
                  <stop offset="50%" stopColor="#b8860b" />
                  <stop offset="100%" stopColor="#d4af37" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              {[0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = paddingY + (1 - ratio) * (svgHeight - paddingY * 2);
                return (
                  <g key={i}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="rgba(212, 175, 55, 0.18)"
                      strokeDasharray="4 4"
                    />
                  </g>
                );
              })}

              {/* Gradient Area Fill */}
              <path d={areaD} fill="url(#goldGradient)" />

              {/* Smooth curve line */}
              <path
                d={pathD}
                fill="none"
                stroke="url(#strokeGradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              {points.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPoint === i ? 7 : 5}
                    fill="#ffffff"
                    stroke="#b8860b"
                    strokeWidth={hoveredPoint === i ? 3 : 2}
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* Month Label */}
                  <text
                    x={pt.x}
                    y={svgHeight - 8}
                    textAnchor="middle"
                    fill="var(--text-secondary)"
                    fontSize="11"
                    fontWeight="700"
                  >
                    {pt.month}
                  </text>
                </g>
              ))}
            </svg>

            {/* Hover Tooltip */}
            {hoveredPoint !== null && (
              <div
                style={{
                  position: 'absolute',
                  left: `${(points[hoveredPoint].x / svgWidth) * 100}%`,
                  top: `${(points[hoveredPoint].y / svgHeight) * 100}%`,
                  transform: 'translate(-50%, -120%)',
                  background: '#ffffff',
                  border: '1.5px solid var(--border-gold)',
                  boxShadow: 'var(--shadow-md)',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  fontSize: '0.8rem',
                  color: 'var(--text-primary)',
                  zIndex: 10
                }}
              >
                <div style={{ color: 'var(--gold-600)', fontWeight: 800 }}>
                  {chartData[hoveredPoint].month} 2026
                </div>
                <div style={{ fontWeight: 700 }}>{formatCurrency(chartData[hoveredPoint].amount)}</div>
              </div>
            )}
          </div>
        </div>

        {/* Revenue By Category */}
        <div className="luxury-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Revenue by Segment
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--gold-600)', fontWeight: 700 }}>Top streams</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
            {categoryList.map((cat, idx) => {
              const colors = ['#b8860b', '#2563eb', '#059669', '#7c3aed', '#db2777'];
              const color = colors[idx % colors.length];

              return (
                <div key={cat.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{cat.name}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {formatCurrency(cat.amount)} <strong style={{ color }}>({cat.percent}%)</strong>
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      background: 'rgba(212, 175, 55, 0.15)',
                      borderRadius: '999px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        width: `${cat.percent}%`,
                        height: '100%',
                        backgroundColor: color,
                        borderRadius: '999px',
                        transition: 'width 0.8s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setActiveTab('products')}
            className="btn-outline"
            style={{ marginTop: '20px', width: '100%', fontSize: '0.82rem' }}
          >
            <span>Explore Inventory Catalog</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Recent Invoices Table in White & Gold */}
      <div className="luxury-card" style={{ padding: '24px' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Recent Luxury Invoices
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Latest transactions, vehicle servicing orders, and sales receipts
            </p>
          </div>

          <button
            className="btn-outline"
            onClick={() => setActiveTab('invoices')}
            style={{ fontSize: '0.84rem' }}
          >
            <span>View All ({invoices.length}) Invoices</span>
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Invoices Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Vehicle Profile</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.slice(0, 5).map((inv) => (
                <tr key={inv.id}>
                  {/* Invoice # */}
                  <td>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: 'var(--gold-600)',
                        fontSize: '0.9rem'
                      }}
                    >
                      {inv.invoiceNumber}
                    </div>
                  </td>

                  {/* Customer */}
                  <td>
                    <div style={{ fontWeight: 700 }}>{inv.customer.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {inv.customer.company || inv.customer.phone}
                    </div>
                  </td>

                  {/* Vehicle */}
                  <td>
                    <div style={{ fontWeight: 600 }}>{inv.vehicle.makeModel}</div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '1px 6px',
                        background: '#fbf7ee',
                        border: '1px solid rgba(212, 175, 55, 0.35)',
                        borderRadius: '4px',
                        color: '#85580a',
                        fontWeight: 700
                      }}
                    >
                      {inv.vehicle.regNumber}
                    </span>
                  </td>

                  {/* Date */}
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
                    {inv.date}
                  </td>

                  {/* Amount */}
                  <td>
                    <span
                      style={{
                        fontWeight: 800,
                        fontFamily: 'var(--font-sans)',
                        color: 'var(--text-primary)',
                        fontSize: '0.98rem'
                      }}
                    >
                      {formatCurrency(inv.totalAmount)}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td>
                    <span className={`badge badge-${inv.status.toLowerCase()}`}>
                      {inv.status}
                    </span>
                  </td>

                  {/* Quick Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        className="btn-icon"
                        title="View & Print Official Invoice"
                        onClick={() => setSelectedInvoiceForView(inv)}
                        style={{ width: '32px', height: '32px' }}
                      >
                        <Printer size={15} />
                      </button>

                      {inv.status !== 'Paid' && (
                        <button
                          className="btn-icon"
                          title="Mark as Paid"
                          onClick={() => markAsPaid(inv.id)}
                          style={{ width: '32px', height: '32px', color: 'var(--status-paid)' }}
                        >
                          <CheckCircle2 size={15} />
                        </button>
                      )}
                    </div>
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
