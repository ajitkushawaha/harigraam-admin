import { useEffect, useState } from 'react';
import { api } from '../lib/api';

type NotificationSettings = {
  enableSMS: boolean;
  enableWhatsApp: boolean;
  enableEmail: boolean;
};

const NotificationSettingsPage = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    enableSMS: true,
    enableWhatsApp: true,
    enableEmail: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/settings/notifications');
      setSettings(response.data || { enableSMS: true, enableWhatsApp: true, enableEmail: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to load notification settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleToggle = (field: keyof NotificationSettings) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await api.put('/admin/settings/notifications', settings);
      setMessage('Notification settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="content-card">Loading settings...</div>;
  }

  return (
    <section className="page-stack">
      <div className="section-header">
        <div>
          <p className="eyebrow">Settings</p>
          <h2>Notifications</h2>
        </div>
        <button 
          className="primary-button" 
          onClick={handleSave} 
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
      
      {error && <div className="status-badge-muted" style={{color: 'red', display: 'block', padding: '10px'}}>{error}</div>}
      {message && <div className="status-badge" style={{display: 'block', padding: '10px', backgroundColor: '#e6f4ea', color: '#137333'}}>{message}</div>}
      
      <div className="content-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: '0 0 4px 0' }}>SMS Notifications</h3>
            <p style={{ margin: 0, color: '#666' }}>Send order updates to customers via SMS (Zavu).</p>
          </div>
          <label className="checkbox-wrapper" style={{ cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={settings.enableSMS} 
              onChange={() => handleToggle('enableSMS')} 
            />
            <span>Enabled</span>
          </label>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: 0 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: '0 0 4px 0' }}>WhatsApp Notifications</h3>
            <p style={{ margin: 0, color: '#666' }}>Send order updates to customers via WhatsApp (Zavu).</p>
          </div>
          <label className="checkbox-wrapper" style={{ cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={settings.enableWhatsApp} 
              onChange={() => handleToggle('enableWhatsApp')} 
            />
            <span>Enabled</span>
          </label>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: 0 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: '0 0 4px 0' }}>Email Notifications</h3>
            <p style={{ margin: 0, color: '#666' }}>Send HTML order confirmation emails via Nodemailer.</p>
          </div>
          <label className="checkbox-wrapper" style={{ cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={settings.enableEmail} 
              onChange={() => handleToggle('enableEmail')} 
            />
            <span>Enabled</span>
          </label>
        </div>
      </div>
    </section>
  );
};

export default NotificationSettingsPage;
