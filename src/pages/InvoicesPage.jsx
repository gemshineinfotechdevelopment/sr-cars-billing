import React, { useState } from 'react';
import { useBilling } from '../context/useBilling';
import { 
  Plus, 
  Search, 
  Receipt, 
  Printer, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  ArrowUpDown,
  Download
} from 'lucide-react';

export default function InvoicesPage() {
  const { 
    invoices, 
    formatCurrency, 
    setSelectedInvoiceForView, 
    setIsInvoiceModalOpen, 
    setInvoiceToEdit, 
    deleteInvoice, 
    markAsPaid 
  } = useBilling();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  // Filtered & Sorted Invoices
  const filteredInvoices = invoices.filter((inv) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.customer.name.toLowerCase().includes(q) ||
      (inv.customer.phone && inv.customer.phone.includes(q)) ||
      (inv.vehicle.makeModel && inv.vehicle.makeModel.toLowerCase().includes(q)) ||
      (inv.vehicle.regNumber && inv.vehicle.regNumber.toLowerCase().includes(q));

    const matchStatus = statusFilter === 'ALL' || inv.status.toUpperCase() === statusFilter;

    return matchSearch && matchStatus;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'amount-high') return b.totalAmount - a.totalAmount;
    if (sortBy === 'amount-low') return a.totalAmount - b.totalAmount;
    return 0;
  });

  const totalBilled = filteredInvoices.reduce((sum, i) => sum + (i.totalAmount || 0), 0);
  const paidCount = filteredInvoices.filter((i) => i.status === 'Paid').length;
  const pendingCount = filteredInvoices.filter((i) => i.status === 'Pending').length;
  const overdueCount = filteredInvoices.filter((i) => i.status === 'Overdue').length;

  const handleExportCSV = () => {
    if (filteredInvoices.length === 0) return;
    const headers = ['Invoice No', 'Date', 'Due Date', 'Customer', 'Phone', 'Vehicle', 'Reg No', 'Amount', 'Status'];
    const rows = filteredInvoices.map((inv) => [
      `"${inv.invoiceNumber}"`,
      `"${inv.date}"`,
      `"${inv.dueDate}"`,
      `"${inv.customer.name}"`,
      `"${inv.customer.phone || ''}"`,
      `"${inv.vehicle.makeModel}"`,
      `"${inv.vehicle.regNumber}"`,
      inv.totalAmount,
      `"${inv.status}"`
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
            Invoice Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Author, view, print, and track luxury automotive client tax invoices.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn-outline" onClick={handleExportCSV}>
            <Download size={16} />
            <span>Export CSV</span>
          </button>

          <button
            className="btn-gold"
            onClick={() => {
              setInvoiceToEdit(null);
              setIsInvoiceModalOpen(true);
            }}
          >
            <Plus size={18} />
            <span>New Invoice</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Pill Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div className="luxury-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
            Total Invoices Filtered
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
            {filteredInvoices.length} <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)' }}>records</span>
          </div>
        </div>

        <div className="luxury-card luxury-card-gold" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--gold-600)', fontWeight: 800 }}>
            Filtered Value
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--gold-600)', marginTop: '4px' }}>
            {formatCurrency(totalBilled)}
          </div>
        </div>

        <div className="luxury-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
            Settlement Status
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--status-paid)' }}>
              {paidCount} Paid
            </span>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--status-pending)' }}>
              {pendingCount} Pending
            </span>
            {overdueCount > 0 && (
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--status-overdue)' }}>
                {overdueCount} Overdue
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Search & Filters Toolbar */}
      <div
        className="luxury-card"
        style={{
          padding: '18px 24px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        <div style={{ position: 'relative', minWidth: '300px', flex: 1 }}>
          <Search
            size={17}
            color="var(--gold-500)"
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search invoice #, client name, vehicle model, reg plate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '38px', height: '40px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {['ALL', 'PAID', 'PENDING', 'OVERDUE', 'DRAFT'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: statusFilter === st ? '1.5px solid var(--gold-500)' : '1px solid var(--border-subtle)',
                background: statusFilter === st ? 'var(--gold-subtle)' : '#ffffff',
                color: statusFilter === st ? 'var(--gold-600)' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {st}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowUpDown size={15} color="var(--gold-500)" />
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ width: 'auto', padding: '6px 12px', fontSize: '0.82rem' }}
          >
            <option value="newest">Sort: Newest Date</option>
            <option value="oldest">Sort: Oldest Date</option>
            <option value="amount-high">Amount: High to Low</option>
            <option value="amount-low">Amount: Low to High</option>
          </select>
        </div>
      </div>

      {/* Main Invoices Table */}
      <div className="luxury-card" style={{ padding: '0', overflow: 'hidden' }}>
        {filteredInvoices.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Receipt size={42} style={{ margin: '0 auto 12px', opacity: 0.5, color: 'var(--gold-500)' }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '6px', fontWeight: 800 }}>
              No Invoices Found
            </h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}>
              No billing entries match your search criteria.
            </p>
            <button
              className="btn-gold"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="luxury-table">
              <thead>
                <tr>
                  <th>Invoice No</th>
                  <th>Customer</th>
                  <th>Vehicle Details</th>
                  <th>Date & Due</th>
                  <th>Items / Services</th>
                  <th>Grand Total</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 800,
                          color: 'var(--gold-600)',
                          fontSize: '0.9rem'
                        }}
                      >
                        {inv.invoiceNumber}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {inv.paymentMethod}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700 }}>{inv.customer.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {inv.customer.phone || inv.customer.company}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600 }}>{inv.vehicle.makeModel}</div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontFamily: 'var(--font-mono)',
                            padding: '1px 6px',
                            background: '#fbf7ee',
                            border: '1px solid rgba(212, 175, 55, 0.35)',
                            borderRadius: '3px',
                            color: '#85580a',
                            fontWeight: 700
                          }}
                        >
                          {inv.vehicle.regNumber}
                        </span>
                        {inv.vehicle.odometer && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {inv.vehicle.odometer}
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: 600 }}>{inv.date}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Due: {inv.dueDate}</div>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        <strong>{inv.items?.length || 0}</strong> item(s)
                      </div>
                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--text-muted)',
                          maxWidth: '180px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {inv.items?.[0]?.name}
                      </div>
                    </td>

                    <td>
                      <span
                        style={{
                          fontWeight: 800,
                          fontFamily: 'var(--font-sans)',
                          color: 'var(--text-primary)',
                          fontSize: '1rem'
                        }}
                      >
                        {formatCurrency(inv.totalAmount)}
                      </span>
                    </td>

                    <td>
                      <span className={`badge badge-${inv.status.toLowerCase()}`}>
                        {inv.status}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          className="btn-icon"
                          title="Print / View Invoice"
                          onClick={() => setSelectedInvoiceForView(inv)}
                          style={{ width: '32px', height: '32px' }}
                        >
                          <Printer size={15} />
                        </button>

                        <button
                          className="btn-icon"
                          title="Edit Invoice"
                          onClick={() => {
                            setInvoiceToEdit(inv);
                            setIsInvoiceModalOpen(true);
                          }}
                          style={{ width: '32px', height: '32px' }}
                        >
                          <Edit3 size={15} />
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

                        <button
                          className="btn-icon"
                          title="Delete Invoice"
                          onClick={() => {
                            if (window.confirm(`Delete invoice #${inv.invoiceNumber}?`)) {
                              deleteInvoice(inv.id);
                            }
                          }}
                          style={{ width: '32px', height: '32px', color: 'var(--status-overdue)' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
