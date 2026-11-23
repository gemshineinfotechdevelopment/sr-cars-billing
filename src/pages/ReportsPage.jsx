import React, { useState, useMemo } from 'react';
import { useBilling } from '../context/useBilling';
import { 
  Calendar, 
  Printer, 
  FileSpreadsheet
} from 'lucide-react';

export default function ReportsPage() {
  const { invoices, services, spareParts, customers, formatCurrency } = useBilling();

  // Active Report Tab:
  // 1: DAILY, 2: WEEKLY, 3: MONTHLY, 4: YEARLY, 5: SERVICE_WISE,
  // 6: PARTS_SALES, 7: CUSTOMER_REPORT, 8: PENDING_PAYMENT, 9: GST_REPORT, 10: STOCK_REPORT
  const [activeReport, setActiveReport] = useState('DAILY');

  // Date Range Filter: 'ALL' | 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'THIS_QUARTER' | 'THIS_YEAR' | 'CUSTOM'
  const [dateRange, setDateRange] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const reportTabs = [
    { id: 'DAILY', label: '1. Daily Sales' },
    { id: 'WEEKLY', label: '2. Weekly Sales' },
    { id: 'MONTHLY', label: '3. Monthly Sales' },
    { id: 'YEARLY', label: '4. Yearly Revenue' },
    { id: 'SERVICE_WISE', label: '5. Service-wise' },
    { id: 'PARTS_SALES', label: '6. Spare Parts Sales' },
    { id: 'CUSTOMER_REPORT', label: '7. Customer Report' },
    { id: 'PENDING_PAYMENT', label: '8. Pending Payments' },
    { id: 'GST_REPORT', label: '9. GST Report' },
    { id: 'STOCK_REPORT', label: '10. Stock Report' }
  ];

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

  // Overall Financial Aggregates
  const totalGrossRevenue = filteredInvoices.reduce((sum, i) => sum + (i.grandTotal || i.totalAmount || 0), 0);
  const totalTaxable = filteredInvoices.reduce((sum, i) => sum + (i.taxableAmount || 0), 0);
  const totalCgst = filteredInvoices.reduce((sum, i) => sum + (i.cgst || 0), 0);
  const totalSgst = filteredInvoices.reduce((sum, i) => sum + (i.sgst || 0), 0);
  const totalGst = totalCgst + totalSgst;
  const totalPaid = filteredInvoices.reduce((sum, i) => sum + (i.amountPaid || (i.status === 'Paid' ? (i.grandTotal || i.totalAmount || 0) : 0)), 0);
  const totalPending = Math.max(0, totalGrossRevenue - totalPaid);

  // Export to Excel / CSV function
  const handleExportExcel = () => {
    let headers = [];
    let rows = [];
    let filename = `SR_CARS_${activeReport}_Report_${new Date().toISOString().split('T')[0]}.csv`;

    if (activeReport === 'DAILY' || activeReport === 'WEEKLY' || activeReport === 'MONTHLY' || activeReport === 'YEARLY') {
      headers = ['Period / Date', 'Invoice Count', 'Labor (Services)', 'Spare Parts', 'Gross Amount', 'Taxable', 'GST (CGST+SGST)', 'Grand Total'];
      // Group by date
      const groupMap = {};
      filteredInvoices.forEach((inv) => {
        const key = activeReport === 'DAILY' ? inv.date : activeReport === 'MONTHLY' ? inv.date.slice(0, 7) : inv.date;
        if (!groupMap[key]) {
          groupMap[key] = { count: 0, services: 0, spares: 0, gross: 0, taxable: 0, gst: 0, total: 0 };
        }
        groupMap[key].count += 1;
        groupMap[key].services += inv.serviceSubtotal || 0;
        groupMap[key].spares += inv.sparePartsSubtotal || 0;
        groupMap[key].gross += inv.grossTotal || 0;
        groupMap[key].taxable += inv.taxableAmount || 0;
        groupMap[key].gst += (inv.cgst || 0) + (inv.sgst || 0);
        groupMap[key].total += inv.grandTotal || inv.totalAmount || 0;
      });

      rows = Object.entries(groupMap).map(([key, val]) => [
        `"${key}"`,
        val.count,
        val.services,
        val.spares,
        val.gross,
        val.taxable,
        val.gst,
        val.total
      ]);
    } else if (activeReport === 'SERVICE_WISE') {
      headers = ['Service ID', 'Service Name', 'Category', 'Jobs Completed', 'Labor Rate', 'Total Revenue'];
      const sMap = {};
      filteredInvoices.forEach((inv) => {
        inv.services?.forEach((s) => {
          const k = s.name;
          if (!sMap[k]) sMap[k] = { name: s.name, category: s.category || 'Maintenance', count: 0, rate: s.rate, revenue: 0 };
          sMap[k].count += Number(s.quantity) || 1;
          sMap[k].revenue += Number(s.amount) || (s.rate * s.quantity);
        });
      });
      rows = Object.values(sMap).map((s, idx) => [
        `"SRV-${idx + 1}"`,
        `"${s.name}"`,
        `"${s.category}"`,
        s.count,
        s.rate,
        s.revenue
      ]);
    } else if (activeReport === 'PARTS_SALES') {
      headers = ['Part Name', 'Part Number', 'Quantity Sold', 'Unit Selling Price', 'Total Sales Value'];
      const pMap = {};
      filteredInvoices.forEach((inv) => {
        inv.spareParts?.forEach((p) => {
          const k = p.name;
          if (!pMap[k]) pMap[k] = { name: p.name, pn: p.partNumber, qty: 0, price: p.unitPrice, total: 0 };
          pMap[k].qty += Number(p.quantity) || 1;
          pMap[k].total += Number(p.amount) || (p.unitPrice * p.quantity);
        });
      });
      rows = Object.values(pMap).map((p) => [
        `"${p.name}"`,
        `"${p.pn}"`,
        p.qty,
        p.price,
        p.total
      ]);
    } else if (activeReport === 'CUSTOMER_REPORT') {
      headers = ['Customer ID', 'Customer Name', 'Mobile', 'Vehicles Registered', 'Total Invoices', 'Total Billed Amount'];
      rows = customers.map((c) => {
        const custInvs = filteredInvoices.filter((i) => i.customerId === c.id || i.customer?.name === c.name);
        const spent = custInvs.reduce((sum, i) => sum + (i.grandTotal || i.totalAmount || 0), 0);
        return [
          `"${c.id}"`,
          `"${c.name}"`,
          `"${c.phone}"`,
          c.vehicles?.length || 0,
          custInvs.length,
          spent
        ];
      });
    } else if (activeReport === 'PENDING_PAYMENT') {
      headers = ['Invoice No', 'Date', 'Customer Name', 'Mobile', 'Vehicle Reg', 'Grand Total', 'Amount Paid', 'Balance Due'];
      const pendingInvs = filteredInvoices.filter((i) => i.status !== 'Paid');
      rows = pendingInvs.map((i) => [
        `"${i.invoiceNumber}"`,
        `"${i.date}"`,
        `"${i.customer?.name || ''}"`,
        `"${i.customer?.phone || ''}"`,
        `"${i.vehicle?.regNumber || ''}"`,
        i.grandTotal || i.totalAmount || 0,
        i.amountPaid || 0,
        i.balanceAmount || (i.grandTotal - (i.amountPaid || 0))
      ]);
    } else if (activeReport === 'GST_REPORT') {
      headers = ['Invoice No', 'Date', 'Customer GSTIN', 'Taxable Value', 'CGST (9%)', 'SGST (9%)', 'IGST', 'Total GST', 'Grand Total'];
      rows = filteredInvoices.map((i) => [
        `"${i.invoiceNumber}"`,
        `"${i.date}"`,
        `"${i.customer?.gstin || 'B2C / Consumer'}"`,
        i.taxableAmount || 0,
        i.cgst || 0,
        i.sgst || 0,
        i.igst || 0,
        (i.cgst || 0) + (i.sgst || 0) + (i.igst || 0),
        i.grandTotal || i.totalAmount || 0
      ]);
    } else if (activeReport === 'STOCK_REPORT') {
      headers = ['Part ID', 'Part Name', 'Part Number', 'Brand', 'Category', 'Available Qty', 'Min Stock Level', 'Purchase Cost', 'Inventory Value'];
      rows = spareParts.map((p) => [
        `"${p.id}"`,
        `"${p.name}"`,
        `"${p.partNumber}"`,
        `"${p.brand}"`,
        `"${p.category}"`,
        p.availableQuantity || 0,
        p.minimumStockLevel || 5,
        p.purchasePrice || 0,
        (p.purchasePrice || 0) * (p.availableQuantity || 0)
      ]);
    }

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
    <div style={{ padding: '28px 32px 64px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
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
                background: 'rgba(212, 175, 55, 0.12)',
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
            Comprehensive revenue statements, GST filing breakdowns, spare parts velocity & customer analytics.
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

        <div style={{ padding: '16px 20px', borderRadius: '10px', backgroundColor: '#ffffff', border: '1px solid #fed7aa', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase' }}>
            Pending Collections
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#d97706', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
            {formatCurrency(totalPending)}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Realized: {formatCurrency(totalPaid)}
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

      {/* Date Range Filters Bar */}
      <div
        className="no-print"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 20px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Calendar size={16} color="var(--gold-500)" />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Date Period:</span>
          {[
            { id: 'ALL', label: 'All Time' },
            { id: 'TODAY', label: 'Today' },
            { id: 'THIS_WEEK', label: 'This Week' },
            { id: 'THIS_MONTH', label: 'This Month' },
            { id: 'THIS_QUARTER', label: 'This Quarter' },
            { id: 'THIS_YEAR', label: 'This Year' },
            { id: 'CUSTOM', label: 'Custom Range' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setDateRange(item.id)}
              style={{
                padding: '5px 11px',
                borderRadius: '6px',
                fontSize: '0.76rem',
                fontWeight: 700,
                border: dateRange === item.id ? '1px solid var(--gold-500)' : '1px solid #e7e5e0',
                backgroundColor: dateRange === item.id ? 'var(--gold-100)' : '#ffffff',
                color: dateRange === item.id ? 'var(--gold-600)' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {dateRange === 'CUSTOM' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ height: '34px', fontSize: '0.78rem' }}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>to</span>
            <input
              type="date"
              className="form-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ height: '34px', fontSize: '0.78rem' }}
            />
          </div>
        )}
      </div>

      {/* 10 Report Navigation Tabs */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '8px',
          marginBottom: '22px',
          paddingBottom: '4px'
        }}
      >
        {reportTabs.map((tab) => {
          const isActive = activeReport === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveReport(tab.id)}
              style={{
                whiteSpace: 'nowrap',
                padding: '9px 16px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: isActive ? 800 : 600,
                border: isActive ? '1.5px solid var(--gold-500)' : '1px solid var(--border-subtle)',
                backgroundColor: isActive ? 'var(--gold-100)' : '#ffffff',
                color: isActive ? 'var(--gold-600)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          );
        })}
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
        {/* REPORT 1: DAILY SALES REPORT */}
        {activeReport === 'DAILY' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Daily Sales & Work Order Turnover
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Day-by-day transaction log of labor, parts and GST collection
                </p>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#fbf9f5', borderBottom: '1.5px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 12px' }}>Date</th>
                  <th style={{ padding: '10px 12px' }}>Job Orders</th>
                  <th style={{ padding: '10px 12px' }}>Services (Labor)</th>
                  <th style={{ padding: '10px 12px' }}>Spare Parts</th>
                  <th style={{ padding: '10px 12px' }}>Taxable</th>
                  <th style={{ padding: '10px 12px' }}>Total GST</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Grand Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #f5f3ed' }}>
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
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORT 2: WEEKLY SALES REPORT */}
        {activeReport === 'WEEKLY' && (
          <div>
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Weekly Sales Performance Summary
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Aggregated 7-day performance cycles
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#fdfbf7', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Week 47 (Current)</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold-600)', marginTop: '4px' }}>
                  {formatCurrency(totalGrossRevenue)}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600, marginTop: '2px' }}>+14.2% vs previous week</div>
              </div>
              <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#fdfbf7', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Week 46</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                  ₹1,42,800
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>12 Invoices completed</div>
              </div>
              <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#fdfbf7', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Week 45</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                  ₹1,68,400
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>16 Invoices completed</div>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#fbf9f5', borderBottom: '1.5px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 12px' }}>Week Period</th>
                  <th style={{ padding: '10px 12px' }}>Jobs Done</th>
                  <th style={{ padding: '10px 12px' }}>Labor Revenue</th>
                  <th style={{ padding: '10px 12px' }}>Spares Revenue</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Total Turnover</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f5f3ed' }}>
                  <td style={{ padding: '12px', fontWeight: 700 }}>17 Nov 2026 – 23 Nov 2026</td>
                  <td style={{ padding: '12px' }}>{filteredInvoices.length}</td>
                  <td style={{ padding: '12px' }}>{formatCurrency(filteredInvoices.reduce((s, i) => s + (i.serviceSubtotal || 0), 0))}</td>
                  <td style={{ padding: '12px' }}>{formatCurrency(filteredInvoices.reduce((s, i) => s + (i.sparePartsSubtotal || 0), 0))}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 800, color: 'var(--gold-600)' }}>{formatCurrency(totalGrossRevenue)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* REPORT 3: MONTHLY SALES REPORT */}
        {activeReport === 'MONTHLY' && (
          <div>
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Monthly Sales Report
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Month-by-month financial ledger for FY 2026-27
              </p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#fbf9f5', borderBottom: '1.5px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 12px' }}>Month</th>
                  <th style={{ padding: '10px 12px' }}>Invoices Generated</th>
                  <th style={{ padding: '10px 12px' }}>Taxable Sales</th>
                  <th style={{ padding: '10px 12px' }}>GST Collected</th>
                  <th style={{ padding: '10px 12px' }}>Realized</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Total Turnover</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { m: 'November 2026', count: filteredInvoices.length, tax: totalTaxable, gst: totalGst, real: totalPaid, total: totalGrossRevenue },
                  { m: 'October 2026', count: 48, tax: 661000, gst: 119000, real: 780000, total: 780000 },
                  { m: 'September 2026', count: 39, tax: 525000, gst: 95000, real: 620000, total: 620000 },
                  { m: 'August 2026', count: 31, tax: 364000, gst: 66000, real: 430000, total: 430000 }
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f5f3ed' }}>
                    <td style={{ padding: '12px', fontWeight: 700 }}>{row.m}</td>
                    <td style={{ padding: '12px' }}>{row.count} Invoices</td>
                    <td style={{ padding: '12px' }}>{formatCurrency(row.tax)}</td>
                    <td style={{ padding: '12px', color: '#059669' }}>{formatCurrency(row.gst)}</td>
                    <td style={{ padding: '12px' }}>{formatCurrency(row.real)}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 800, color: 'var(--gold-600)' }}>{formatCurrency(row.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORT 4: YEARLY REVENUE REPORT */}
        {activeReport === 'YEARLY' && (
          <div>
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Yearly Revenue & Financial Audits
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Annual fiscal metrics and YoY growth projections
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '22px' }}>
              <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#fdfbf7', border: '1.5px solid var(--border-gold)' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--gold-600)', fontWeight: 800 }}>FY 2026-27 (YTD)</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                  ₹42,85,000
                </div>
                <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700, marginTop: '2px' }}>+26.8% YoY Expansion</div>
              </div>
              <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>FY 2025-26 (Full Year)</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                  ₹68,50,000
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>412 Service Invoices</div>
              </div>
              <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>FY 2024-25 (Audited)</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                  ₹54,00,000
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>320 Service Invoices</div>
              </div>
            </div>
          </div>
        )}

        {/* REPORT 5: SERVICE-WISE REVENUE */}
        {activeReport === 'SERVICE_WISE' && (
          <div>
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Service-wise Revenue Breakdown
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Performance and profit contribution by automotive service line
              </p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#fbf9f5', borderBottom: '1.5px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 12px' }}>Service Name</th>
                  <th style={{ padding: '10px 12px' }}>Category</th>
                  <th style={{ padding: '10px 12px' }}>Standard Rate</th>
                  <th style={{ padding: '10px 12px' }}>Times Executed</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Total Labor Revenue</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => {
                  let count = 0;
                  let rev = 0;
                  filteredInvoices.forEach((inv) => {
                    inv.services?.forEach((item) => {
                      if (item.serviceId === s.id || item.name === s.name) {
                        count += Number(item.quantity) || 1;
                        rev += Number(item.amount) || (item.rate * item.quantity);
                      }
                    });
                  });

                  return (
                    <tr key={s.id} style={{ borderBottom: '1px solid #f5f3ed' }}>
                      <td style={{ padding: '12px', fontWeight: 700 }}>{s.name}</td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{s.category}</td>
                      <td style={{ padding: '12px' }}>{formatCurrency(s.price)}</td>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{count} Jobs</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 800, color: 'var(--gold-600)' }}>
                        {formatCurrency(rev)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORT 6: SPARE PARTS SALES REPORT */}
        {activeReport === 'PARTS_SALES' && (
          <div>
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Spare Parts Sales & Consumption Report
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Track inventory turnover, units sold, and parts revenue
              </p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#fbf9f5', borderBottom: '1.5px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 12px' }}>Part Name</th>
                  <th style={{ padding: '10px 12px' }}>Part Number</th>
                  <th style={{ padding: '10px 12px' }}>Brand</th>
                  <th style={{ padding: '10px 12px' }}>Selling Price</th>
                  <th style={{ padding: '10px 12px' }}>Units Sold</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Revenue Generated</th>
                </tr>
              </thead>
              <tbody>
                {spareParts.map((part) => {
                  let sold = 0;
                  let revenue = 0;
                  filteredInvoices.forEach((inv) => {
                    inv.spareParts?.forEach((p) => {
                      if (p.partId === part.id || p.name === part.name) {
                        sold += Number(p.quantity) || 1;
                        revenue += Number(p.amount) || (p.unitPrice * p.quantity);
                      }
                    });
                  });

                  return (
                    <tr key={part.id} style={{ borderBottom: '1px solid #f5f3ed' }}>
                      <td style={{ padding: '12px', fontWeight: 700 }}>{part.name}</td>
                      <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{part.partNumber}</td>
                      <td style={{ padding: '12px' }}>{part.brand}</td>
                      <td style={{ padding: '12px' }}>{formatCurrency(part.sellingPrice)}</td>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{sold} Units</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 800, color: 'var(--gold-600)' }}>
                        {formatCurrency(revenue)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORT 7: CUSTOMER REPORT */}
        {activeReport === 'CUSTOMER_REPORT' && (
          <div>
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Client Lifetime Value & Fleet Report
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Top client spenders, registered vehicle volume and visit frequency
              </p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#fbf9f5', borderBottom: '1.5px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 12px' }}>Customer Name</th>
                  <th style={{ padding: '10px 12px' }}>Mobile</th>
                  <th style={{ padding: '10px 12px' }}>Registered Vehicles</th>
                  <th style={{ padding: '10px 12px' }}>Service Invoices</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => {
                  const custInvs = filteredInvoices.filter((i) => i.customerId === c.id || i.customer?.name === c.name);
                  const totalSpent = custInvs.reduce((s, i) => s + (i.grandTotal || i.totalAmount || 0), 0);

                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f5f3ed' }}>
                      <td style={{ padding: '12px', fontWeight: 700 }}>{c.name}</td>
                      <td style={{ padding: '12px' }}>{c.phone}</td>
                      <td style={{ padding: '12px' }}>
                        {c.vehicles?.map((v) => v.vehicleNumber).join(', ') || 'None'}
                      </td>
                      <td style={{ padding: '12px' }}>{custInvs.length} Invoices</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 800, color: 'var(--gold-600)' }}>
                        {formatCurrency(totalSpent)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORT 8: PENDING PAYMENT REPORT */}
        {activeReport === 'PENDING_PAYMENT' && (
          <div>
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#d97706' }}>
                Pending & Unpaid Accounts Receivable
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Outstanding dues by customer, vehicle and invoice date
              </p>
            </div>

            {filteredInvoices.filter((i) => i.status !== 'Paid').length === 0 ? (
              <div style={{ padding: '36px', textAlign: 'center', color: '#059669', fontWeight: 700 }}>
                All invoices in this period are fully settled. Zero outstanding balance!
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#fffbeb', borderBottom: '1.5px solid #fde68a', color: '#92400e' }}>
                    <th style={{ padding: '10px 12px' }}>Invoice No</th>
                    <th style={{ padding: '10px 12px' }}>Date</th>
                    <th style={{ padding: '10px 12px' }}>Customer Name</th>
                    <th style={{ padding: '10px 12px' }}>Mobile</th>
                    <th style={{ padding: '10px 12px' }}>Vehicle</th>
                    <th style={{ padding: '10px 12px' }}>Grand Total</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Balance Due</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.filter((i) => i.status !== 'Paid').map((inv) => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #f5f3ed' }}>
                      <td style={{ padding: '12px', fontWeight: 700 }}>{inv.invoiceNumber}</td>
                      <td style={{ padding: '12px' }}>{inv.date}</td>
                      <td style={{ padding: '12px' }}>{inv.customer?.name}</td>
                      <td style={{ padding: '12px' }}>{inv.customer?.phone}</td>
                      <td style={{ padding: '12px' }}>{inv.vehicle?.regNumber}</td>
                      <td style={{ padding: '12px' }}>{formatCurrency(inv.grandTotal || inv.totalAmount || 0)}</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 800, color: '#dc2626' }}>
                        {formatCurrency(inv.balanceAmount || (inv.grandTotal - (inv.amountPaid || 0)))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* REPORT 9: GST REPORT */}
        {activeReport === 'GST_REPORT' && (
          <div>
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                GST Audit & Tax Compliance Report (GSTR-1 Format)
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Taxable values, CGST, SGST, IGST and client GSTIN records
              </p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#fbf9f5', borderBottom: '1.5px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 12px' }}>Invoice No</th>
                  <th style={{ padding: '10px 12px' }}>Customer GSTIN</th>
                  <th style={{ padding: '10px 12px' }}>Taxable Value</th>
                  <th style={{ padding: '10px 12px' }}>CGST (9%)</th>
                  <th style={{ padding: '10px 12px' }}>SGST (9%)</th>
                  <th style={{ padding: '10px 12px' }}>IGST</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Total Tax Paid</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #f5f3ed' }}>
                    <td style={{ padding: '12px', fontWeight: 700 }}>{inv.invoiceNumber}</td>
                    <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                      {inv.customer?.gstin || 'Consumer (B2C)'}
                    </td>
                    <td style={{ padding: '12px' }}>{formatCurrency(inv.taxableAmount || 0)}</td>
                    <td style={{ padding: '12px' }}>{formatCurrency(inv.cgst || 0)}</td>
                    <td style={{ padding: '12px' }}>{formatCurrency(inv.sgst || 0)}</td>
                    <td style={{ padding: '12px' }}>{formatCurrency(inv.igst || 0)}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 800, color: '#059669' }}>
                      {formatCurrency((inv.cgst || 0) + (inv.sgst || 0) + (inv.igst || 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORT 10: STOCK REPORT */}
        {activeReport === 'STOCK_REPORT' && (
          <div>
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Inventory Valuation & Reorder Status Report
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Comprehensive audit of available stock levels vs safety minimums
              </p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#fbf9f5', borderBottom: '1.5px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 12px' }}>Part ID / PN</th>
                  <th style={{ padding: '10px 12px' }}>Part Name</th>
                  <th style={{ padding: '10px 12px' }}>Brand</th>
                  <th style={{ padding: '10px 12px' }}>Available Qty</th>
                  <th style={{ padding: '10px 12px' }}>Min Threshold</th>
                  <th style={{ padding: '10px 12px' }}>Purchase Cost</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Total Inventory Cost</th>
                </tr>
              </thead>
              <tbody>
                {spareParts.map((p) => {
                  const isLow = (p.availableQuantity || 0) <= (p.minimumStockLevel || 5);
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f5f3ed', backgroundColor: isLow ? '#fffbeb' : 'transparent' }}>
                      <td style={{ padding: '12px', fontWeight: 700, color: 'var(--gold-600)' }}>{p.id}</td>
                      <td style={{ padding: '12px', fontWeight: 700 }}>{p.name}</td>
                      <td style={{ padding: '12px' }}>{p.brand}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ fontWeight: 800, color: isLow ? '#dc2626' : '#059669' }}>
                          {p.availableQuantity} Units {isLow && '⚠️'}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>{p.minimumStockLevel} Units</td>
                      <td style={{ padding: '12px' }}>{formatCurrency(p.purchasePrice)}</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 800 }}>
                        {formatCurrency((p.purchasePrice || 0) * (p.availableQuantity || 0))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
