import React, { useState } from 'react';
import { useBilling } from '../context/useBilling';
import { 
  Building2, 
  ReceiptText, 
  Users, 
  Sliders, 
  Save, 
  Upload, 
  Download, 
  RotateCcw, 
  Crown, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Key, 
  Database
} from 'lucide-react';

export default function SettingsPage() {
  const { 
    settings, 
    updateSettings, 
    employees, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee, 
    resetToDefaults, 
    customers, 
    services, 
    spareParts, 
    invoices, 
    showToast 
  } = useBilling();

  // Active section tab: 'COMPANY' | 'INVOICE' | 'USERS' | 'GENERAL'
  const [activeTab, setActiveTab] = useState('COMPANY');

  // Form State for Company & Invoice & General
  const [companyForm, setCompanyForm] = useState({
    dealershipName: settings.dealershipName || 'SR CARS',
    tagline: settings.tagline || 'Prestige Automobiles & Performance Service Center',
    companyLogo: settings.companyLogo || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=200&auto=format&fit=crop&q=80',
    address: settings.address || '',
    phone: settings.phone || '',
    email: settings.email || '',
    website: settings.website || '',
    gstin: settings.gstin || '',
    pan: settings.pan || '',
    
    // Invoice settings
    invoicePrefix: settings.invoicePrefix || 'SRC-2026-',
    invoiceNumberFormat: settings.invoiceNumberFormat || 'PREFIX + 3-Digit Counter (e.g. SRC-2026-001)',
    defaultGst: settings.defaultGst || 18,
    termsAndConditions: settings.termsAndConditions || '',
    invoiceFooter: settings.invoiceFooter || '',
    bankDetails: {
      bankName: settings.bankDetails?.bankName || 'HDFC Bank Ltd',
      accountName: settings.bankDetails?.accountName || 'SR CARS AUTOMOBILES PVT LTD',
      accountNumber: settings.bankDetails?.accountNumber || '50200088921473',
      ifsc: settings.bankDetails?.ifsc || 'HDFC0001234',
      branch: settings.bankDetails?.branch || 'Jubilee Hills Road 36, Hyderabad',
      upiId: settings.bankDetails?.upiId || 'srcars@hdfcbank'
    },

    // General settings
    currency: settings.currency || '₹',
    dateFormat: settings.dateFormat || 'DD/MM/YYYY',
    notificationPreferences: {
      smsInvoiceAlerts: settings.notificationPreferences?.smsInvoiceAlerts ?? true,
      whatsappServiceUpdates: settings.notificationPreferences?.whatsappServiceUpdates ?? true,
      lowStockAlerts: settings.notificationPreferences?.lowStockAlerts ?? true,
      dailySalesEmail: settings.notificationPreferences?.dailySalesEmail ?? true
    }
  });

  // Employee Add/Edit Modal
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  const [empFormData, setEmpFormData] = useState({
    id: '',
    name: '',
    email: '',
    role: 'Service Advisor',
    phone: '',
    status: 'Active',
    permissions: ['Invoices & Billing', 'Services Catalog', 'Customer Management']
  });

  const handleSaveCompanySettings = (e) => {
    e.preventDefault();
    updateSettings(companyForm);
  };

  const handleSaveInvoiceSettings = (e) => {
    e.preventDefault();
    updateSettings(companyForm);
  };

  const handleSaveGeneralSettings = (e) => {
    e.preventDefault();
    updateSettings(companyForm);
  };

  const openAddEmpModal = () => {
    setEditingEmp(null);
    setEmpFormData({
      id: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      name: '',
      email: '',
      role: 'Service Advisor',
      phone: '',
      status: 'Active',
      permissions: ['Invoices & Billing', 'Customer Management']
    });
    setIsEmpModalOpen(true);
  };

  const openEditEmpModal = (emp) => {
    setEditingEmp(emp);
    setEmpFormData({
      ...emp,
      permissions: emp.permissions || []
    });
    setIsEmpModalOpen(true);
  };

  const handleSaveEmployee = (e) => {
    e.preventDefault();
    if (!empFormData.name.trim() || !empFormData.email.trim()) {
      alert('Please fill in employee name and email.');
      return;
    }

    if (editingEmp) {
      updateEmployee(editingEmp.id, empFormData);
    } else {
      addEmployee(empFormData);
    }
    setIsEmpModalOpen(false);
  };

  // Full System Backup Export
  const handleExportBackup = () => {
    const backup = {
      system: 'SR CARS Billing & Management Suite',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      settings: companyForm,
      customers,
      services,
      spareParts,
      invoices,
      employees
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SR_CARS_Full_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Complete garage database backup JSON downloaded.');
  };

  // Full System Backup Restore
  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.settings) localStorage.setItem('sr_cars_settings', JSON.stringify(parsed.settings));
        if (parsed.customers) localStorage.setItem('sr_cars_customers', JSON.stringify(parsed.customers));
        if (parsed.services) localStorage.setItem('sr_cars_services', JSON.stringify(parsed.services));
        if (parsed.spareParts) localStorage.setItem('sr_cars_spare_parts', JSON.stringify(parsed.spareParts));
        if (parsed.invoices) localStorage.setItem('sr_cars_invoices', JSON.stringify(parsed.invoices));
        if (parsed.employees) localStorage.setItem('sr_cars_employees', JSON.stringify(parsed.employees));

        showToast('Backup restored successfully! Reloading system...');
        setTimeout(() => window.location.reload(), 1000);
      } catch (err) {
        alert('Failed to parse backup JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const allPermissionsList = [
    'Invoices & Billing',
    'Customer Management',
    'Services Catalog',
    'Spare Parts Inventory',
    'Reports & Analytics',
    'System Settings'
  ];

  return (
    <div style={{ padding: '28px 32px 64px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
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
                background: 'rgba(212, 175, 55, 0.12)',
                padding: '2px 8px',
                borderRadius: '999px'
              }}
            >
              System Configuration & Controls
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
            Dealership & Application Settings
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
            Manage company profile, invoice numbering rules, staff roles and permissions, notifications and data backups.
          </p>
        </div>
      </div>

      {/* 4 Tabs: Company Profile | Invoice Settings | User Management | General Settings */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1.5px solid var(--border-subtle)', paddingBottom: '10px', flexWrap: 'wrap' }}>
        {[
          { id: 'COMPANY', label: 'Company Profile', icon: Building2 },
          { id: 'INVOICE', label: 'Invoice Settings', icon: ReceiptText },
          { id: 'USERS', label: 'User Management', icon: Users },
          { id: 'GENERAL', label: 'General & Backups', icon: Sliders }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: isActive ? 800 : 600,
                border: isActive ? '1.5px solid var(--gold-500)' : '1px solid transparent',
                backgroundColor: isActive ? 'var(--gold-100)' : '#ffffff',
                color: isActive ? 'var(--gold-600)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={17} color={isActive ? 'var(--gold-500)' : 'currentColor'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: COMPANY PROFILE */}
      {activeTab === 'COMPANY' && (
        <form onSubmit={handleSaveCompanySettings}>
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Building2 size={22} color="var(--gold-500)" />
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Company Profile & Branding
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Official business identity printed across all A4 customer invoices and tax filings
                </p>
              </div>
            </div>

            {/* Logo Preview & URL */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px', backgroundColor: '#fdfbf7', borderRadius: '10px', border: '1px solid var(--border-subtle)', marginBottom: '22px' }}>
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '12px',
                  border: '2px solid var(--border-gold)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#ffffff'
                }}
              >
                {companyForm.companyLogo ? (
                  <img src={companyForm.companyLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Crown size={32} color="var(--gold-500)" />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '4px' }}>
                  Company Logo URL / Asset Link
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={companyForm.companyLogo}
                  onChange={(e) => setCompanyForm({ ...companyForm, companyLogo: e.target.value })}
                  placeholder="https://your-domain.com/logo.png"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '6px' }}>
                  Company / Dealership Name *
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={companyForm.dealershipName}
                  onChange={(e) => setCompanyForm({ ...companyForm, dealershipName: e.target.value })}
                  placeholder="SR CARS"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '6px' }}>
                  Brand Tagline
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={companyForm.tagline}
                  onChange={(e) => setCompanyForm({ ...companyForm, tagline: e.target.value })}
                  placeholder="Prestige Automobiles & Performance Center"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '6px' }}>
                  Official Phone Number *
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={companyForm.phone}
                  onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                  placeholder="+91 98490 87654"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '6px' }}>
                  Official Email Address *
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={companyForm.email}
                  onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                  placeholder="billing@srcarsluxury.com"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '6px' }}>
                  Website
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={companyForm.website}
                  onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                  placeholder="www.srcarsluxury.com"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '6px' }}>
                  GSTIN (Goods and Services Tax ID) *
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={companyForm.gstin}
                  onChange={(e) => setCompanyForm({ ...companyForm, gstin: e.target.value.toUpperCase() })}
                  placeholder="36AABCU9603R1ZM"
                  required
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '6px' }}>
                  Workshop & Showroom Physical Address *
                </label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={companyForm.address}
                  onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                  placeholder="Plot 42, Luxury Motor Boulevard, Jubilee Hills, Hyderabad - 500033"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                type="submit"
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 24px',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--gold-shimmer)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Save size={16} />
                <span>Save Company Profile</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: INVOICE SETTINGS */}
      {activeTab === 'INVOICE' && (
        <form onSubmit={handleSaveInvoiceSettings}>
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <ReceiptText size={22} color="var(--gold-500)" />
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Invoice Formatting & Tax Rules
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Prefix numbers, default GST percentages, legal terms & conditions and footer disclosures
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '6px' }}>
                  Invoice Number Prefix *
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={companyForm.invoicePrefix}
                  onChange={(e) => setCompanyForm({ ...companyForm, invoicePrefix: e.target.value })}
                  placeholder="SRC-2026-"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '6px' }}>
                  Invoice Number Format Pattern
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={companyForm.invoiceNumberFormat}
                  onChange={(e) => setCompanyForm({ ...companyForm, invoiceNumberFormat: e.target.value })}
                  placeholder="PREFIX + 3-Digit Counter"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '6px' }}>
                  Default GST Percentage (%) *
                </label>
                <select
                  className="form-input"
                  value={companyForm.defaultGst}
                  onChange={(e) => setCompanyForm({ ...companyForm, defaultGst: Number(e.target.value) })}
                >
                  <option value={18}>18% (Standard Auto Repair & Parts)</option>
                  <option value={28}>28% (Luxury Car Tax)</option>
                  <option value={12}>12%</option>
                  <option value={5}>5%</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '6px' }}>
                Terms & Conditions (Printed on Bottom-Left of Invoice)
              </label>
              <textarea
                className="form-input"
                rows={4}
                value={companyForm.termsAndConditions}
                onChange={(e) => setCompanyForm({ ...companyForm, termsAndConditions: e.target.value })}
                placeholder="1. Goods once sold will not be returned..."
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '6px' }}>
                Invoice Footer Notice
              </label>
              <input
                type="text"
                className="form-input"
                value={companyForm.invoiceFooter}
                onChange={(e) => setCompanyForm({ ...companyForm, invoiceFooter: e.target.value })}
                placeholder="Thank you for choosing SR CARS. Precision engineering & warranty assured."
              />
            </div>

            {/* Bank Account Details for Invoices */}
            <h4 style={{ fontSize: '0.86rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--gold-600)', letterSpacing: '1px', marginBottom: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
              Bank Account Details for Wire Settlements
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, marginBottom: '4px' }}>Bank Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyForm.bankDetails.bankName}
                  onChange={(e) => setCompanyForm({ ...companyForm, bankDetails: { ...companyForm.bankDetails, bankName: e.target.value } })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, marginBottom: '4px' }}>Account Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyForm.bankDetails.accountName}
                  onChange={(e) => setCompanyForm({ ...companyForm, bankDetails: { ...companyForm.bankDetails, accountName: e.target.value } })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, marginBottom: '4px' }}>Account Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyForm.bankDetails.accountNumber}
                  onChange={(e) => setCompanyForm({ ...companyForm, bankDetails: { ...companyForm.bankDetails, accountNumber: e.target.value } })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, marginBottom: '4px' }}>IFSC Code</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyForm.bankDetails.ifsc}
                  onChange={(e) => setCompanyForm({ ...companyForm, bankDetails: { ...companyForm.bankDetails, ifsc: e.target.value.toUpperCase() } })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, marginBottom: '4px' }}>UPI ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyForm.bankDetails.upiId}
                  onChange={(e) => setCompanyForm({ ...companyForm, bankDetails: { ...companyForm.bankDetails, upiId: e.target.value } })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                type="submit"
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 24px',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--gold-shimmer)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Save size={16} />
                <span>Save Invoice Settings</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: USER MANAGEMENT */}
      {activeTab === 'USERS' && (
        <div>
          {/* Admin Account Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1.5px solid var(--border-gold)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Key size={20} color="var(--gold-500)" />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Super Admin Master Account
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Primary administrator holding unrestricted workshop permissions
                  </p>
                </div>
              </div>

              <span style={{ padding: '3px 10px', borderRadius: '999px', backgroundColor: '#d1fae5', color: '#065f46', fontSize: '0.74rem', fontWeight: 800 }}>
                2FA & Security Active
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', backgroundColor: '#fdfbf7', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Admin Name</span>
                <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>Vikram Singhania</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Email ID</span>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>admin@srcars.com</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Assigned Role</span>
                <div style={{ fontWeight: 800, color: 'var(--gold-600)', fontSize: '0.88rem' }}>Super Administrator</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Direct Access</span>
                <div style={{ fontWeight: 700, color: '#059669', fontSize: '0.85rem' }}>Full System Authority</div>
              </div>
            </div>
          </div>

          {/* Employee Accounts List & Permissions */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Staff & Employee Accounts ({employees.length})
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Service advisors, billing clerks, store managers and workshop technicians
                </p>
              </div>

              <button
                onClick={openAddEmpModal}
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 18px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--gold-shimmer)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Plus size={16} />
                <span>Add Employee</span>
              </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#fbf9f5', borderBottom: '1.5px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 12px' }}>Staff ID</th>
                  <th style={{ padding: '10px 12px' }}>Employee Name</th>
                  <th style={{ padding: '10px 12px' }}>Designation / Role</th>
                  <th style={{ padding: '10px 12px' }}>Contact Info</th>
                  <th style={{ padding: '10px 12px' }}>Status</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} style={{ borderBottom: '1px solid #f5f3ed' }}>
                    <td style={{ padding: '12px', fontWeight: 800, color: 'var(--gold-600)' }}>{emp.id}</td>
                    <td style={{ padding: '12px', fontWeight: 700 }}>{emp.name}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: '#fbf7ee', border: '1px solid var(--border-gold)', color: 'var(--gold-600)', fontSize: '0.74rem', fontWeight: 700 }}>
                        {emp.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      <div>{emp.email}</div>
                      <div>{emp.phone}</div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '999px', backgroundColor: emp.status === 'Active' ? '#d1fae5' : '#fee2e2', color: emp.status === 'Active' ? '#065f46' : '#b91c1c', fontSize: '0.72rem', fontWeight: 700 }}>
                        {emp.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button
                        onClick={() => openEditEmpModal(emp)}
                        title="Edit Employee"
                        style={{ padding: '5px', borderRadius: '6px', border: '1px solid var(--border-subtle)', backgroundColor: '#ffffff', color: 'var(--text-secondary)', cursor: 'pointer', marginRight: '6px' }}
                      >
                        <Edit3 size={14} />
                      </button>
                      {emp.id !== 'EMP-001' && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Remove employee ${emp.name}?`)) deleteEmployee(emp.id);
                          }}
                          title="Delete Employee"
                          style={{ padding: '5px', borderRadius: '6px', border: '1px solid #fecaca', backgroundColor: '#fff5f5', color: '#dc2626', cursor: 'pointer' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Roles & Permissions Matrix */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Roles & Permissions Matrix
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Granular access control by staff job category
              </p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#fbf9f5', borderBottom: '1.5px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left' }}>Role Title</th>
                  <th style={{ padding: '10px 12px' }}>Invoices & Billing</th>
                  <th style={{ padding: '10px 12px' }}>Clients Fleet</th>
                  <th style={{ padding: '10px 12px' }}>Services Catalog</th>
                  <th style={{ padding: '10px 12px' }}>Spare Inventory</th>
                  <th style={{ padding: '10px 12px' }}>Financial Reports</th>
                  <th style={{ padding: '10px 12px' }}>System Settings</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { role: 'Super Admin', inv: true, cust: true, srv: true, part: true, rep: true, set: true },
                  { role: 'Service Advisor', inv: true, cust: true, srv: true, part: false, rep: false, set: false },
                  { role: 'Inventory Manager', inv: false, cust: false, srv: false, part: true, rep: true, set: false },
                  { role: 'Billing Specialist', inv: true, cust: true, srv: false, part: false, rep: true, set: false }
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f5f3ed' }}>
                    <td style={{ padding: '12px', textAlign: 'left', fontWeight: 700 }}>{row.role}</td>
                    <td style={{ padding: '12px', color: row.inv ? '#059669' : '#9ca3af' }}>{row.inv ? '✓ Full' : '—'}</td>
                    <td style={{ padding: '12px', color: row.cust ? '#059669' : '#9ca3af' }}>{row.cust ? '✓ Full' : '—'}</td>
                    <td style={{ padding: '12px', color: row.srv ? '#059669' : '#9ca3af' }}>{row.srv ? '✓ Full' : '—'}</td>
                    <td style={{ padding: '12px', color: row.part ? '#059669' : '#9ca3af' }}>{row.part ? '✓ Full' : '—'}</td>
                    <td style={{ padding: '12px', color: row.rep ? '#059669' : '#9ca3af' }}>{row.rep ? '✓ Full' : '—'}</td>
                    <td style={{ padding: '12px', color: row.set ? '#059669' : '#9ca3af' }}>{row.set ? '✓ Full' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add / Edit Employee Modal */}
          {isEmpModalOpen && (
            <div className="modal-backdrop" onClick={() => setIsEmpModalOpen(false)}>
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: '520px',
                  width: '100%',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: '2px solid var(--border-gold)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '24px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {editingEmp ? 'Edit Employee Details' : 'Add Employee Account'}
                  </h3>
                  <button onClick={() => setIsEmpModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSaveEmployee}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '4px' }}>Employee Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={empFormData.name}
                        onChange={(e) => setEmpFormData({ ...empFormData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '4px' }}>Email Address *</label>
                      <input
                        type="email"
                        className="form-input"
                        value={empFormData.email}
                        onChange={(e) => setEmpFormData({ ...empFormData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '4px' }}>Mobile Phone</label>
                      <input
                        type="text"
                        className="form-input"
                        value={empFormData.phone}
                        onChange={(e) => setEmpFormData({ ...empFormData, phone: e.target.value })}
                        placeholder="+91..."
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '4px' }}>Role</label>
                        <select
                          className="form-input"
                          value={empFormData.role}
                          onChange={(e) => setEmpFormData({ ...empFormData, role: e.target.value })}
                        >
                          <option value="Service Advisor">Service Advisor</option>
                          <option value="Inventory Manager">Inventory Manager</option>
                          <option value="Billing Specialist">Billing Specialist</option>
                          <option value="Technician">Technician</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '4px' }}>Status</label>
                        <select
                          className="form-input"
                          value={empFormData.status}
                          onChange={(e) => setEmpFormData({ ...empFormData, status: e.target.value })}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setIsEmpModalOpen(false)}
                      className="btn-outline"
                      style={{ padding: '7px 16px', fontSize: '0.84rem' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{
                        padding: '7px 20px',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        background: 'var(--gold-shimmer)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      Save Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: GENERAL & BACKUPS */}
      {activeTab === 'GENERAL' && (
        <form onSubmit={handleSaveGeneralSettings}>
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Sliders size={22} color="var(--gold-500)" />
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  General Preferences & Localization
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Currency standards, date formatting and automated SMS / WhatsApp service notifications
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '6px' }}>
                  Currency Symbol & System *
                </label>
                <select
                  className="form-input"
                  value={companyForm.currency}
                  onChange={(e) => setCompanyForm({ ...companyForm, currency: e.target.value })}
                >
                  <option value="₹">INR (₹ - Indian Rupee)</option>
                  <option value="$">USD ($ - US Dollar)</option>
                  <option value="AED">AED (United Arab Emirates Dirham)</option>
                  <option value="€">EUR (€ - Euro)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '6px' }}>
                  Date Format *
                </label>
                <select
                  className="form-input"
                  value={companyForm.dateFormat}
                  onChange={(e) => setCompanyForm({ ...companyForm, dateFormat: e.target.value })}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY (Standard India e.g. 23/11/2026)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (ISO e.g. 2026-11-23)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (US Format)</option>
                </select>
              </div>
            </div>

            {/* Notification Preferences */}
            <h4 style={{ fontSize: '0.86rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--gold-600)', letterSpacing: '1px', marginBottom: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
              Notification Preferences
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '24px' }}>
              {[
                { key: 'smsInvoiceAlerts', label: 'SMS Invoice Link Alerts', desc: 'Auto-send payment link & PDF via SMS upon invoice finalization' },
                { key: 'whatsappServiceUpdates', label: 'WhatsApp Job Card Updates', desc: 'Notify clients when vehicle service steps are completed' },
                { key: 'lowStockAlerts', label: 'Low Stock Inventory Alerts', desc: 'Notify store managers when parts drop below safety thresholds' },
                { key: 'dailySalesEmail', label: 'Daily Sales Digest Email', desc: 'Email daily sales summary to executive management every night' }
              ].map((pref) => {
                const isChecked = companyForm.notificationPreferences[pref.key];
                return (
                  <div
                    key={pref.key}
                    style={{
                      padding: '14px',
                      borderRadius: '8px',
                      backgroundColor: '#fdfbf7',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        setCompanyForm({
                          ...companyForm,
                          notificationPreferences: {
                            ...companyForm.notificationPreferences,
                            [pref.key]: e.target.checked
                          }
                        })
                      }
                      style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: 'var(--gold-500)', cursor: 'pointer' }}
                    />
                    <div>
                      <strong style={{ fontSize: '0.84rem', color: 'var(--text-primary)' }}>{pref.label}</strong>
                      <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.3 }}>{pref.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
              <button
                type="submit"
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 24px',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--gold-shimmer)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Save size={16} />
                <span>Save General Preferences</span>
              </button>
            </div>

            {/* Backup Settings */}
            <div style={{ borderTop: '2px solid var(--border-subtle)', paddingTop: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Database size={20} color="var(--gold-500)" />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Backup Settings & Disaster Recovery
                </h4>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Export full offline JSON database backup (clients, vehicles, services, spare parts and historic invoices) or restore safely.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="btn-outline"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 18px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-md)',
                    borderColor: 'var(--border-gold)',
                    backgroundColor: '#ffffff',
                    color: 'var(--gold-600)',
                    cursor: 'pointer'
                  }}
                >
                  <Download size={16} />
                  <span>Download Full JSON Backup</span>
                </button>

                <label
                  className="btn-outline"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 18px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-md)',
                    borderColor: 'var(--border-subtle)',
                    backgroundColor: '#ffffff',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  <Upload size={16} />
                  <span>Restore from JSON File</span>
                  <input type="file" accept=".json" onChange={handleImportBackup} style={{ display: 'none' }} />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset database to default SR CARS demo dataset? All current additions will be cleared.')) {
                      resetToDefaults();
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 18px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #fecaca',
                    backgroundColor: '#fff5f5',
                    color: '#dc2626',
                    cursor: 'pointer'
                  }}
                >
                  <RotateCcw size={15} />
                  <span>Reset to Demo Data</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
