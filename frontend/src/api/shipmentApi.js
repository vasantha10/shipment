import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

export const STATUS_OPTIONS = [
  'CREATED',
  'PICKED_UP',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

export async function listShipments(status) {
  const params = status ? { status } : {};
  const response = await apiClient.get('/api/shipments', { params });
  return response.data;
}

export async function getShipment(id) {
  const response = await apiClient.get(`/api/shipments/${id}`);
  return response.data;
}

export async function createShipment(payload) {
  const response = await apiClient.post('/api/shipments', payload);
  return response.data;
}

export async function updateShipment(id, payload) {
  const response = await apiClient.put(`/api/shipments/${id}`, payload);
  return response.data;
}

export async function deleteShipment(id) {
  await apiClient.delete(`/api/shipments/${id}`);
}

export function extractErrorMessage(error) {
  return error?.response?.data?.message || 'Something went wrong. Please try again.';
}
