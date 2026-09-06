import {FormEvent, useEffect, useState} from 'react';
import {api} from '../lib/api';

type Coupon = {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount: number;
  isActive: boolean;
  expiryDate: string | null;
  vendorId?: string;
};

type CouponForm = {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: string;
  minOrderValue: string;
  maxDiscountAmount: string;
  isActive: boolean;
  expiryDate: string;
};

const emptyForm: CouponForm = {
  code: '',
  discountType: 'flat',
  discountValue: '',
  minOrderValue: '',
  maxDiscountAmount: '',
  isActive: true,
  expiryDate: '',
};

const CouponsPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingCouponId, setUpdatingCouponId] = useState<string | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');

  const loadCoupons = () => {
    setLoading(true);
    api
      .get('/admin/coupons')
      .then(response => setCoupons(response.data?.coupons ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const resetForm = () => {
    setEditingCoupon(null);
    setIsModalOpen(false);
    setForm(emptyForm);
    setMessage('');
  };

  const startCreate = () => {
    setEditingCoupon(null);
    setForm(emptyForm);
    setMessage('');
    setIsModalOpen(true);
  };

  const startEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minOrderValue: String(coupon.minOrderValue),
      maxDiscountAmount: String(coupon.maxDiscountAmount),
      isActive: coupon.isActive,
      expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().slice(0, 10) : '',
    });
    setMessage('');
    setIsModalOpen(true);
  };

  const submitCoupon = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');

    if (!form.code.trim()) {
      setMessage('Coupon code is required.');
      return;
    }

    if (!form.discountValue || isNaN(Number(form.discountValue))) {
      setMessage('Valid discount value is required.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        code: form.code.trim(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderValue: Number(form.minOrderValue || 0),
        maxDiscountAmount: Number(form.maxDiscountAmount || 0),
        isActive: form.isActive,
        expiryDate: form.expiryDate || null,
      };

      if (editingCoupon) {
        await api.put(`/admin/coupons/${editingCoupon.id}`, payload);
      } else {
        await api.post('/admin/coupons', payload);
      }

      resetForm();
      loadCoupons();
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message ||
          'Unable to save coupon. Please check details and try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleCoupon = (coupon: Coupon) => {
    setUpdatingCouponId(coupon.id);
    api
      .put(`/admin/coupons/${coupon.id}`, {isActive: !coupon.isActive})
      .then(loadCoupons)
      .finally(() => setUpdatingCouponId(null));
  };

  const deleteCoupon = (coupon: Coupon) => {
    const confirmed = window.confirm(`Delete coupon "${coupon.code}"?`);

    if (!confirmed) {
      return;
    }

    setUpdatingCouponId(coupon.id);
    api
      .delete(`/admin/coupons/${coupon.id}`)
      .then(() => {
        if (editingCoupon?.id === coupon.id) {
          resetForm();
        }
        loadCoupons();
      })
      .finally(() => setUpdatingCouponId(null));
  };

  return (
    <section className="page-stack">
      <div className="section-header">
        <div>
          <p className="eyebrow">Operations</p>
          <h2>Coupons</h2>
        </div>
        <button className="secondary-button" onClick={startCreate}>
          Create coupon
        </button>
      </div>

      {loading ? (
        <div className="content-card">Loading coupons…</div>
      ) : coupons.length > 0 ? (
        <div className="content-card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Min. Order</th>
                <th>Max. Discount</th>
                <th>Expires</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon.id}>
                  <td><strong>{coupon.code}</strong></td>
                  <td>
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}%`
                      : `₹${coupon.discountValue}`}
                  </td>
                  <td>₹{coupon.minOrderValue}</td>
                  <td>{coupon.maxDiscountAmount ? `₹${coupon.maxDiscountAmount}` : 'None'}</td>
                  <td>{coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'Never'}</td>
                  <td>
                    <span className={coupon.isActive ? 'status-badge' : 'status-badge-muted'}>
                      {coupon.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="ghost-button" onClick={() => startEdit(coupon)}>
                        Edit
                      </button>
                      <button
                        className="ghost-button"
                        disabled={updatingCouponId === coupon.id}
                        onClick={() => toggleCoupon(coupon)}>
                        {coupon.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        className="ghost-button"
                        disabled={updatingCouponId === coupon.id}
                        onClick={() => deleteCoupon(coupon)}
                        style={{ color: 'var(--red-600)' }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="content-card empty-state-card">
          <h3>No coupons found</h3>
          <p>Create discount codes to offer promotions to your customers.</p>
          <button className="secondary-button" onClick={startCreate}>
            Create coupon
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-backdrop" role="presentation">
          <form className="modal-card banner-form" onSubmit={submitCoupon}>
            <div className="modal-header">
              <div>
                <p className="eyebrow">{editingCoupon ? 'Edit' : 'Create'}</p>
                <h3>{editingCoupon ? editingCoupon.code : 'New Coupon'}</h3>
              </div>
              <button className="ghost-button" type="button" onClick={resetForm}>
                Close
              </button>
            </div>

            <label>
              Coupon Code (e.g. FESTIVAL50)
              <input
                value={form.code}
                onChange={event =>
                  setForm(current => ({...current, code: event.target.value.toUpperCase()}))
                }
                placeholder="WELCOME10"
                maxLength={20}
                required
              />
            </label>

            <div style={{ display: 'flex', gap: '16px' }}>
              <label style={{ flex: 1 }}>
                Discount Type
                <select
                  value={form.discountType}
                  onChange={event =>
                    setForm(current => ({...current, discountType: event.target.value as 'percentage' | 'flat'}))
                  }
                >
                  <option value="flat">Flat Amount (₹)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
              </label>

              <label style={{ flex: 1 }}>
                Discount Value
                <input
                  value={form.discountValue}
                  onChange={event =>
                    setForm(current => ({...current, discountValue: event.target.value}))
                  }
                  placeholder={form.discountType === 'percentage' ? '10' : '50'}
                  type="number"
                  min="1"
                  required
                />
              </label>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <label style={{ flex: 1 }}>
                Min. Order Value (₹)
                <input
                  value={form.minOrderValue}
                  onChange={event =>
                    setForm(current => ({...current, minOrderValue: event.target.value}))
                  }
                  placeholder="0"
                  type="number"
                  min="0"
                />
              </label>

              <label style={{ flex: 1 }}>
                Max. Discount Amount (₹)
                <input
                  value={form.maxDiscountAmount}
                  onChange={event =>
                    setForm(current => ({...current, maxDiscountAmount: event.target.value}))
                  }
                  placeholder="No limit"
                  type="number"
                  min="0"
                  disabled={form.discountType === 'flat'}
                />
              </label>
            </div>

            <label>
              Expiry Date (Optional)
              <input
                value={form.expiryDate}
                onChange={event =>
                  setForm(current => ({...current, expiryDate: event.target.value}))
                }
                type="date"
              />
            </label>

            <label className="checkbox-row">
              <input
                checked={form.isActive}
                onChange={event =>
                  setForm(current => ({
                    ...current,
                    isActive: event.target.checked,
                  }))
                }
                type="checkbox"
              />
              Active
            </label>

            {message && <div className="form-error">{message}</div>}

            <button className="primary-button" disabled={saving}>
              {saving
                ? 'Saving…'
                : 'Save coupon'}
            </button>
          </form>
        </div>
      )}
    </section>
  );
};

export default CouponsPage;
