import React, { useState } from 'react';
import { useBilling } from '../context/useBilling';
import { 
  Receipt, 
  CreditCard, 
  Palette, 
  Database, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  Crown,
  Sparkles,
  Check
} from 'lucide-react';

export default function SettingsPage() {
  const { 
    settings, 
    updateSettings, 
    resetToDefaults, 
    invoices, 
    products, 
    showToast 
  } = useBilling();

  const [formData, setFormData] = useState({
    dealershipName: settings.dealershipName || 'SR CARS',
    tagline: settings.tagline || 'Prestige Automobiles & Performance Center',
    address: settings.address || '',
    phone: settings.phone || '',
    email: settings.email || '',
    website: settings.website || '',
    gstin: settings.gstin || '',
    pan: settings.pan || '',
    invoicePrefix: settings.invoicePrefix || 'SRC-2026-',
    currency: settings.currency || '₹',
    taxRate: settings.taxRate || 18,
    paymentTerms: settings.paymentTerms || '',
    notes: settings.notes || '',
    bankDetails: {
      bankName: settings.bankDetails?.bankName || '',
      accountName: settings.bankDetails?.accountName || '',
      accountNumber: settings.bankDetails?.accountNumber || '',
      ifsc: settings.bankDetails?.ifsc || '',
      branch: settings.bankDetails?.branch || '',
      upiId: settings.bankDetails?.upiId || ''
    }
  });

  const handleBankChange = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      bankDetails: { ...prev.bankDetails, [field]: val }
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handleExportBackup = () => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings: formData,
      invoices,
      products
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SR_CARS_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Dealership database backup downloaded.');
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.settings && parsed.invoices && parsed.products) {
          localStorage.setItem('sr_cars_settings', JSON.stringify(parsed.settings));
          localStorage.setItem('sr_cars_invoices', JSON.stringify(parsed.invoices));
          localStorage.setItem('sr_cars_products', JSON.stringify(parsed.products));
          showToast('Backup restored successfully! Reloading...');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          alert('Invalid backup file structure.');
        }
      } catch {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
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
            Dealership Administration & Settings
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Configure corporate profile, tax credentials, banking wire details, and invoice formatting.
          </p>
        </div>

        <button className="btn-gold" onClick={handleSave}>
          <Save size={18} />
          <span>Save All Settings</span>
        </button>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Section 1: Business Identity */}
          <div className="luxury-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--gold-subtle)',
                  border: '1.5px solid var(--border-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-600)'
                }}
              >
                <Crown size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Showroom & Corporate Identity
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Name and branding shown on official client invoices and tax receipts
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
              <div>
                <label className="form-label">Dealership Trade Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.dealershipName}
                  onChange={(e) => setFormData({ ...formData, dealershipName: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="form-label">Showroom Tagline</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Phone Hotline</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Official Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Corporate Website</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">GSTIN / Tax ID Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '18px' }}>
              <label className="form-label">Showroom & Workshop Address</label>
              <input
                type="text"
                className="form-input"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>

          {/* Section 2: Invoice & Taxation Defaults */}
          <div className="luxury-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1.5px solid var(--border-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-600)'
                }}
              >
                <Receipt size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Billing & Taxation Configuration
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Invoice numbering prefixes, currency symbols, and statutory GST rates
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
              <div>
                <label className="form-label">Invoice Number Prefix</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.invoicePrefix}
                  onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <div>
                <label className="form-label">Currency Symbol</label>
                <select
                  className="form-select"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                >
                  <option value="₹">₹ - Indian Rupee (INR)</option>
                  <option value="$">$ - US Dollar (USD)</option>
                  <option value="€">€ - Euro (EUR)</option>
                  <option value="£">£ - British Pound (GBP)</option>
                  <option value="AED">AED - UAE Dirham</option>
                </select>
              </div>

              <div>
                <label className="form-label">Standard GST / Tax Rate (%)</label>
                <select
                  className="form-select"
                  value={formData.taxRate}
                  onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                >
                  <option value={18}>18% (Automotive Services & Goods Standard)</option>
                  <option value={28}>28% (Luxury Automobiles High Bracket)</option>
                  <option value={12}>12% (Standard Concession)</option>
                  <option value={5}>5% (Basic Parts)</option>
                  <option value={0}>0% (Tax Exempt)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginTop: '18px' }}>
              <div>
                <label className="form-label">Default Payment Terms</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Standard Invoice Warranty Clause</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Banking & Electronic Settlement */}
          <div className="luxury-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--status-paid-bg)',
                  border: '1px solid var(--status-paid-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--status-paid)'
                }}
              >
                <CreditCard size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Banking & QR Wire Transfer Settings
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Bank account and UPI details printed on invoices for electronic payments
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
              <div>
                <label className="form-label">Beneficiary Account Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.bankDetails.accountName}
                  onChange={(e) => handleBankChange('accountName', e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Bank Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.bankDetails.bankName}
                  onChange={(e) => handleBankChange('bankName', e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Account Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.bankDetails.accountNumber}
                  onChange={(e) => handleBankChange('accountNumber', e.target.value)}
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <div>
                <label className="form-label">IFSC / Routing Code</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.bankDetails.ifsc}
                  onChange={(e) => handleBankChange('ifsc', e.target.value)}
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <div>
                <label className="form-label">Branch Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.bankDetails.branch}
                  onChange={(e) => handleBankChange('branch', e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">UPI VPA Handle (for QR Payments)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.bankDetails.upiId}
                  onChange={(e) => handleBankChange('upiId', e.target.value)}
                  style={{ color: 'var(--accent-blue)', fontWeight: 700 }}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Theme & Appearance in White & Gold */}
          <div className="luxury-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1.5px solid var(--border-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-600)'
                }}
              >
                <Palette size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Showroom Theme & Palette
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Majestic Imperial White & Champagne Golden aesthetic
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div
                style={{
                  padding: '18px 26px',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--gold-500)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #fdfbf7 100%)',
                  boxShadow: 'var(--shadow-gold)',
                  color: '#1a1610',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  minWidth: '320px'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #e5ba53 0%, #b8860b 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}
                >
                  <Sparkles size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--gold-600)' }}>
                    Imperial White & Golden Theme
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#574f41' }}>
                    Active showroom theme • Clean ivory marble & radiant gold accents
                  </div>
                </div>
                <Check size={20} color="var(--gold-500)" />
              </div>
            </div>
          </div>

          {/* Section 5: Data Backup, Restore & Reset */}
          <div className="luxury-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(124, 58, 237, 0.1)',
                  border: '1px solid rgba(124, 58, 237, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7c3aed'
                }}
              >
                <Database size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Showroom Database & Persistence
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Export offline backups or restore factory demonstration records
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <button type="button" className="btn-outline" onClick={handleExportBackup}>
                <Download size={16} />
                <span>Export System Backup (JSON)</span>
              </button>

              <label className="btn-outline" style={{ cursor: 'pointer', margin: 0 }}>
                <Upload size={16} />
                <span>Restore Backup (JSON)</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  style={{ display: 'none' }}
                />
              </label>

              <button
                type="button"
                className="btn-outline"
                onClick={() => {
                  if (window.confirm('Reset all invoices, products, and settings back to original SR CARS showroom defaults?')) {
                    resetToDefaults();
                  }
                }}
                style={{ color: 'var(--status-overdue)', borderColor: 'var(--status-overdue-border)' }}
              >
                <RotateCcw size={16} />
                <span>Reset to Factory Demo Data</span>
              </button>
            </div>
          </div>

          {/* Bottom Save Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              paddingTop: '16px'
            }}
          >
            <button type="submit" className="btn-gold" style={{ padding: '12px 36px', fontSize: '0.95rem' }}>
              <Save size={18} />
              <span>Save Dealership Configuration</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
