import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ShipmentListPage from './ShipmentListPage.jsx';
import * as shipmentApi from '../api/shipmentApi.js';

vi.mock('../api/shipmentApi.js', async () => {
  const actual = await vi.importActual('../api/shipmentApi.js');
  return {
    ...actual,
    listShipments: vi.fn(),
    deleteShipment: vi.fn(),
  };
});

function renderPage() {
  return render(
    <MemoryRouter>
      <ShipmentListPage />
    </MemoryRouter>
  );
}

describe('ShipmentListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state then renders shipments', async () => {
    shipmentApi.listShipments.mockResolvedValue([
      {
        id: 1,
        trackingNumber: 'SHP-1001',
        origin: 'Leeds',
        destination: 'London',
        carrier: 'QuickMove',
        expectedDeliveryDate: '2026-12-01',
        status: 'CREATED',
      },
    ]);

    renderPage();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('SHP-1001')).toBeInTheDocument();
    });
  });

  it('shows empty state when no shipments match filter', async () => {
    shipmentApi.listShipments.mockResolvedValue([]);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/no shipments match/i)).toBeInTheDocument();
    });
  });

  it('shows an error message when the API call fails', async () => {
    shipmentApi.listShipments.mockRejectedValue({
      response: { data: { message: 'Server exploded' } },
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Server exploded')).toBeInTheDocument();
    });
  });

  it('asks for confirmation before deleting a shipment', async () => {
    shipmentApi.listShipments.mockResolvedValue([
      {
        id: 1,
        trackingNumber: 'SHP-1001',
        origin: 'Leeds',
        destination: 'London',
        carrier: 'QuickMove',
        expectedDeliveryDate: '2026-12-01',
        status: 'CREATED',
      },
    ]);

    renderPage();
    await waitFor(() => expect(screen.getByText('SHP-1001')).toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    expect(shipmentApi.deleteShipment).not.toHaveBeenCalled();
  });
});
