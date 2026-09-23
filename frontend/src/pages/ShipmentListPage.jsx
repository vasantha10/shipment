import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listShipments, deleteShipment, extractErrorMessage, STATUS_OPTIONS } from '../api/shipmentApi.js';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

export default function ShipmentListPage() {
  const [shipments, setShipments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  async function loadShipments() {
    setLoading(true);
    setError('');
    try {
      const data = await listShipments(statusFilter || undefined);
      setShipments(data);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadShipments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  async function handleConfirmDelete() {
    try {
      await deleteShipment(pendingDeleteId);
      setPendingDeleteId(null);
      loadShipments();
    } catch (err) {
      setPendingDeleteId(null);
      setError(extractErrorMessage(err));
    }
  }

  return (
    <div>
      <div className="top-bar">
        <h1>Shipments</h1>
        <Link to="/shipments/new" className="btn btn-primary">
          Add Shipment
        </Link>
      </div>

      <div className="field" style={{ maxWidth: 260 }}>
        <label htmlFor="status-filter">Filter by status</label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p>Loading shipments...</p>
      ) : shipments.length === 0 ? (
        <div className="empty-state">
          <p>No shipments match the selected filter.</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Tracking #</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Carrier</th>
              <th>Expected Delivery</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment) => (
              <tr key={shipment.id}>
                <td>{shipment.trackingNumber}</td>
                <td>{shipment.origin}</td>
                <td>{shipment.destination}</td>
                <td>{shipment.carrier}</td>
                <td>{shipment.expectedDeliveryDate}</td>
                <td>
                  <span className="status-badge">{shipment.status}</span>
                </td>
                <td>
                  <Link to={`/shipments/${shipment.id}`} className="btn">
                    View
                  </Link>{' '}
                  <Link to={`/shipments/${shipment.id}/edit`} className="btn">
                    Edit
                  </Link>{' '}
                  <button className="btn btn-danger" onClick={() => setPendingDeleteId(shipment.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {pendingDeleteId !== null && (
        <ConfirmDialog
          message="Are you sure you want to delete this shipment?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </div>
  );
}
