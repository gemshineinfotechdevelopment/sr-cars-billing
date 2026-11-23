import React from 'react';
import { useBilling } from '../../context/BillingContext';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  Edit3, 
  Crown, 
  QrCode, 
  Car, 
  Building2, 
  CreditCard
} from 'lucide-react';

export default function InvoiceViewModal() {
  const { 
    selectedInvoiceForView, 
    setSelectedInvoiceForView, 
    settings, 
    formatCurrency, 
    markAsPaid,
    setInvoiceToEdit,
    setIsInvoiceModalOpen
  } = useBilling();

  if (!selectedInvoiceForView) return null;

  const inv = selectedInvoiceForView;

  const handlePrint = () => {
    window.print();
  };

  const handleEditThis = () => {
    setInvoiceToEdit(inv);
    setSelectedInvoiceForView(null);
    setIsInvoiceModalOpen(true);
  };

  return (
    <div 
      className="modal-backdrop print-mode" 
      onClick={() => setSelectedInvoiceForView(null)}
      style={{ padding: '20px 10px' }}
    >
      <div 
        className="modal-content printable-invoice-container" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '860px', 
          width: '100%', 
          backgroundColor: '#ffffff', 
          color: '#0f172a',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      >
        {/* Top Control Bar (Never Printed) */}
        <div
          className="no-print"
          style={{
            padding: '14px 24px',
            backgroundColor: '#0a0d14',
            borderBottom: '1px solid rgba(212,175,55,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#f8fafc'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Crown size={18} color="#d4af37" />
            <span style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Official Tax Invoice Preview • {inv.invoiceNumber}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {inv.status !== 'Paid' && (
              <button
                onClick={() => markAsPaid(inv.id)}
                className="btn-outline"
                style={{ color: '#10b981', borderColor: 'rgba(16,185,129,0.5)', padding: '6px 12px', fontSize: '0.8rem' }}
              >
                <CheckCircle2 size={15} />
                <span>Mark Paid</span>
              </button>
            )}

            <button
              onClick={handleEditThis}
              className="btn-outline"
              style={{ color: '#e5b869', borderColor: 'rgba(229,184,105,0.5)', padding: '6px 12px', fontSize: '0.8rem' }}
            >
              <Edit3 size={15} />
              <span>Edit</span>
            </button>

            <button
              onClick={handlePrint}
              className="btn-gold"
              style={{ padding: '6px 16px', fontSize: '0.82rem' }}
            >
              <Printer size={16} />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={() => setSelectedInvoiceForView(null)}
              className="btn-icon"
              style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.1)' }}
            >
              <X size={16} color="#ffffff" />
            </button>
          </div>
        </div>

        {/* THE ROYAL PRINTABLE AUTOMOTIVE INVOICE SHEET */}
        <div
          style={{
            padding: '36px 44px',
            fontFamily: 'var(--font-sans)',
            backgroundColor: '#ffffff',
            color: '#0f172a',
            position: 'relative'
          }}
        >
          {/* Subtle Watermark */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-30deg)',
              fontFamily: 'var(--font-display)',
              fontSize: '6rem',
              fontWeight: 900,
              color: 'rgba(212, 175, 55, 0.04)',
              letterSpacing: '12px',
              pointerEvents: 'none',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              zIndex: 0
            }}
          >
            SR CARS PRESTIGE
          </div>

          {/* Invoice Header Section */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2px solid #0f172a',
              paddingBottom: '24px',
              marginBottom: '24px',
              position: 'relative',
              zIndex: 1
            }}
          >
            {/* Left: Dealership Identity */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '8px',
                    background: '#0b0f19',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid #d4af37'
                  }}
                >
                  <Crown size={24} color="#d4af37" />
                </div>
                <div>
                  <h1
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.75rem',
                      fontWeight: 800,
                      letterSpacing: '2.5px',
                      color: '#0b0f19',
                      margin: 0,
                      lineHeight: 1
                    }}
                  >
                    {settings.dealershipName || 'SR CARS'}
                  </h1>
                  <span style={{ fontSize: '0.72rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#b89228', fontWeight: 700 }}>
                    {settings.tagline || 'Luxury Automotive & Performance Studio'}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, maxWidth: '340px' }}>
                <div>{settings.address}</div>
                <div>Phone: <strong>{settings.phone}</strong> | Email: {settings.email}</div>
                <div>GSTIN: <strong style={{ color: '#0f172a' }}>{settings.gstin}</strong> | PAN: {settings.pan}</div>
              </div>
            </div>

            {/* Right: Tax Invoice Stamp & Numbers */}
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontSize: '1.4rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  letterSpacing: '2px',
                  color: '#0b0f19',
                  marginBottom: '6px'
                }}
              >
                TAX INVOICE
              </div>

              <div
                style={{
                  display: 'inline-block',
                  padding: '4px 14px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  backgroundColor: inv.status === 'Paid' ? '#d1fae5' : inv.status === 'Overdue' ? '#fee2e2' : '#fef3c7',
                  color: inv.status === 'Paid' ? '#065f46' : inv.status === 'Overdue' ? '#991b1b' : '#92400e',
                  border: `1px solid ${inv.status === 'Paid' ? '#10b981' : inv.status === 'Overdue' ? '#ef4444' : '#f59e0b'}`,
                  marginBottom: '10px'
                }}
              >
                Status: {inv.status}
              </div>

              <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>
                <div>Invoice No: <strong style={{ fontFamily: 'var(--font-mono)', color: '#0b0f19' }}>{inv.invoiceNumber}</strong></div>
                <div>Invoice Date: <strong>{inv.date}</strong></div>
                <div>Payment Due: <strong>{inv.dueDate}</strong></div>
                <div>Payment Method: <strong>{inv.paymentMethod}</strong></div>
              </div>
            </div>
          </div>

          {/* Customer & Vehicle 2-Column Info Card */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 1fr',
              gap: '20px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '16px 20px',
              marginBottom: '24px',
              position: 'relative',
              zIndex: 1
            }}
          >
            {/* Left: Billed To */}
            <div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#b89228',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Building2 size={13} />
                Client / Billed To
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                {inv.customer.name}
              </div>
              {inv.customer.company && (
                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#334155' }}>
                  {inv.customer.company}
                </div>
              )}
              <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px', lineHeight: 1.4 }}>
                {inv.customer.address && <div>{inv.customer.address}</div>}
                <div>Phone: {inv.customer.phone} {inv.customer.email ? `• ${inv.customer.email}` : ''}</div>
                {inv.customer.gstin && (
                  <div style={{ marginTop: '2px' }}>
                    GSTIN: <strong style={{ color: '#0f172a', fontFamily: 'var(--font-mono)' }}>{inv.customer.gstin}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Vehicle Profile */}
            <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '20px' }}>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#2563eb',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Car size={13} />
                Vehicle Specification
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                {inv.vehicle.makeModel}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '6px 0' }}>
                <span
                  style={{
                    backgroundColor: '#0b0f19',
                    color: '#ffffff',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    letterSpacing: '1px'
                  }}
                >
                  {inv.vehicle.regNumber}
                </span>
                {inv.vehicle.year && (
                  <span style={{ fontSize: '0.75rem', color: '#64748b', alignSelf: 'center' }}>
                    Year: <strong>{inv.vehicle.year}</strong>
                  </span>
                )}
                {inv.vehicle.odometer && (
                  <span style={{ fontSize: '0.75rem', color: '#64748b', alignSelf: 'center' }}>
                    ODO: <strong>{inv.vehicle.odometer}</strong>
                  </span>
                )}
              </div>
              {inv.vehicle.vin && (
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                  VIN/Chassis: <strong style={{ color: '#0f172a' }}>{inv.vehicle.vin}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div style={{ marginBottom: '24px', position: 'relative', zIndex: 1 }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.84rem'
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#0b0f19', color: '#ffffff' }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', width: '5%', borderRadius: '4px 0 0 0' }}>#</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', width: '45%' }}>Description of Service / Goods</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', width: '15%' }}>Category</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', width: '8%' }}>Qty</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', width: '13%' }}>Unit Rate</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', width: '14%', borderRadius: '0 4px 0 0' }}>Amount ({settings.currency})</th>
                </tr>
              </thead>
              <tbody>
                {inv.items.map((item, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#fcfcfc'
                    }}
                  >
                    <td style={{ padding: '12px 14px', color: '#64748b', fontWeight: 600 }}>{index + 1}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.name}</div>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>{item.category}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600 }}>{item.qty}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                      {(item.unitPrice || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#0f172a' }}>
                      {(item.total || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown & Payment Instructions */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '24px',
              marginBottom: '28px',
              position: 'relative',
              zIndex: 1
            }}
          >
            {/* Left: Bank Transfer & UPI Wire */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px'
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#0f172a',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <CreditCard size={14} color="#b89228" />
                Electronic Settlement Details
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '84px',
                    height: '84px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '4px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  <QrCode size={60} color="#0b0f19" />
                  <span style={{ fontSize: '0.58rem', fontWeight: 700, color: '#b89228', marginTop: '2px' }}>
                    SCAN TO PAY
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#334155', lineHeight: 1.5 }}>
                  <div>Bank: <strong>{settings.bankDetails.bankName}</strong></div>
                  <div>Account: <strong>{settings.bankDetails.accountName}</strong></div>
                  <div>A/C No: <strong style={{ fontFamily: 'var(--font-mono)' }}>{settings.bankDetails.accountNumber}</strong></div>
                  <div>IFSC: <strong style={{ fontFamily: 'var(--font-mono)' }}>{settings.bankDetails.ifsc}</strong></div>
                  <div>UPI ID: <strong style={{ color: '#2563eb' }}>{settings.bankDetails.upiId}</strong></div>
                </div>
              </div>
            </div>

            {/* Right: Calculations Summary */}
            <div
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#ffffff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Subtotal:</span>
                <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{formatCurrency(inv.subtotal)}</span>
              </div>

              {inv.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#10b981' }}>Privilege Concession:</span>
                  <span style={{ fontWeight: 600, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                    - {formatCurrency(inv.discountAmount)}
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Taxable Base:</span>
                <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{formatCurrency(inv.taxableAmount)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>CGST (9%):</span>
                <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  {formatCurrency(Math.round(inv.taxAmount / 2))}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>SGST (9%):</span>
                <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  {formatCurrency(Math.round(inv.taxAmount / 2))}
                </span>
              </div>

              <div
                style={{
                  paddingTop: '10px',
                  borderTop: '2px solid #0f172a',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline'
                }}
              >
                <span style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase' }}>Grand Total:</span>
                <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0b0f19', fontFamily: 'var(--font-sans)' }}>
                  {formatCurrency(inv.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes & Authorized Signatory Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              borderTop: '1px solid #e2e8f0',
              paddingTop: '20px',
              position: 'relative',
              zIndex: 1
            }}
          >
            <div style={{ maxWidth: '440px', fontSize: '0.74rem', color: '#64748b', lineHeight: 1.5 }}>
              <div style={{ fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', marginBottom: '4px' }}>
                Terms & Conditions
              </div>
              <div>{settings.paymentTerms}</div>
              {inv.notes && <div style={{ marginTop: '4px', fontStyle: 'italic' }}>Note: {inv.notes}</div>}
            </div>

            {/* Signature & Seal Simulation */}
            <div style={{ textAlign: 'center', width: '200px' }}>
              <div
                style={{
                  border: '1.5px dashed #b89228',
                  borderRadius: '50%',
                  width: '74px',
                  height: '74px',
                  margin: '0 auto 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#b89228',
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  transform: 'rotate(-10deg)',
                  background: 'rgba(212,175,55,0.04)'
                }}
              >
                <span>SR CARS</span>
                <span>★ SEAL ★</span>
              </div>

              <div style={{ borderTop: '1px solid #0f172a', paddingTop: '4px', fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                Authorized Signatory
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>For SR CARS PVT LTD</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
