import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createShipment,
  updateShipment,
  getShipment,
  extractErrorMessage,
  STATUS_OPTIONS,
} from '../api/shipmentApi.js';

const emptyForm = {
  trackingNumber: '',
  senderName: '',
  receiverName: '',
  origin: '',
  destination: '',
  carrier: '',
  status: 'CREATED',
  expectedDeliveryDate: '',
};

function validate(form) {
  const errors = {};
  if (!form.trackingNumber || form.trackingNumber.length < 5 || form.trackingNumber.length > 30) {
    errors.trackingNumber = 'Tracking number must be 5-30 characters.';
  }
  if (!form.senderName || form.senderName.length < 2 || form.senderName.length > 100) {
    errors.senderName = 'Sender name must be 2-100 characters.';
  }
  if (!form.receiverName || form.receiverName.length < 2 || form.receiverName.length > 100) {
    errors.receiverName = 'Receiver name must be 2-100 characters.';
  }
  if (!form.origin || form.origin.length < 2 || form.origin.length > 100) {
    errors.origin = 'Origin must be 2-100 characters.';
  }
  if (!form.destination || form.destination.length < 2 || form.destination.length > 100) {
    errors.destination = 'Destination must be 2-100 characters.';
  }
  if (!form.carrier || form.carrier.length < 2 || form.carrier.length > 100) {
    errors.carrier = 'Carrier must be 2-100 characters.';
  }
  if (!form.expectedDeliveryDate) {
    errors.expectedDeliveryDate = 'Expected delivery date is required.';
  }
  return errors;
}

export default function ShipmentFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    getShipment(id)
      .then((data) =>
        setForm({
          trackingNumber: data.trackingNumber,
          senderName: data.senderName,
          receiverName: data.receiverName,
          origin: data.origin,
          destination: data.destination,
          carrier: data.carrier,
          status: data.status,
          expectedDeliveryDate: data.expectedDeliveryDate,
        })
      )
      .catch((err) => setSubmitError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSaving(true);
    setSubmitError('');
    try {
      if (isEdit) {
        await updateShipment(id, form);
        navigate(`/shipments/${id}`);
      } else {
        const created = await createShipment(form);
        navigate(`/shipments/${created.id}`);
      }
    } catch (err) {
      setSubmitError(extractErrorMessage(err));
      setSaving(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 style={{ marginBottom: 'var(--space-6)' }}>{isEdit ? 'Edit Shipment' : 'Add Shipment'}</h1>

      {submitError && <div className="error-banner">{submitError}</div>}

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="trackingNumber">Tracking Number</label>
            <input
              id="trackingNumber"
              value={form.trackingNumber}
              onChange={(e) => handleChange('trackingNumber', e.target.value)}
            />
            {errors.trackingNumber && <div className="error">{errors.trackingNumber}</div>}
          </div>

          <div className="field-grid">
            <div className="field">
              <label htmlFor="senderName">Sender Name</label>
              <input
                id="senderName"
                value={form.senderName}
                onChange={(e) => handleChange('senderName', e.target.value)}
              />
              {errors.senderName && <div className="error">{errors.senderName}</div>}
            </div>

            <div className="field">
              <label htmlFor="receiverName">Receiver Name</label>
              <input
                id="receiverName"
                value={form.receiverName}
                onChange={(e) => handleChange('receiverName', e.target.value)}
              />
              {errors.receiverName && <div className="error">{errors.receiverName}</div>}
            </div>
          </div>

          <div className="field-grid">
            <div className="field">
              <label htmlFor="origin">Origin</label>
              <input
                id="origin"
                value={form.origin}
                onChange={(e) => handleChange('origin', e.target.value)}
              />
              {errors.origin && <div className="error">{errors.origin}</div>}
            </div>

            <div className="field">
              <label htmlFor="destination">Destination</label>
              <input
                id="destination"
                value={form.destination}
                onChange={(e) => handleChange('destination', e.target.value)}
              />
              {errors.destination && <div className="error">{errors.destination}</div>}
            </div>
          </div>

          <div className="field-grid">
            <div className="field">
              <label htmlFor="carrier">Carrier</label>
              <input
                id="carrier"
                value={form.carrier}
                onChange={(e) => handleChange('carrier', e.target.value)}
              />
              {errors.carrier && <div className="error">{errors.carrier}</div>}
            </div>

            <div className="field">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="expectedDeliveryDate">Expected Delivery Date</label>
            <input
              id="expectedDeliveryDate"
              type="date"
              value={form.expectedDeliveryDate}
              onChange={(e) => handleChange('expectedDeliveryDate', e.target.value)}
            />
            {errors.expectedDeliveryDate && <div className="error">{errors.expectedDeliveryDate}</div>}
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
