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
        
    </div>
  );
}
