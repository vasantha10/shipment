export const STATUS_MODIFIERS = {
  CREATED: 'created',
  PICKED_UP: 'picked-up',
  IN_TRANSIT: 'in-transit',
  OUT_FOR_DELIVERY: 'out-for-delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export function statusBadgeClass(status) {
  const modifier = STATUS_MODIFIERS[status];
  return modifier ? `status-badge status-badge--${modifier}` : 'status-badge';
}
