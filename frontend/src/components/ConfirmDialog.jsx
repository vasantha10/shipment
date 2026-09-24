import { TriangleAlert, Trash2 } from 'lucide-react';

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-icon">
          <TriangleAlert size={20} />
        </div>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
