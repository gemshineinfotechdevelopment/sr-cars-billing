import React from 'react';
import { useBilling } from '../../context/useBilling';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  Edit3, 
  Crown
} from 'lucide-react';

export default function InvoiceViewModal() {
  const { 
    selectedInvoiceForView, 
    setSelectedInvoiceForView, 
    settings, 
    markPayment,
    setInvoiceToEdit,
    setIsInvoiceModalOpen
  } = useBilling();

  if (!selectedInvoiceForView) return null;

  const inv = selectedInvoiceForView;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // In web browsers, window.print() brings up the native "Save as PDF" dialogue configured with A4 styling
    window.print();
  };

  const handleEditThis = () => {
    setInvoiceToEdit(inv);
    setSelectedInvoiceForView(null);
    setIsInvoiceModalOpen(true);
  };

  // Convert number to Indian currency words
  const numberToWords = (num) => {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const inWords = (n) => {
      if ((n = n.toString()).length > 9) return 'overflow';
      const nArray = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (!nArray) return '';
      let str = '';
      str += Number(nArray[1]) !== 0 ? (a[Number(nArray[1])] || b[nArray[1][0]] + ' ' + a[nArray[1][1]]) + 'Crore ' : '';
      str += Number(nArray[2]) !== 0 ? (a[Number(nArray[2])] || b[nArray[2][0]] + ' ' + a[nArray[2][1]]) + 'Lakh ' : '';
      str += Number(nArray[3]) !== 0 ? (a[Number(nArray[3])] || b[nArray[3][0]] + ' ' + a[nArray[3][1]]) + 'Thousand ' : '';
      str += Number(nArray[4]) !== 0 ? (a[Number(nArray[4])] || b[nArray[4][0]] + ' ' + a[nArray[4][1]]) + 'Hundred ' : '';
      str += Number(nArray[5]) !== 0 ? (str !== '' ? 'and ' : '') + (a[Number(nArray[5])] || b[nArray[5][0]] + ' ' + a[nArray[5][1]]) : '';
      return str.trim();
    };

    const whole = Math.floor(num);
    const words = inWords(whole);
    return words ? `INR ${words} Only` : 'INR Zero Only';
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
          maxWidth: '900px', 
          width: '100%', 
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff', 
          color: '#1a1610',
          boxShadow: '0 20px 60px rgba(184, 134, 11, 0.22)',
          borderRadius: '16px',
          border: '2px solid var(--border-gold)',
          overflow: 'hidden'
        }}
      >
        {/* Top Control Bar (Never Printed) */}
        <div
          className="no-print"
          style={{
            flexShrink: 0,
            padding: '16px 24px',
            backgroundColor: '#ffffff',
            borderBottom: '1.5px solid var(--border-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#1a1610',
            zIndex: 10
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
                Tax Invoice Preview • {inv.invoiceNumber}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {inv.status !== 'Paid' && (
              <button
                onClick={() => markPayment(inv.id, inv.balanceAmount || inv.grandTotal || inv.totalAmount)}
                className="btn-outline"
                style={{ color: '#059669', borderColor: 'rgba(5, 150, 105, 0.4)', padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                <CheckCircle2 size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                <span>Mark Paid</span>
              </button>
            )}

            <button
              onClick={handleEditThis}
              className="btn-outline"
              style={{ padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              <Edit3 size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              <span>Edit Invoice</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="btn-outline"
              style={{ padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              <Download size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="btn-primary"
              style={{
                background: 'var(--gold-shimmer)',
                color: '#ffffff',
                border: 'none',
                padding: '7px 18px',
                fontSize: '0.82rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
            >
              <Printer size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={() => setSelectedInvoiceForView(null)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable A4 Body Layout */}
        <div
          id="printable-a4-invoice"
          style={{
            flex: 1,
            overflowY: 'auto',
            minHeight: 0,
            padding: '36px 40px 64px',
            backgroundColor: '#ffffff',
            color: '#1a1610',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.86rem',
            lineHeight: 1.45
          }}
        >
          {/* Header Banner: Dealership & Tax Invoice Title */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2.5px solid #b8860b',
              paddingBottom: '20px',
              marginBottom: '22px'
            }}
          >
            {/* Dealership Branding */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Crown size={28} color="#b8860b" />
                <h1
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    fontWeight: 900,
                    letterSpacing: '2px',
                    color: '#1a1610'
                  }}
                >
                  {settings.dealershipName || 'SR CARS'}
                </h1>
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#b8860b', marginTop: '2px' }}>
                {settings.tagline || 'Prestige Automobiles & Performance Service Center'}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#574f41', marginTop: '6px', maxWidth: '420px', lineHeight: 1.35 }}>
                {settings.address}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#574f41', marginTop: '3px' }}>
                Phone: <strong>{settings.phone}</strong> | Email: <strong>{settings.email}</strong>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#1a1610', fontWeight: 700, marginTop: '4px' }}>
                GSTIN: <span style={{ fontFamily: 'var(--font-mono)' }}>{settings.gstin}</span> | PAN: <span style={{ fontFamily: 'var(--font-mono)' }}>{settings.pan}</span>
              </div>
            </div>

            {/* Invoice Meta */}
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: '#fbf7ee',
                  border: '1.5px solid #b8860b',
                  color: '#b8860b',
                  fontWeight: 900,
                  fontSize: '1rem',
                  letterSpacing: '2px',
                  padding: '6px 16px',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  marginBottom: '10px'
                }}
              >
                {inv.invoiceType || 'TAX INVOICE'}
              </div>

              <div style={{ fontSize: '0.86rem', fontWeight: 800 }}>
                Invoice No: <span style={{ color: '#b8860b', fontSize: '0.98rem' }}>{inv.invoiceNumber}</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#574f41', marginTop: '2px' }}>
                Date: <strong>{inv.date}</strong>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#574f41', marginTop: '2px' }}>
                Job Card: <strong>{inv.jobCardNumber || 'JC-2026-1041'}</strong>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#574f41', marginTop: '2px' }}>
                Place of Supply: <strong>Telangana (36)</strong>
              </div>
            </div>
          </div>

          {/* Customer & Vehicle Information Boxes */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '24px'
            }}
          >
            {/* Box 1: Billed To / Customer */}
            <div
              style={{
                backgroundColor: '#fdfbf7',
                border: '1px solid rgba(184, 134, 11, 0.35)',
                borderRadius: '8px',
                padding: '14px 16px'
              }}
            >
              <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: '#b8860b', letterSpacing: '1px', marginBottom: '6px' }}>
                Billed To (Customer Details)
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1a1610' }}>
                {inv.customer?.name}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#574f41', marginTop: '2px' }}>
                Mobile: <strong>{inv.customer?.phone}</strong>
              </div>
              {inv.customer?.email && (
                <div style={{ fontSize: '0.8rem', color: '#574f41' }}>
                  Email: {inv.customer?.email}
                </div>
              )}
              <div style={{ fontSize: '0.8rem', color: '#574f41', marginTop: '4px', lineHeight: 1.3 }}>
                Address: {inv.customer?.address || '—'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#1a1610', fontWeight: 700, marginTop: '4px' }}>
                GSTIN: {inv.customer?.gstin || 'Unregistered / Consumer'}
              </div>
            </div>

            {/* Box 2: Vehicle Details */}
            <div
              style={{
                backgroundColor: '#fdfbf7',
                border: '1px solid rgba(184, 134, 11, 0.35)',
                borderRadius: '8px',
                padding: '14px 16px'
              }}
            >
              <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: '#b8860b', letterSpacing: '1px', marginBottom: '6px' }}>
                Vehicle & Work Order Details
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1a1610' }}>
                {inv.vehicle?.regNumber}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#574f41', marginTop: '2px' }}>
                Make & Model: <strong>{inv.vehicle?.brand} {inv.vehicle?.model}</strong>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#574f41', marginTop: '2px' }}>
                Current Odometer: <strong>{inv.vehicle?.odometer || '—'}</strong>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#574f41', marginTop: '4px' }}>
                Job Card Ref: <strong>{inv.jobCardNumber || 'JC-2026-1041'}</strong>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, marginTop: '4px' }}>
                Service Advisor: Rahul Deshmukh
              </div>
            </div>
          </div>

          {/* TABLE 1: SERVICES RENDERED */}
          {inv.services && inv.services.length > 0 && (
            <div style={{ marginBottom: '22px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#b8860b', letterSpacing: '1px', marginBottom: '8px' }}>
                Services Rendered (Labor & Workmanship)
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5eccf', borderBottom: '1.5px solid #b8860b', color: '#1a1610' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left', width: '35px' }}>#</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Service Description</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', width: '50px' }}>Qty</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', width: '90px' }}>Rate (₹)</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', width: '80px' }}>Discount</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', width: '65px' }}>GST</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', width: '100px' }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {inv.services.map((s, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e7e3d8' }}>
                      <td style={{ padding: '8px 10px', color: '#574f41' }}>{idx + 1}</td>
                      <td style={{ padding: '8px 10px', fontWeight: 700 }}>{s.name}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>{s.quantity || 1}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right' }}>{Number(s.rate).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', color: s.discount ? '#059669' : '#574f41' }}>
                        {s.discount ? `₹${Number(s.discount).toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>{s.gst || 18}%</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700 }}>
                        {Number(s.amount).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: '#fdfbf7', fontWeight: 700 }}>
                    <td colSpan={6} style={{ padding: '8px 10px', textAlign: 'right' }}>
                      Service Subtotal:
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                      ₹{Number(inv.serviceSubtotal || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TABLE 2: PRODUCTS SUPPLIED */}
          {inv.spareParts && inv.spareParts.length > 0 && (
            <div style={{ marginBottom: '22px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#b8860b', letterSpacing: '1px', marginBottom: '8px' }}>
                Products & Materials Supplied
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5eccf', borderBottom: '1.5px solid #b8860b', color: '#1a1610' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left', width: '35px' }}>#</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Part Name & Code</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', width: '90px' }}>Part No</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', width: '50px' }}>Qty</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', width: '90px' }}>Unit Price (₹)</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', width: '80px' }}>Discount</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', width: '65px' }}>GST</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', width: '100px' }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {inv.spareParts.map((p, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e7e3d8' }}>
                      <td style={{ padding: '8px 10px', color: '#574f41' }}>{idx + 1}</td>
                      <td style={{ padding: '8px 10px', fontWeight: 700 }}>{p.name}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.76rem' }}>
                        {p.partNumber || '—'}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>{p.quantity || 1}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right' }}>{Number(p.unitPrice).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', color: p.discount ? '#059669' : '#574f41' }}>
                        {p.discount ? `₹${Number(p.discount).toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>{p.gst || 18}%</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700 }}>
                        {Number(p.amount).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: '#fdfbf7', fontWeight: 700 }}>
                    <td colSpan={7} style={{ padding: '8px 10px', textAlign: 'right' }}>
                      Products Subtotal:
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                      ₹{Number(inv.sparePartsSubtotal || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* BILLING SUMMARY & GST BREAKUP */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '24px',
              borderTop: '2px solid #b8860b',
              paddingTop: '18px',
              marginBottom: '20px'
            }}
          >
            {/* Left Column: Bank Details, QR & Terms */}
            <div>
              {/* Payment Details Stamp */}
              <div
                style={{
                  padding: '12px 14px',
                  backgroundColor: '#fbf7ee',
                  border: '1.5px solid #b8860b',
                  borderRadius: '8px',
                  marginBottom: '14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: '#b8860b', letterSpacing: '1px' }}>
                    Payment Information
                  </span>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      backgroundColor: inv.status === 'Paid' ? '#d1fae5' : '#fef3c7',
                      color: inv.status === 'Paid' ? '#065f46' : '#92400e'
                    }}
                  >
                    STATUS: {inv.status?.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#574f41' }}>
                  Method: <strong>{inv.paymentMethod}</strong>
                  {inv.transactionId && ` • Ref: ${inv.transactionId}`}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#574f41', marginTop: '2px' }}>
                  Amount Paid: <strong>₹{Number(inv.amountPaid || inv.grandTotal || 0).toLocaleString('en-IN')}</strong>
                  {inv.balanceAmount > 0 && (
                    <span style={{ color: '#dc2626', fontWeight: 800, marginLeft: '8px' }}>
                      • Balance Due: ₹{Number(inv.balanceAmount).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              {/* Bank Details */}
              <div style={{ fontSize: '0.76rem', color: '#574f41', lineHeight: 1.4, marginBottom: '12px' }}>
                <strong style={{ color: '#1a1610', textTransform: 'uppercase', fontSize: '0.74rem', letterSpacing: '0.5px' }}>
                  Electronic Bank Settlement:
                </strong>
                <div>Bank: {settings.bankDetails?.bankName || 'HDFC Bank Ltd'} | Account: {settings.bankDetails?.accountName || 'SR CARS AUTOMOBILES PVT LTD'}</div>
                <div>A/C No: <strong>{settings.bankDetails?.accountNumber || '50200088921473'}</strong> | IFSC: <strong>{settings.bankDetails?.ifsc || 'HDFC0001234'}</strong></div>
                <div>UPI ID: <strong>{settings.bankDetails?.upiId || 'srcars@hdfcbank'}</strong></div>
              </div>

              {/* Terms and Conditions */}
              <div style={{ fontSize: '0.72rem', color: '#7a7265', lineHeight: 1.35 }}>
                <strong style={{ color: '#1a1610' }}>Terms & Conditions:</strong>
                <div style={{ whiteSpace: 'pre-line', marginTop: '2px' }}>
                  {settings.termsAndConditions || '1. Goods once sold will not be returned.\n2. Work carries 6-month workshop warranty.'}
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Financial Breakup */}
            <div
              style={{
                backgroundColor: '#fdfbf7',
                border: '1px solid rgba(184, 134, 11, 0.35)',
                borderRadius: '8px',
                padding: '14px 18px',
                fontSize: '0.84rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', color: '#574f41' }}>
                <span>Service Subtotal:</span>
                <strong>₹{Number(inv.serviceSubtotal || 0).toLocaleString('en-IN')}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', color: '#574f41' }}>
                <span>Products Subtotal:</span>
                <strong>₹{Number(inv.sparePartsSubtotal || 0).toLocaleString('en-IN')}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderTop: '1px dashed #d5d0c3', color: '#1a1610' }}>
                <span>Gross Total:</span>
                <strong>₹{Number(inv.grossTotal || 0).toLocaleString('en-IN')}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', color: '#059669' }}>
                <span>Discount Allowed:</span>
                <strong>- ₹{Number(inv.discountAmount || 0).toLocaleString('en-IN')}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderTop: '1px dashed #d5d0c3', color: '#1a1610' }}>
                <span>Taxable Amount:</span>
                <strong>₹{Number(inv.taxableAmount || 0).toLocaleString('en-IN')}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', color: '#574f41', fontSize: '0.78rem' }}>
                <span>Central GST (CGST @ 9%):</span>
                <span>₹{Number(inv.cgst || 0).toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', color: '#574f41', fontSize: '0.78rem' }}>
                <span>State GST (SGST @ 9%):</span>
                <span>₹{Number(inv.sgst || 0).toLocaleString('en-IN')}</span>
              </div>

              {inv.roundOff !== 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', color: '#7a7265', fontSize: '0.76rem' }}>
                  <span>Round Off:</span>
                  <span>{inv.roundOff > 0 ? `+₹${inv.roundOff}` : `-₹${Math.abs(inv.roundOff)}`}</span>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '2px solid #b8860b',
                  paddingTop: '10px',
                  marginTop: '6px'
                }}
              >
                <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#1a1610' }}>
                  Grand Total:
                </span>
                <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#b8860b', fontFamily: 'var(--font-display)' }}>
                  ₹{Number(inv.grandTotal || inv.totalAmount || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div style={{ fontSize: '0.74rem', color: '#574f41', marginTop: '6px', fontStyle: 'italic', textAlign: 'right' }}>
                {numberToWords(inv.grandTotal || inv.totalAmount || 0)}
              </div>
            </div>
          </div>

          {/* Footer & Authorized Signatures */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              borderTop: '1px solid #e7e3d8',
              paddingTop: '24px',
              marginTop: '28px'
            }}
          >
            <div>
              <div style={{ fontSize: '0.78rem', color: '#574f41', fontStyle: 'italic' }}>
                {settings.invoiceFooter || 'Thank you for choosing SR CARS. Precision engineering & certified luxury service.'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#8c8270', marginTop: '4px' }}>
                This is a computer-generated tax invoice verified under GST Rule 46.
              </div>
            </div>

            <div style={{ textAlign: 'center', minWidth: '220px' }}>
              <div style={{ height: '36px' }}></div>
              <div style={{ borderTop: '1.5px solid #1a1610', paddingTop: '4px', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
                Authorized Signatory
              </div>
              <div style={{ fontSize: '0.7rem', color: '#574f41' }}>
                For SR CARS Automobiles Pvt Ltd
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
