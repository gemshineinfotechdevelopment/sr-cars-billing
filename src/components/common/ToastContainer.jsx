import React from 'react';
import { useBilling } from '../../context/BillingContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useBilling();

  if (!toasts.length) return null;

  return (
    <div
      className="toast-container no-print"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '400px'
      }}
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            style={{
              background: 'var(--bg-card-solid)',
              border: isSuccess
                ? '1px solid rgba(16, 185, 129, 0.4)'
                : isError
                ? '1px solid rgba(239, 68, 68, 0.4)'
                : '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
              backdropFilter: 'blur(12px)',
              animation: 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {isSuccess && <CheckCircle2 size={18} color="var(--status-paid)" />}
            {isError && <AlertCircle size={18} color="var(--status-overdue)" />}
            {isInfo && <Info size={18} color="var(--gold-400)" />}

            <span style={{ flex: 1, fontWeight: 500 }}>{toast.message}</span>

            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px'
              }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
