import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2, Plus, PackageSearch } from 'lucide-react';
import { listShipments, deleteShipment, extractErrorMessage, STATUS_OPTIONS } from '../api/shipmentApi.js';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { statusBadgeClass } from '../constants/statusConfig.js';
import { formatDate } from '../utils/formatDate.js';

const SKELETON_ROWS = 4;

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
          <Plus size={16} />
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
        <div className="table-wrap">
          <span className="sr-only">Loading shipments</span>
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
              {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j}>
                      <div className="skeleton-cell" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : shipments.length === 0 ? (
        <div className="empty-state">
          <PackageSearch size={40} />
          <p>No shipments match the selected filter.</p>
        </div>
      ) : (
        <div className="table-wrap">
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
                  <td>{formatDate(shipment.expectedDeliveryDate)}</td>
                  <td>
                    <span className={statusBadgeClass(shipment.status)}>{shipment.status}</span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link
                        to={`/shipments/${shipment.id}`}
                        className="btn btn-icon"
                        aria-label="View shipment"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        to={`/shipments/${shipment.id}/edit`}
                        className="btn btn-icon"
                        aria-label="Edit shipment"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        className="btn btn-icon btn-danger"
                        aria-label="Delete shipment"
                        onClick={() => setPendingDeleteId(shipment.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
