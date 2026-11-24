import React, { useState } from 'react';
import { useBilling } from '../context/useBilling';
import { 
  Plus, 
  Search, 
  ReceiptText, 
  Printer, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Eye, 
  Download, 
  Filter, 
  IndianRupee, 
  Clock, 
  Car, 
  User, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

export default function InvoicesPage() {
  const { 
    invoices, 
    formatCurrency, 
    setSelectedInvoiceForView, 
    setIsInvoiceModalOpen, 
    setInvoiceToEdit, 
    deleteInvoice 
  } = useBilling();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Filtered & Sorted Invoices
  const filteredInvoices = invoices.filter((inv) => {
    const q = searchQuery.toLowerCase();
    return (
      inv.invoiceNumber?.toLowerCase().includes(q) ||
      inv.customer?.name?.toLowerCase().includes(q) ||
      inv.customer?.phone?.includes(q) ||
      inv.vehicle?.regNumber?.toLowerCase().includes(q) ||
      inv.vehicle?.model?.toLowerCase().includes(q) ||
      inv.jobCardNumber?.toLowerCase().includes(q)
    );
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'amount-high') return (b.grandTotal || b.totalAmount || 0) - (a.grandTotal || a.totalAmount || 0);
    if (sortBy === 'amount-low') return (a.grandTotal || a.totalAmount || 0) - (b.grandTotal || b.totalAmount || 0);
    return 0;
  });

  const totalBilled = filteredInvoices.reduce((sum, i) => sum + (i.grandTotal || i.totalAmount || 0), 0);
  const totalInvoicesCount = filteredInvoices.length;
  const avgInvoiceValue = totalInvoicesCount > 0 ? totalBilled / totalInvoicesCount : 0;

  const handleExportCSV = () => {
    if (filteredInvoices.length === 0) return;
    const headers = [
      'Invoice No',
      'Date',
      'Job Card',
      'Invoice Type',
      'Customer Name',
      'Mobile',
      'Vehicle Reg',
      'Brand & Model',
      'Service Subtotal',
      'Spares Subtotal',
      'Gross Total',
      'Discount',
      'Taxable',
      'CGST',
      'SGST',
      'Grand Total',
      'Payment Method',
      'Transaction Ref'
    ];

    const rows = filteredInvoices.map((inv) => [
      `"${inv.invoiceNumber}"`,
      `"${inv.date}"`,
      `"${inv.jobCardNumber || ''}"`,
      `"${inv.invoiceType || 'Tax Invoice'}"`,
      `"${inv.customer?.name || ''}"`,
      `"${inv.customer?.phone || ''}"`,
      `"${inv.vehicle?.regNumber || ''}"`,
      `"${inv.vehicle?.brand || ''} ${inv.vehicle?.model || ''}"`,
      inv.serviceSubtotal || 0,
      inv.sparePartsSubtotal || 0,
      inv.grossTotal || 0,
      inv.discountAmount || 0,
      inv.taxableAmount || 0,
      inv.cgst || 0,
      inv.sgst || 0,
      inv.grandTotal || inv.totalAmount || 0,
      `"${inv.paymentMethod || ''}"`,
      `"${inv.transactionId || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SR_CARS_Invoices_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenNewInvoice = () => {
    setInvoiceToEdit(null);
    setIsInvoiceModalOpen(true);
  };

  return (
    <div className="page-container">
      {/* Header Banner */}
      <div
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
              Invoices & Work Orders
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
            Invoice & Billing Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
            Generate luxury service invoices, synchronize spare inventory, record settlements and print A4 bills.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleExportCSV}
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
            <Download size={16} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenNewInvoice}
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
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
            <Plus size={18} />
            <span>Generate New Invoice</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div style={{ padding: '16px 20px', borderRadius: '10px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Billed Turnover
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
            {formatCurrency(totalBilled)}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Across {filteredInvoices.length} invoices
          </div>
        </div>

        <div style={{ padding: '16px 20px', borderRadius: '10px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Invoices
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--gold-600)', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
            {totalInvoicesCount}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Generated billing records
          </div>
        </div>

        <div style={{ padding: '16px 20px', borderRadius: '10px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Average Invoice Value
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
            {formatCurrency(avgInvoiceValue)}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Per invoice average
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: '22px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <Search
            size={16}
            color="var(--gold-500)"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search by invoice number, customer name, mobile, vehicle reg or job card..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: '38px',
              height: '38px',
              fontSize: '0.84rem',
              borderRadius: 'var(--radius-md)',
              background: '#ffffff',
              borderColor: 'var(--border-subtle)',
              width: '100%'
            }}
          />
        </div>

        {/* Sort Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            className="form-input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ height: '38px', fontSize: '0.84rem', padding: '0 12px' }}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="amount-high">Amount: High to Low</option>
            <option value="amount-low">Amount: Low to High</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: '#f8fafc',
                  borderBottom: '1.5px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  fontSize: '0.74rem',
                  textTransform: 'uppercase'
                }}
              >
                <th style={{ padding: '12px 14px' }}>Invoice No</th>
                <th style={{ padding: '12px 14px' }}>Date & Job Card</th>
                <th style={{ padding: '12px 14px' }}>Customer Details</th>
                <th style={{ padding: '12px 14px' }}>Vehicle Details</th>
                <th style={{ padding: '12px 14px' }}>Items Summary</th>
                <th style={{ padding: '12px 14px' }}>Grand Total</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No invoices found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    style={{ borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* Invoice No */}
                    <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                        {inv.invoiceNumber}
                      </div>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          color: 'var(--gold-600)',
                          background: 'rgba(37,99,235,0.12)',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontWeight: 700
                        }}
                      >
                        {inv.invoiceType || 'Tax Invoice'}
                      </span>
                    </td>

                    {/* Date & Job Card */}
                    <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                        {inv.date}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {inv.jobCardNumber || 'JC-2026-1041'}
                      </div>
                    </td>

                    {/* Customer */}
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {inv.customer?.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {inv.customer?.phone}
                      </div>
                    </td>

                    {/* Vehicle */}
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {inv.vehicle?.regNumber}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {inv.vehicle?.brand} {inv.vehicle?.model}
                      </div>
                    </td>

                    {/* Items */}
                    <td style={{ padding: '14px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                      <div>{inv.services?.length || 0} Services</div>
                      <div>{inv.spareParts?.length || 0} Products</div>
                    </td>

                    {/* Grand Total */}
                    <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--gold-600)' }}>
                        {formatCurrency(inv.grandTotal || inv.totalAmount || 0)}
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        {/* View A4 Print Preview */}
                        <button
                          onClick={() => setSelectedInvoiceForView(inv)}
                          title="Preview & Print A4 Invoice"
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-gold)',
                            backgroundColor: '#ffffff',
                            color: 'var(--gold-600)',
                            cursor: 'pointer'
                          }}
                        >
                          <Eye size={15} />
                        </button>

                        {/* Print Invoice Directly */}
                        <button
                          onClick={() => {
                            setSelectedInvoiceForView(inv);
                            setTimeout(() => window.print(), 300);
                          }}
                          title="Print Invoice"
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: '#ffffff',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer'
                          }}
                        >
                          <Printer size={15} />
                        </button>

                        {/* Edit Invoice */}
                        <button
                          onClick={() => {
                            setInvoiceToEdit(inv);
                            setIsInvoiceModalOpen(true);
                          }}
                          title="Edit Invoice"
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: '#ffffff',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer'
                          }}
                        >
                          <Edit3 size={15} />
                        </button>

                        {/* Delete Invoice */}
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete invoice #${inv.invoiceNumber}?`)) {
                              deleteInvoice(inv.id);
                            }
                          }}
                          title="Delete Invoice"
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid #fecaca',
                            backgroundColor: '#fff5f5',
                            color: '#dc2626',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
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
