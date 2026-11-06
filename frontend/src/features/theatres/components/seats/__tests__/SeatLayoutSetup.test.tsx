import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SeatLayoutSetup from '../SeatLayoutSetup';
import * as seatsApi from '../../../api/seats.api';

describe('SeatLayoutSetup Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const renderComponent = (onSetupSuccess = vi.fn()) =>
    render(
      <QueryClientProvider client={queryClient}>
        <SeatLayoutSetup
          theatreId="th-1"
          screenId="sc-1"
          screenName="Audi 1"
          onSetupSuccess={onSetupSuccess}
        />
      </QueryClientProvider>,
    );

  it('renders initial multi-section layout builder with BookMyShow defaults and live preview', () => {
    renderComponent();

    expect(screen.getByText('Configure Seating Layout')).toBeInTheDocument();
    expect(screen.getByText('Audi 1')).toBeInTheDocument();
    expect(screen.getByText('Live Auditorium Blueprint Preview')).toBeInTheDocument();
    expect(screen.getByText('All eyes this way please')).toBeInTheDocument();

    // Default multi-section configuration: Left (7), Centre (14), Right (7) across 4 rows
    expect(screen.getByText('Layout Type B — Multi-Section Auditorium')).toBeInTheDocument();
    expect(screen.getByText('Layout Type A — Simple Continuous Grid')).toBeInTheDocument();
  });

  it('switches between Multi-Section and Simple layout modes', async () => {
    const user = userEvent.setup();
    renderComponent();

    const simpleModeBtn = screen.getByRole('button', {
      name: /Layout Type A — Simple Continuous Grid/i,
    });
    await user.click(simpleModeBtn);

    expect(screen.getByText('Row Configurations')).toBeInTheDocument();
    expect(screen.getAllByText('40').length).toBeGreaterThan(0); // 4 rows of 10 in simple mode

    const multiModeBtn = screen.getByRole('button', {
      name: /Layout Type B — Multi-Section Auditorium/i,
    });
    await user.click(multiModeBtn);

    expect(screen.getByText('Row-by-Row Section Matrix')).toBeInTheDocument();
  });

  it('applies multi-section presets', async () => {
    const user = userEvent.setup();
    renderComponent();

    const grandPresetBtn = screen.getByRole('button', {
      name: /Grand 4-Section Multiplex/i,
    });
    await user.click(grandPresetBtn);

    // 4 sections created
    expect(screen.getByText('Auditorium Seating Sections (4)')).toBeInTheDocument();
  });

  it('adds and removes sections in multi-section mode', async () => {
    const user = userEvent.setup();
    renderComponent();

    const addSectionBtn = screen.getByRole('button', { name: /add section/i });
    await user.click(addSectionBtn);

    expect(screen.getByText('Auditorium Seating Sections (4)')).toBeInTheDocument();

    const removeSectionBtns = screen.getAllByTitle('Remove section');
    await user.click(removeSectionBtns[removeSectionBtns.length - 1]);

    expect(screen.getByText('Auditorium Seating Sections (3)')).toBeInTheDocument();
  });

  it('adds and removes rows in multi-section mode', async () => {
    const user = userEvent.setup();
    renderComponent();

    const addRowBtn = screen.getByRole('button', { name: /add row/i });
    await user.click(addRowBtn);

    // Row 'E' should now exist in the table
    expect(screen.getByDisplayValue('E')).toBeInTheDocument();

    const removeRowBtns = screen.getAllByRole('button', { name: /remove row/i });
    await user.click(removeRowBtns[0]);

    // Row A removed, Row B should be first
    expect(screen.queryByDisplayValue('A')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('B')).toBeInTheDocument();
  });

  it('validates total seat count exceeds 50 per row in multi-section mode', async () => {
    const user = userEvent.setup();
    renderComponent();

    const numberInputs = screen.getAllByRole('spinbutton');
    // First section seat input in row 1
    await user.clear(numberInputs[0]);
    await user.type(numberInputs[0], '40'); // Left: 40 + Centre: 14 + Right: 7 = 61 (> 50)

    const submitBtn = screen.getByRole('button', { name: /generate seat grid/i });
    await user.click(submitBtn);

    expect(
      screen.getByText(/exceeds 50 seats total/i),
    ).toBeInTheDocument();
  });

  it('submits multi-section layout via bulkCreateSeats then updates coordinates via updateSeatLayout', async () => {
    const mockCreatedSeats = [
      {
        id: 's-1',
        screenId: 'sc-1',
        rowLabel: 'A',
        seatNumber: 1,
        label: 'A1',
        x: 0,
        y: 0,
        rotation: 0,
        type: 'PREMIUM' as const,
        isActive: true,
      },
    ];

    const mockUpdatedSeats = [
      {
        id: 's-1',
        screenId: 'sc-1',
        rowLabel: 'A',
        seatNumber: 1,
        label: 'A1',
        x: 0.05,
        y: 0.1,
        rotation: 0,
        type: 'PREMIUM' as const,
        isActive: true,
      },
    ];

    vi.spyOn(seatsApi, 'bulkCreateSeats').mockResolvedValue(mockCreatedSeats);
    vi.spyOn(seatsApi, 'updateSeatLayout').mockResolvedValue(mockUpdatedSeats);
    const onSetupSuccess = vi.fn();

    const user = userEvent.setup();
    renderComponent(onSetupSuccess);

    const submitBtn = screen.getByRole('button', { name: /generate seat grid/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(seatsApi.bulkCreateSeats).toHaveBeenCalledWith('sc-1', {
        rows: expect.arrayContaining([
          expect.objectContaining({ rowLabel: 'A', type: 'PREMIUM' }),
        ]),
      });
      expect(seatsApi.updateSeatLayout).toHaveBeenCalledWith('sc-1', {
        seats: expect.arrayContaining([
          expect.objectContaining({ seatId: 's-1' }),
        ]),
      });
      expect(onSetupSuccess).toHaveBeenCalledWith(mockUpdatedSeats);
    });
  });

  it('contains all 5 exact uppercase backend enum values in seat type dropdowns', () => {
    renderComponent();
    const dropdowns = screen.getAllByRole('combobox');
    expect(dropdowns.length).toBeGreaterThan(0);

    // Filter to the seat tier comboboxes (not the aisle width comboboxes)
    const tierDropdown = dropdowns.find((d) =>
      Array.from(d.querySelectorAll('option')).some((o) => o.value === 'REGULAR'),
    );
    expect(tierDropdown).toBeDefined();

    const options = Array.from(tierDropdown!.querySelectorAll('option')).map((o) => ({
      value: o.value,
      text: o.textContent,
    }));

    expect(options).toEqual([
      { value: 'REGULAR', text: 'Regular' },
      { value: 'PREMIUM', text: 'Premium' },
      { value: 'RECLINER', text: 'Recliner' },
      { value: 'WHEELCHAIR', text: 'Wheelchair' },
      { value: 'SOFA', text: 'Sofa' },
    ]);
  });
});
