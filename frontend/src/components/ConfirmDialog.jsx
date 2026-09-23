export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
