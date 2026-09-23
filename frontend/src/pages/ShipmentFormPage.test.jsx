import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ShipmentFormPage from './ShipmentFormPage.jsx';
import * as shipmentApi from '../api/shipmentApi.js';

vi.mock('../api/shipmentApi.js', async () => {
  const actual = await vi.importActual('../api/shipmentApi.js');
  return {
    ...actual,
    createShipment: vi.fn(),
  };
});

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/shipments/new']}>
      <ShipmentFormPage />
    </MemoryRouter>
  );
}

describe('ShipmentFormPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows validation errors and does not submit when required fields are empty', async () => {
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(await screen.findAllByText(/must be/i)).not.toHaveLength(0);
    expect(shipmentApi.createShipment).not.toHaveBeenCalled();
  });

  it('submits successfully when all fields are valid', async () => {
    shipmentApi.createShipment.mockResolvedValue({ id: 42 });

    renderPage();

    await userEvent.type(screen.getByLabelText(/tracking number/i), 'SHP-1001');
    await userEvent.type(screen.getByLabelText(/sender name/i), 'North Warehouse');
    await userEvent.type(screen.getByLabelText(/receiver name/i), 'City Pharmacy');
    await userEvent.type(screen.getByLabelText(/^origin$/i), 'Leeds');
    await userEvent.type(screen.getByLabelText(/^destination$/i), 'London');
    await userEvent.type(screen.getByLabelText(/^carrier$/i), 'QuickMove Logistics');
    await userEvent.type(screen.getByLabelText(/expected delivery date/i), '2026-12-01');

    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(shipmentApi.createShipment).toHaveBeenCalledTimes(1);
  });
});
