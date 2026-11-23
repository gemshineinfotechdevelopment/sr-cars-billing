import React from 'react';
import { useBilling } from '../../context/useBilling';
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
          color: '#1a1610',
          boxShadow: '0 20px 60px rgba(184, 134, 11, 0.25)',
          borderRadius: '16px',
          border: '2px solid var(--border-gold)',
          overflow: 'hidden'
        }}
      >
        {/* Top Control Bar in White & Golden (Never Printed) */}
        <div
          className="no-print"
          style={{
            padding: '16px 24px',
            backgroundColor: '#ffffff',
            borderBottom: '1.5px solid var(--border-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#1a1610'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(212, 175, 55, 0.14)',
                border: '1px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Crown size={18} color="var(--gold-500)" />
            </div>
            <div>
              <span style={{ fontWeight: 800, fontSize: '0.92rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#1a1610' }}>
                Official Tax Invoice • {inv.invoiceNumber}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {inv.status !== 'Paid' && (
              <button
                onClick={() => markAsPaid(inv.id)}
                className="btn-outline"
                style={{ color: '#059669', borderColor: 'rgba(5, 150, 105, 0.4)', padding: '6px 12px', fontSize: '0.8rem' }}
              >
                <CheckCircle2 size={15} />
                <span>Mark Paid</span>
              </button>
            )}

            <button
              onClick={handleEditThis}
              className="btn-outline"
              style={{ color: 'var(--gold-600)', borderColor: 'var(--border-gold)', padding: '6px 12px', fontSize: '0.8rem' }}
            >
              <Edit3 size={15} />
              <span>Edit</span>
            </button>

            <button
              onClick={handlePrint}
              className="btn-gold"
              style={{ padding: '6px 18px', fontSize: '0.82rem' }}
            >
              <Printer size={16} />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={() => setSelectedInvoiceForView(null)}
              className="btn-icon"
              style={{ width: '32px', height: '32px', border: '1px solid var(--border-subtle)' }}
            >
              <X size={16} color="#1a1610" />
            </button>
          </div>
        </div>

        {/* THE ROYAL PRINTABLE AUTOMOTIVE INVOICE SHEET in White & Golden */}
        <div
          style={{
            padding: '40px 48px',
            fontFamily: 'var(--font-sans)',
            backgroundColor: '#ffffff',
            color: '#1a1610',
            position: 'relative'
          }}
        >
          {/* Subtle Golden Watermark */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-30deg)',
              fontFamily: 'var(--font-display)',
              fontSize: '5.5rem',
              fontWeight: 900,
              color: 'rgba(212, 175, 55, 0.05)',
              letterSpacing: '12px',
              pointerEvents: 'none',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              zIndex: 0
            }}
          >
            SR CARS PRESTIGE
          </div>

          {/* Invoice Header Section in White & Golden */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2.5px solid var(--gold-500)',
              paddingBottom: '24px',
              marginBottom: '24px',
              position: 'relative',
              zIndex: 1
            }}
          >
            {/* Left: Dealership Identity */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #ffffff 0%, #fbf7ee 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #b8860b',
                    boxShadow: '0 4px 14px rgba(184, 134, 11, 0.2)'
                  }}
                >
                  <Crown size={26} color="#b8860b" />
                </div>
                <div>
                  <h1
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.85rem',
                      fontWeight: 900,
                      letterSpacing: '2.5px',
                      color: '#1a1610',
                      margin: 0,
                      lineHeight: 1
                    }}
                  >
                    {settings.dealershipName || 'SR CARS'}
                  </h1>
                  <span style={{ fontSize: '0.72rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#b8860b', fontWeight: 800 }}>
                    {settings.tagline || 'Luxury Automotive & Performance Studio'}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: '#574f41', lineHeight: 1.5, maxWidth: '360px' }}>
                <div>{settings.address}</div>
                <div>Phone: <strong style={{ color: '#1a1610' }}>{settings.phone}</strong> | Email: {settings.email}</div>
                <div>GSTIN: <strong style={{ color: '#b8860b' }}>{settings.gstin}</strong> | PAN: {settings.pan}</div>
              </div>
            </div>

            {/* Right: Tax Invoice Stamp & Numbers */}
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontSize: '1.45rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  letterSpacing: '2px',
                  color: '#b8860b',
                  marginBottom: '6px'
                }}
              >
                TAX INVOICE
              </div>

              <div
                style={{
                  display: 'inline-block',
                  padding: '4px 14px',
                  borderRadius: '6px',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  backgroundColor: inv.status === 'Paid' ? '#ecfdf5' : inv.status === 'Overdue' ? '#fef2f2' : '#fffbeb',
                  color: inv.status === 'Paid' ? '#065f46' : inv.status === 'Overdue' ? '#991b1b' : '#92400e',
                  border: `1.5px solid ${inv.status === 'Paid' ? '#10b981' : inv.status === 'Overdue' ? '#ef4444' : '#f59e0b'}`,
                  marginBottom: '10px'
                }}
              >
                Status: {inv.status}
              </div>

              <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                <div>Invoice No: <strong style={{ fontFamily: 'var(--font-mono)', color: '#1a1610', fontWeight: 800 }}>{inv.invoiceNumber}</strong></div>
                <div>Invoice Date: <strong style={{ color: '#1a1610' }}>{inv.date}</strong></div>
                <div>Payment Due: <strong style={{ color: '#1a1610' }}>{inv.dueDate}</strong></div>
                <div>Payment Method: <strong>{inv.paymentMethod}</strong></div>
              </div>
            </div>
          </div>

          {/* Customer & Vehicle 2-Column Info Card in White & Gold */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 1fr',
              gap: '20px',
              backgroundColor: '#fdfbf7',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '18px 22px',
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
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#b8860b',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Building2 size={13} />
                Client / Billed To
              </div>
              <div style={{ fontSize: '1.08rem', fontWeight: 800, color: '#1a1610' }}>
                {inv.customer.name}
              </div>
              {inv.customer.company && (
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#574f41' }}>
                  {inv.customer.company}
                </div>
              )}
              <div style={{ fontSize: '0.8rem', color: '#574f41', marginTop: '4px', lineHeight: 1.4 }}>
                {inv.customer.address && <div>{inv.customer.address}</div>}
                <div>Phone: {inv.customer.phone} {inv.customer.email ? `• ${inv.customer.email}` : ''}</div>
                {inv.customer.gstin && (
                  <div style={{ marginTop: '2px' }}>
                    GSTIN: <strong style={{ color: '#1a1610', fontFamily: 'var(--font-mono)' }}>{inv.customer.gstin}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Vehicle Profile in White & Gold */}
            <div style={{ borderLeft: '1px solid var(--border-medium)', paddingLeft: '20px' }}>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
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
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1a1610' }}>
                {inv.vehicle.makeModel}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '6px 0' }}>
                <span
                  style={{
                    backgroundColor: '#fffdf7',
                    color: '#85580a',
                    border: '1.5px solid #d4af37',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    letterSpacing: '1px'
                  }}
                >
                  {inv.vehicle.regNumber}
                </span>
                {inv.vehicle.year && (
                  <span style={{ fontSize: '0.75rem', color: '#574f41', alignSelf: 'center' }}>
                    Year: <strong>{inv.vehicle.year}</strong>
                  </span>
                )}
                {inv.vehicle.odometer && (
                  <span style={{ fontSize: '0.75rem', color: '#574f41', alignSelf: 'center' }}>
                    ODO: <strong>{inv.vehicle.odometer}</strong>
                  </span>
                )}
              </div>
              {inv.vehicle.vin && (
                <div style={{ fontSize: '0.75rem', color: '#574f41', fontFamily: 'var(--font-mono)' }}>
                  VIN/Chassis: <strong style={{ color: '#1a1610' }}>{inv.vehicle.vin}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Line Items Table in White & Golden */}
          <div style={{ marginBottom: '24px', position: 'relative', zIndex: 1 }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.85rem'
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#fbf8f1', color: '#1a1610', borderBottom: '2px solid #b8860b' }}>
                  <th style={{ padding: '12px 14px', textAlign: 'left', width: '5%', color: '#7a6b4e', fontWeight: 800 }}>#</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', width: '45%', color: '#7a6b4e', fontWeight: 800 }}>Description of Service / Goods</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', width: '15%', color: '#7a6b4e', fontWeight: 800 }}>Category</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', width: '8%', color: '#7a6b4e', fontWeight: 800 }}>Qty</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right', width: '13%', color: '#7a6b4e', fontWeight: 800 }}>Unit Rate</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right', width: '14%', color: '#7a6b4e', fontWeight: 800 }}>Amount ({settings.currency})</th>
                </tr>
              </thead>
              <tbody>
                {inv.items.map((item, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: '1px solid rgba(212, 175, 55, 0.18)',
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#fdfcf9'
                    }}
                  >
                    <td style={{ padding: '12px 14px', color: '#8c8270', fontWeight: 700 }}>{index + 1}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 700, color: '#1a1610' }}>{item.name}</div>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#574f41' }}>{item.category}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700 }}>{item.qty}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                      {(item.unitPrice || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#1a1610' }}>
                      {(item.total || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown & Payment Instructions in White & Gold */}
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
                backgroundColor: '#fdfbf7',
                border: '1.5px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '18px'
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#b8860b',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <CreditCard size={15} color="#b8860b" />
                Electronic Settlement Details
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '88px',
                    height: '88px',
                    border: '1.5px solid #d4af37',
                    borderRadius: '8px',
                    padding: '4px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(184, 134, 11, 0.15)'
                  }}
                >
                  <QrCode size={64} color="#1a1610" />
                  <span style={{ fontSize: '0.58rem', fontWeight: 800, color: '#b8860b', marginTop: '2px' }}>
                    SCAN TO PAY
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.55 }}>
                  <div>Bank: <strong>{settings.bankDetails.bankName}</strong></div>
                  <div>Account: <strong>{settings.bankDetails.accountName}</strong></div>
                  <div>A/C No: <strong style={{ fontFamily: 'var(--font-mono)', color: '#1a1610' }}>{settings.bankDetails.accountNumber}</strong></div>
                  <div>IFSC: <strong style={{ fontFamily: 'var(--font-mono)', color: '#1a1610' }}>{settings.bankDetails.ifsc}</strong></div>
                  <div>UPI ID: <strong style={{ color: '#2563eb' }}>{settings.bankDetails.upiId}</strong></div>
                </div>
              </div>
            </div>

            {/* Right: Calculations Summary */}
            <div
              style={{
                border: '1.5px solid var(--border-gold)',
                borderRadius: '10px',
                padding: '18px',
                backgroundColor: '#ffffff',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.86rem' }}>
                <span style={{ color: '#574f41' }}>Subtotal:</span>
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{formatCurrency(inv.subtotal)}</span>
              </div>

              {inv.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.86rem' }}>
                  <span style={{ color: '#059669', fontWeight: 600 }}>Privilege Concession:</span>
                  <span style={{ fontWeight: 700, color: '#059669', fontFamily: 'var(--font-mono)' }}>
                    - {formatCurrency(inv.discountAmount)}
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.86rem' }}>
                <span style={{ color: '#574f41' }}>Taxable Base:</span>
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{formatCurrency(inv.taxableAmount)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.86rem' }}>
                <span style={{ color: '#574f41' }}>CGST (9%):</span>
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {formatCurrency(Math.round(inv.taxAmount / 2))}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.86rem' }}>
                <span style={{ color: '#574f41' }}>SGST (9%):</span>
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {formatCurrency(Math.round(inv.taxAmount / 2))}
                </span>
              </div>

              <div
                style={{
                  paddingTop: '10px',
                  borderTop: '2px solid #b8860b',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline'
                }}
              >
                <span style={{ fontSize: '0.98rem', fontWeight: 900, textTransform: 'uppercase', color: '#1a1610' }}>Grand Total:</span>
                <span style={{ fontSize: '1.55rem', fontWeight: 900, color: '#b8860b', fontFamily: 'var(--font-sans)' }}>
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
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '20px',
              position: 'relative',
              zIndex: 1
            }}
          >
            <div style={{ maxWidth: '440px', fontSize: '0.76rem', color: '#574f41', lineHeight: 1.5 }}>
              <div style={{ fontWeight: 800, textTransform: 'uppercase', color: '#b8860b', marginBottom: '4px' }}>
                Terms & Conditions
              </div>
              <div>{settings.paymentTerms}</div>
              {inv.notes && <div style={{ marginTop: '4px', fontStyle: 'italic', color: '#1a1610' }}>Note: {inv.notes}</div>}
            </div>

            {/* Signature & Seal in Royal Gold */}
            <div style={{ textAlign: 'center', width: '200px' }}>
              <div
                style={{
                  border: '2px dashed #b8860b',
                  borderRadius: '50%',
                  width: '76px',
                  height: '76px',
                  margin: '0 auto 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#b8860b',
                  fontSize: '0.62rem',
                  fontWeight: 900,
                  transform: 'rotate(-8deg)',
                  background: 'rgba(212,175,55,0.06)'
                }}
              >
                <span>SR CARS</span>
                <span>★ SEAL ★</span>
              </div>

              <div style={{ borderTop: '1.5px solid #1a1610', paddingTop: '4px', fontSize: '0.78rem', fontWeight: 800, color: '#1a1610' }}>
                Authorized Signatory
              </div>
              <div style={{ fontSize: '0.7rem', color: '#8c8270' }}>For SR CARS PVT LTD</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
