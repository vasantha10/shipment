import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getShipment, deleteShipment, extractErrorMessage } from '../api/shipmentApi.js';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

export default function ShipmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    getShipment(id)
      .then(setShipment)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleConfirmDelete() {
    try {
      await deleteShipment(id);
      navigate('/');
    } catch (err) {
      setConfirmingDelete(false);
      setError(extractErrorMessage(err));
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <div className="error-banner">{error}</div>;
  if (!shipment) return null;

  return (
    <div>
      <div className="top-bar">
        <h1>{shipment.trackingNumber}</h1>
        <div>
          <Link to="/" className="btn">
            Back to list
          </Link>{' '}
          <Link to={`/shipments/${id}/edit`} className="btn">
            Edit
          </Link>{' '}
          <button className="btn btn-danger" onClick={() => setConfirmingDelete(true)}>
            Delete
          </button>
        </div>
      </div>

      <div className="detail-grid">
        <div>
          <span>Sender</span>
          {shipment.senderName}
        </div>
        <div>
          <span>Receiver</span>
          {shipment.receiverName}
        </div>
        <div>
          <span>Origin</span>
          {shipment.origin}
        </div>
        <div>
          <span>Destination</span>
          {shipment.destination}
        </div>
        <div>
          <span>Carrier</span>
          {shipment.carrier}
        </div>
        <div>
          <span>Status</span>
          <span className="status-badge">{shipment.status}</span>
        </div>
        <div>
          <span>Expected Delivery</span>
          {shipment.expectedDeliveryDate}
        </div>
        <div>
          <span>Created At</span>
          {shipment.createdAt}
        </div>
        <div>
          <span>Updated At</span>
          {shipment.updatedAt}
        </div>
      </div>

      {confirmingDelete && (
        <ConfirmDialog
          message="Are you sure you want to delete this shipment?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </div>
  );
}
