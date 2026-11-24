import React, { useState, useMemo } from 'react';
import { useBilling } from '../context/useBilling';
import { 
  Calendar, 
  Printer, 
  FileSpreadsheet,
  ArrowUpDown
} from 'lucide-react';

export default function ReportsPage() {
  const { invoices, spareParts, formatCurrency } = useBilling();

  // Date Range Filter: 'ALL' | 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'THIS_QUARTER' | 'THIS_YEAR' | 'CUSTOM'
  const [dateRange, setDateRange] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Filter invoices by date range
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (dateRange === 'ALL') return true;
      const invDate = new Date(inv.date);
      const now = new Date();

      if (dateRange === 'TODAY') {
        const todayStr = now.toISOString().split('T')[0];
        return inv.date === todayStr;
      }
      if (dateRange === 'THIS_WEEK') {
        const weekAgo = new Date(now.getTime() - 7 * 86400000);
        return invDate >= weekAgo;
      }
      if (dateRange === 'THIS_MONTH') {
        return invDate.getMonth() === now.getMonth() && invDate.getFullYear() === now.getFullYear();
      }
      if (dateRange === 'THIS_QUARTER') {
        const currQuarter = Math.floor(now.getMonth() / 3);
        const invQuarter = Math.floor(invDate.getMonth() / 3);
        return currQuarter === invQuarter && invDate.getFullYear() === now.getFullYear();
      }
      if (dateRange === 'THIS_YEAR') {
        return invDate.getFullYear() === now.getFullYear();
      }
      if (dateRange === 'CUSTOM') {
        if (!startDate && !endDate) return true;
        const start = startDate ? new Date(startDate) : new Date('2000-01-01');
        const end = endDate ? new Date(endDate) : new Date('2099-12-31');
        return invDate >= start && invDate <= end;
      }
      return true;
    });
  }, [invoices, dateRange, startDate, endDate]);

  // Sort invoices according to sortBy option
  const sortedInvoices = useMemo(() => {
    const list = [...filteredInvoices];
    if (sortBy === 'newest') {
      return list.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    if (sortBy === 'oldest') {
      return list.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    if (sortBy === 'highest') {
      return list.sort((a, b) => (b.grandTotal || b.totalAmount || 0) - (a.grandTotal || a.totalAmount || 0));
    }
    if (sortBy === 'lowest') {
      return list.sort((a, b) => (a.grandTotal || a.totalAmount || 0) - (b.grandTotal || b.totalAmount || 0));
    }
    return list;
  }, [filteredInvoices, sortBy]);

  // Overall Financial Aggregates
  const totalGrossRevenue = filteredInvoices.reduce((sum, i) => sum + (i.grandTotal || i.totalAmount || 0), 0);
  const totalTaxable = filteredInvoices.reduce((sum, i) => sum + (i.taxableAmount || 0), 0);
  const totalCgst = filteredInvoices.reduce((sum, i) => sum + (i.cgst || 0), 0);
  const totalSgst = filteredInvoices.reduce((sum, i) => sum + (i.sgst || 0), 0);
  const totalGst = totalCgst + totalSgst;

  // Export to Excel / CSV function
  const handleExportExcel = () => {
    const filename = `SR_CARS_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`;
    const headers = ['Date', 'Invoice No', 'Job Card', 'Customer', 'Labor (Services)', 'Products', 'Taxable', 'GST', 'Grand Total'];
    const rows = sortedInvoices.map((inv) => [
      `"${inv.date}"`,
      `"${inv.invoiceNumber}"`,
      `"${inv.jobCardNumber || ''}"`,
      `"${inv.customer?.name || ''}"`,
      inv.serviceSubtotal || 0,
      inv.sparePartsSubtotal || 0,
      inv.taxableAmount || 0,
      (inv.cgst || 0) + (inv.sgst || 0),
      inv.grandTotal || inv.totalAmount || 0
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="page-container">
      {/* Header Banner */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          marginBottom: '26px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                color: 'var(--gold-600)',
                background: 'rgba(37, 99, 235, 0.12)',
                padding: '2px 8px',
                borderRadius: '999px'
              }}
            >
              Auditing & Financial Intelligence
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              fontWeight: 900,
              color: 'var(--text-primary)'
            }}
          >
            Reports & Analytics
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
            Comprehensive revenue statements, GST filing breakdowns, product sales velocity & customer analytics.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleExportExcel}
            className="btn-outline"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              fontSize: '0.84rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              borderColor: 'var(--border-subtle)',
              backgroundColor: '#ffffff',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            <FileSpreadsheet size={16} color="#059669" />
            <span>Export to Excel</span>
          </button>

          <button
            onClick={handlePrintPDF}
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
            <Printer size={16} />
            <span>Export to PDF / Print</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div style={{ padding: '16px 20px', borderRadius: '10px', backgroundColor: '#ffffff', border: '1px solid var(--border-gold)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--gold-600)', textTransform: 'uppercase' }}>
            Total Sales (Filtered)
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--gold-600)', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
            {formatCurrency(totalGrossRevenue)}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Taxable: {formatCurrency(totalTaxable)}
          </div>
        </div>

        <div style={{ padding: '16px 20px', borderRadius: '10px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total GST Collected
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
            {formatCurrency(totalGst)}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            CGST: {formatCurrency(totalCgst)} | SGST: {formatCurrency(totalSgst)}
          </div>
        </div>

        <div style={{ padding: '16px 20px', borderRadius: '10px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Invoices Generated
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--gold-600)', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
            {filteredInvoices.length}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            In selected period
          </div>
        </div>

        <div style={{ padding: '16px 20px', borderRadius: '10px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Spare Inventory Valuation
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#059669', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
            {formatCurrency(spareParts.reduce((s, p) => s + (p.purchasePrice * p.availableQuantity), 0))}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Across {spareParts.length} distinct SKUs
          </div>
        </div>
      </div>

      {/* Unified Report Filter & Sort Toolbar */}
      <div
        className="no-print"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 20px',
          marginBottom: '22px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', flex: 1 }}>
          {/* Date Period Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} color="var(--gold-500)" />
            <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
              Period:
            </label>
            <select
              className="form-input"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{
                height: '42px',
                padding: '0 14px',
                fontSize: '0.88rem',
                fontWeight: 700,
                minWidth: '140px',
                lineHeight: 'normal'
              }}
            >
              <option value="ALL">All Time</option>
              <option value="TODAY">Today</option>
              <option value="THIS_MONTH">This Month</option>
              <option value="THIS_YEAR">This Year</option>
              <option value="CUSTOM">Custom Range</option>
            </select>
          </div>

          {/* Sort By Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpDown size={15} color="var(--gold-500)" />
            <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
              Sort:
            </label>
            <select
              className="form-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                height: '42px',
                padding: '0 14px',
                fontSize: '0.88rem',
                fontWeight: 700,
                minWidth: '150px',
                lineHeight: 'normal'
              }}
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Amount</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Custom Date Inputs if CUSTOM selected */}
          {dateRange === 'CUSTOM' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <input
                type="date"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ height: '42px', padding: '0 12px', fontSize: '0.84rem' }}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>to</span>
              <input
                type="date"
                className="form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ height: '42px', padding: '0 12px', fontSize: '0.84rem' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* REPORT CONTENT SECTIONS */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Sales & Revenue Turnover Report
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Summary of completed job orders, labor charges, product sales and GST collections
              </p>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1.5px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px' }}>Date</th>
                <th style={{ padding: '10px 12px' }}>Job Orders</th>
                <th style={{ padding: '10px 12px' }}>Services (Labor)</th>
                <th style={{ padding: '10px 12px' }}>Products</th>
                <th style={{ padding: '10px 12px' }}>Taxable</th>
                <th style={{ padding: '10px 12px' }}>Total GST</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Grand Total</th>
              </tr>
            </thead>
            <tbody>
              {sortedInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No invoices found for the selected period.
                  </td>
                </tr>
              ) : (
                sortedInvoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{inv.date}</td>
                    <td style={{ padding: '12px' }}>{inv.invoiceNumber} ({inv.jobCardNumber})</td>
                    <td style={{ padding: '12px' }}>{formatCurrency(inv.serviceSubtotal || 0)}</td>
                    <td style={{ padding: '12px' }}>{formatCurrency(inv.sparePartsSubtotal || 0)}</td>
                    <td style={{ padding: '12px' }}>{formatCurrency(inv.taxableAmount || 0)}</td>
                    <td style={{ padding: '12px', color: '#059669', fontWeight: 600 }}>{formatCurrency((inv.cgst || 0) + (inv.sgst || 0))}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 800, color: 'var(--gold-600)' }}>
                      {formatCurrency(inv.grandTotal || inv.totalAmount || 0)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
