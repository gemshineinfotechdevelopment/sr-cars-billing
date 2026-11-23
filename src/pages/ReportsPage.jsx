import React, { useState } from 'react';
import { useBilling } from '../context/useBilling';
import { 
  Download, 
  ShieldCheck 
} from 'lucide-react';

export default function ReportsPage() {
  const { invoices, formatCurrency, settings } = useBilling();

  const [dateRange, setDateRange] = useState('ALL');

  const filteredInvoices = invoices.filter((inv) => {
    if (dateRange === 'ALL') return true;
    const invDate = new Date(inv.date);
    const now = new Date();
    
    if (dateRange === 'THIS_MONTH') {
      return invDate.getMonth() === now.getMonth() && invDate.getFullYear() === now.getFullYear();
    }
    if (dateRange === 'LAST_30') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
      return invDate >= thirtyDaysAgo;
    }
    if (dateRange === 'Q4') {
      return invDate.getMonth() >= 9 && invDate.getMonth() <= 11;
    }
    return true;
  });

  const totalGrossRevenue = filteredInvoices.reduce((sum, i) => sum + (i.totalAmount || 0), 0);
  const totalTaxable = filteredInvoices.reduce((sum, i) => sum + (i.taxableAmount || 0), 0);
  const totalTaxCollected = filteredInvoices.reduce((sum, i) => sum + (i.taxAmount || 0), 0);
  
  const paidTurnover = filteredInvoices
    .filter((i) => i.status === 'Paid')
    .reduce((sum, i) => sum + (i.totalAmount || 0), 0);

  const pendingTurnover = filteredInvoices
    .filter((i) => i.status === 'Pending' || i.status === 'Overdue')
    .reduce((sum, i) => sum + (i.totalAmount || 0), 0);

  const averageInvoiceValue = filteredInvoices.length
    ? Math.round(totalGrossRevenue / filteredInvoices.length)
    : 0;

  // Revenue by Category
  const categoryStats = {};
  filteredInvoices.forEach((inv) => {
    inv.items?.forEach((itm) => {
      const cat = itm.category || 'Other';
      categoryStats[cat] = (categoryStats[cat] || 0) + (itm.total || 0);
    });
  });

  const categoryArray = Object.entries(categoryStats)
    .map(([cat, amt]) => ({
      category: cat,
      amount: amt,
      percentage: totalGrossRevenue ? Math.round((amt / totalGrossRevenue) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  // Revenue by Payment Method
  const paymentStats = {};
  filteredInvoices.forEach((inv) => {
    const method = inv.paymentMethod || 'Other';
    paymentStats[method] = (paymentStats[method] || 0) + (inv.totalAmount || 0);
  });

  const paymentArray = Object.entries(paymentStats)
    .map(([method, amt]) => ({
      method,
      amount: amt,
      percentage: totalGrossRevenue ? Math.round((amt / totalGrossRevenue) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  // Top Spenders
  const customerMap = {};
  filteredInvoices.forEach((inv) => {
    const name = inv.customer.name;
    if (!customerMap[name]) {
      customerMap[name] = {
        name,
        company: inv.customer.company,
        vehicle: inv.vehicle.makeModel,
        invoicesCount: 0,
        totalSpent: 0
      };
    }
    customerMap[name].invoicesCount += 1;
    customerMap[name].totalSpent += inv.totalAmount || 0;
  });

  const topCustomers = Object.values(customerMap)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  const handleExportAudit = () => {
    if (filteredInvoices.length === 0) return;
    const headers = [
      'Invoice No',
      'Invoice Date',
      'Status',
      'Client Name',
      'Client GSTIN',
      'Vehicle Model',
      'Vehicle Reg No',
      'Subtotal',
      'Discount',
      'Taxable Value',
      'CGST (9%)',
      'SGST (9%)',
      'Total GST (18%)',
      'Grand Total',
      'Payment Mode'
    ];

    const rows = filteredInvoices.map((i) => [
      `"${i.invoiceNumber}"`,
      `"${i.date}"`,
      `"${i.status}"`,
      `"${i.customer.name}"`,
      `"${i.customer.gstin || 'N/A'}"`,
      `"${i.vehicle.makeModel}"`,
      `"${i.vehicle.regNumber}"`,
      i.subtotal,
      i.discountAmount || 0,
      i.taxableAmount,
      Math.round((i.taxAmount || 0) / 2),
      Math.round((i.taxAmount || 0) / 2),
      i.taxAmount || 0,
      i.totalAmount,
      `"${i.paymentMethod}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SR_CARS_Tax_Financial_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            Financial Analytics & Tax Audit
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Dealership turnover analysis, statutory GST taxation breakdown, and account receivables.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            className="form-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{ width: 'auto', padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <option value="ALL">All Time Data</option>
            <option value="THIS_MONTH">Current Month</option>
            <option value="LAST_30">Past 30 Days</option>
            <option value="Q4">Quarter 4 (Oct-Dec 2026)</option>
          </select>

          <button className="btn-gold" onClick={handleExportAudit}>
            <Download size={16} />
            <span>Export Tax Audit (CSV)</span>
          </button>
        </div>
      </div>

      {/* 6-Card Financial Metrics in White & Gold */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        <div className="luxury-card luxury-card-gold" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--gold-600)', fontWeight: 800 }}>
            Gross Billing Turnover
          </div>
          <div style={{ fontSize: '1.55rem', fontWeight: 900, color: 'var(--gold-600)', marginTop: '4px' }}>
            {formatCurrency(totalGrossRevenue)}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Across {filteredInvoices.length} transactions
          </div>
        </div>

        <div className="luxury-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
            Taxable Net Base
          </div>
          <div style={{ fontSize: '1.55rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
            {formatCurrency(totalTaxable)}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Excluding GST & taxes
          </div>
        </div>

        <div className="luxury-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
            Total GST Collected
          </div>
          <div style={{ fontSize: '1.55rem', fontWeight: 900, color: 'var(--accent-blue)', marginTop: '4px' }}>
            {formatCurrency(totalTaxCollected)}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--accent-blue)', marginTop: '4px', fontWeight: 600 }}>
            CGST (9%) + SGST (9%)
          </div>
        </div>

        <div className="luxury-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
            Collected Cash Inflow
          </div>
          <div style={{ fontSize: '1.55rem', fontWeight: 900, color: 'var(--status-paid)', marginTop: '4px' }}>
            {formatCurrency(paidTurnover)}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--status-paid)', marginTop: '4px', fontWeight: 600 }}>
            Settled bank funds
          </div>
        </div>

        <div className="luxury-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
            Receivables Pending
          </div>
          <div style={{ fontSize: '1.55rem', fontWeight: 900, color: pendingTurnover > 0 ? 'var(--status-pending)' : 'var(--text-muted)', marginTop: '4px' }}>
            {formatCurrency(pendingTurnover)}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Outstanding invoices
          </div>
        </div>

        <div className="luxury-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
            Average Invoice Ticket
          </div>
          <div style={{ fontSize: '1.55rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
            {formatCurrency(averageInvoiceValue)}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Per automotive client
          </div>
        </div>
      </div>

      {/* Statutory GST Tax Box in White & Gold */}
      <div
        className="luxury-card"
        style={{
          padding: '26px',
          marginBottom: '28px',
          background: 'linear-gradient(145deg, #ffffff 0%, #fbf8f1 100%)',
          border: '1.5px solid var(--border-gold)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold-600)'
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Statutory GST Filing Schedule (GSTR-1 Summary)
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Certified under GSTIN: {settings.gstin} • Legal entity: {settings.dealershipName}
              </span>
            </div>
          </div>
          <span className="badge badge-gold">18% Standard Tax Base</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            padding: '18px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Total Taxable Value
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, fontFamily: 'var(--font-sans)', marginTop: '2px', color: 'var(--text-primary)' }}>
              {formatCurrency(totalTaxable)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Central GST (CGST 9%)
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--accent-blue)', marginTop: '2px' }}>
              {formatCurrency(Math.round(totalTaxCollected / 2))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              State GST (SGST 9%)
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--accent-blue)', marginTop: '2px' }}>
              {formatCurrency(Math.round(totalTaxCollected / 2))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Total Tax Liability
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--gold-600)', marginTop: '2px' }}>
              {formatCurrency(totalTaxCollected)}
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Revenue by Segment & Payment Methods in White & Gold */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '28px'
        }}
      >
        {/* Category Share */}
        <div className="luxury-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>
            Revenue by Automotive Category
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Contribution across vehicle sales, workshop services and detailing
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {categoryArray.map((c, i) => {
              const colors = ['#b8860b', '#2563eb', '#059669', '#7c3aed', '#db2777'];
              const color = colors[i % colors.length];

              return (
                <div key={c.category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700 }}>{c.category}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {formatCurrency(c.amount)} <strong style={{ color }}>({c.percentage}%)</strong>
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(212, 175, 55, 0.15)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${c.percentage}%`, height: '100%', backgroundColor: color, borderRadius: '999px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="luxury-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>
            Payment Channels & Settlement Breakdown
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Distribution between digital UPI, RTGS/NEFT wire and corporate financing
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {paymentArray.map((p, i) => {
              const colors = ['#059669', '#2563eb', '#b8860b', '#db2777', '#7c3aed'];
              const color = colors[i % colors.length];

              return (
                <div key={p.method}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700 }}>{p.method}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {formatCurrency(p.amount)} <strong style={{ color }}>({p.percentage}%)</strong>
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(212, 175, 55, 0.15)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${p.percentage}%`, height: '100%', backgroundColor: color, borderRadius: '999px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top 5 Premium Accounts / VIP Customers in White & Gold */}
      <div className="luxury-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '4px' }}>
          Top VIP Automotive Accounts by Turnover
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Key luxury patrons and corporate fleet accounts
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Enterprise / Firm</th>
                <th>Primary Vehicle</th>
                <th>Total Invoices</th>
                <th style={{ textAlign: 'right' }}>Cumulative Spend</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((cust, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{cust.name}</div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {cust.company || 'Private Patron'}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{cust.vehicle}</span>
                  </td>
                  <td>
                    <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
                      {cust.invoicesCount} Invoices
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--gold-600)', fontFamily: 'var(--font-sans)' }}>
                      {formatCurrency(cust.totalSpent)}
                    </strong>
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
