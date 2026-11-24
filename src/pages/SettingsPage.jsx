import React, { useState } from 'react';
import { useBilling } from '../context/useBilling';
import { 
  Building2, 
  Edit3, 
  Save, 
  X, 
  Crown, 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  FileText
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings } = useBilling();

  const [isEditing, setIsEditing] = useState(false);

  const [companyForm, setCompanyForm] = useState({
    dealershipName: settings.dealershipName || 'SR CARS',
    tagline: settings.tagline || 'Prestige Automobiles & Performance Service Center',
    companyLogo: settings.companyLogo || '',
    address: settings.address || '',
    phone: settings.phone || '',
    email: settings.email || '',
    workingHours: settings.workingHours || 'Mon – Sat: 9:00 AM – 8:00 PM',
    gstin: settings.gstin || ''
  });

  const handleStartEdit = () => {
    setCompanyForm({
      dealershipName: settings.dealershipName || 'SR CARS',
      tagline: settings.tagline || 'Prestige Automobiles & Performance Service Center',
      companyLogo: settings.companyLogo || '',
      address: settings.address || '',
      phone: settings.phone || '',
      email: settings.email || '',
      workingHours: settings.workingHours || 'Mon – Sat: 9:00 AM – 8:00 PM',
      gstin: settings.gstin || ''
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setCompanyForm({
      dealershipName: settings.dealershipName || 'SR CARS',
      tagline: settings.tagline || 'Prestige Automobiles & Performance Service Center',
      companyLogo: settings.companyLogo || '',
      address: settings.address || '',
      phone: settings.phone || '',
      email: settings.email || '',
      workingHours: settings.workingHours || 'Mon – Sat: 9:00 AM – 8:00 PM',
      gstin: settings.gstin || ''
    });
    setIsEditing(false);
  };

  const handleSaveCompanySettings = (e) => {
    e.preventDefault();
    if (!companyForm.dealershipName.trim()) {
      alert('Company / Dealership Name is required.');
      return;
    }
    updateSettings({
      ...settings,
      ...companyForm
    });
    setIsEditing(false);
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
              Dealership Identity
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
            Company Profile Settings
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
            Official business identity, contact information and branding details printed across customer invoices.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!isEditing ? (
            <button
              type="button"
              onClick={handleStartEdit}
              className="btn-primary"
              style={{
                display: 'inline-flex',
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
              <Edit3 size={16} />
              <span>Edit Settings</span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn-outline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
                <span>Cancel</span>
              </button>

              <button
                type="submit"
                form="company-settings-form"
                className="btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 22px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--gold-shimmer)',
                  color: '#ffffff',
                  border: 'none',
                  boxShadow: 'var(--shadow-gold)',
                  cursor: 'pointer'
                }}
              >
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Settings Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '30px',
          boxShadow: 'var(--shadow-sm)',
          maxWidth: '1100px'
        }}
      >
        {!isEditing ? (
          /* ================= VIEW MODE (5 SECTIONS) ================= */
          <div>
            {/* Header / Brand block */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                paddingBottom: '24px',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '24px',
                flexWrap: 'wrap'
              }}
            >
              <div
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '16px',
                  border: '2px solid var(--border-gold)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f8fafc',
                  flexShrink: 0
                }}
              >
                {settings.companyLogo ? (
                  <img
                    src={settings.companyLogo}
                    alt="Logo"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Crown size={38} color="var(--gold-500)" />
                )}
              </div>

              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                  {settings.dealershipName || 'SR CARS'}
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--gold-600)', fontWeight: 600, marginTop: '4px', margin: 0 }}>
                  {settings.tagline || 'Prestige Automobiles & Performance Service Center'}
                </p>
              </div>
            </div>

            {/* Exactly 5 Sections in Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px'
              }}
            >
              {/* 1. Official Phone */}
              <div
                style={{
                  padding: '16px 20px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: 'var(--gold-600)' }}>
                  <Phone size={16} />
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Official Phone
                  </span>
                </div>
                <div style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {settings.phone || '—'}
                </div>
              </div>

              {/* 2. Official Email */}
              <div
                style={{
                  padding: '16px 20px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: 'var(--gold-600)' }}>
                  <Mail size={16} />
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Official Email
                  </span>
                </div>
                <div style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {settings.email || '—'}
                </div>
              </div>

              {/* 3. Business / Working Hours */}
              <div
                style={{
                  padding: '16px 20px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: 'var(--gold-600)' }}>
                  <Clock size={16} />
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Business / Working Hours
                  </span>
                </div>
                <div style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {settings.workingHours || 'Mon – Sat: 9:00 AM – 8:00 PM'}
                </div>
              </div>

              {/* 4. GST Identification */}
              <div
                style={{
                  padding: '16px 20px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: 'var(--gold-600)' }}>
                  <FileText size={16} />
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    GST Identification (GSTIN)
                  </span>
                </div>
                <div style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {settings.gstin || '—'}
                </div>
              </div>

              {/* 5. Showroom & Workshop Address */}
              <div
                style={{
                  gridColumn: '1 / -1',
                  padding: '16px 20px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: 'var(--gold-600)' }}>
                  <MapPin size={16} />
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Showroom & Workshop Address
                  </span>
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {settings.address || '—'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ================= EDIT MODE (EXACT SAME 5 SECTIONS) ================= */
          <form id="company-settings-form" onSubmit={handleSaveCompanySettings}>
            {/* Header / Brand block (Editable) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '24px',
                paddingBottom: '24px',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '24px',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <div
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '16px',
                    border: '2px solid var(--border-gold)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff'
                  }}
                >
                  {companyForm.companyLogo ? (
                    <img
                      src={companyForm.companyLogo}
                      alt="Logo"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Crown size={38} color="var(--gold-500)" />
                  )}
                </div>
              </div>

              <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-secondary)' }}>
                      Company / Dealership Name *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={companyForm.dealershipName}
                      onChange={(e) => setCompanyForm({ ...companyForm, dealershipName: e.target.value })}
                      placeholder="SR CARS"
                      style={{ height: '38px', fontSize: '0.9rem', fontWeight: 700 }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-secondary)' }}>
                      Brand Tagline
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={companyForm.tagline}
                      onChange={(e) => setCompanyForm({ ...companyForm, tagline: e.target.value })}
                      placeholder="Prestige Automobiles & Performance Center"
                      style={{ height: '38px', fontSize: '0.84rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    Company Logo URL
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={companyForm.companyLogo}
                    onChange={(e) => setCompanyForm({ ...companyForm, companyLogo: e.target.value })}
                    placeholder="https://your-domain.com/logo.png"
                    style={{ height: '36px', fontSize: '0.82rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Exactly 5 Sections in Grid (1-to-1 match with view mode) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px'
              }}
            >
              {/* 1. Official Phone */}
              <div
                style={{
                  padding: '16px 20px',
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--gold-600)' }}>
                  <Phone size={16} />
                  <label style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Official Phone *
                  </label>
                </div>
                <input
                  type="text"
                  className="form-input"
                  value={companyForm.phone}
                  onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                  placeholder="+91 98490 87654"
                  style={{ height: '38px', fontSize: '0.88rem' }}
                  required
                />
              </div>

              {/* 2. Official Email */}
              <div
                style={{
                  padding: '16px 20px',
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--gold-600)' }}>
                  <Mail size={16} />
                  <label style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Official Email
                  </label>
                </div>
                <input
                  type="text"
                  className="form-input"
                  value={companyForm.email}
                  onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                  placeholder="billing@srcarsluxury.com"
                  style={{ height: '38px', fontSize: '0.88rem' }}
                />
              </div>

              {/* 3. Business / Working Hours */}
              <div
                style={{
                  padding: '16px 20px',
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--gold-600)' }}>
                  <Clock size={16} />
                  <label style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Business / Working Hours
                  </label>
                </div>
                <input
                  type="text"
                  className="form-input"
                  value={companyForm.workingHours}
                  onChange={(e) => setCompanyForm({ ...companyForm, workingHours: e.target.value })}
                  placeholder="e.g. Mon – Sat: 9:00 AM – 8:00 PM"
                  style={{ height: '38px', fontSize: '0.88rem' }}
                />
              </div>

              {/* 4. GST Identification */}
              <div
                style={{
                  padding: '16px 20px',
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--gold-600)' }}>
                  <FileText size={16} />
                  <label style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    GST Identification (GSTIN)
                  </label>
                </div>
                <input
                  type="text"
                  className="form-input"
                  value={companyForm.gstin}
                  onChange={(e) => setCompanyForm({ ...companyForm, gstin: e.target.value.toUpperCase() })}
                  placeholder="36AABCU9603R1ZM"
                  style={{ height: '38px', fontSize: '0.88rem' }}
                />
              </div>

              {/* 5. Showroom & Workshop Address */}
              <div
                style={{
                  gridColumn: '1 / -1',
                  padding: '16px 20px',
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--gold-600)' }}>
                  <MapPin size={16} />
                  <label style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Showroom & Workshop Address *
                  </label>
                </div>
                <textarea
                  className="form-input"
                  rows={3}
                  value={companyForm.address}
                  onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                  placeholder="Plot 42, Luxury Motor Boulevard, Jubilee Hills, Hyderabad - 500033"
                  style={{ fontSize: '0.88rem', lineHeight: 1.5 }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn-outline"
                style={{
                  padding: '9px 20px',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

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
                  boxShadow: 'var(--shadow-gold)',
                  cursor: 'pointer'
                }}
              >
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
