import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AxiosError, AxiosHeaders } from 'axios';
import ScreenSeatManagementPage from '../ScreenSeatManagementPage';
import { useSeatEditorStore } from '../../stores/useSeatEditorStore';
import { computeLayoutMetadata, SEAT_PITCH_X, SEAT_PITCH_Y } from '../../utils/sectionLayoutGenerator';
import { BLOCK_ORIGIN, WORLD_HEIGHT, WORLD_WIDTH } from '../../utils/seatMetrics';
import type { BulkCreateSeatsPayload, Seat, UpdateSeatLayoutPayload } from '../../types/seat.types';
import * as seatsApi from '../../api/seats.api';
import * as screensApi from '../../api/screens.api';
import * as theatreOverviewApi from '../../api/getTheatreOverview.api';

describe('ScreenSeatManagementPage Integration', () => {
  let queryClient: QueryClient;

  const mockOverview = {
    theatre: {
      id: 'th-1',
      name: 'Grand Cineplex',
      city: 'Metropolis',
      status: 'ACTIVE' as const,
      totalScreens: 2,
    },
    screens: [],
    shows: [],
    analytics: { totalBookings: 0, totalRevenuePaise: 0 },
  };

  const mockScreens = {
    items: [
      {
        id: 'sc-1',
        theatreId: 'th-1',
        name: 'Screen 1 IMAX',
        slug: 'screen-1-imax',
        isActive: true,
        totalSeats: 2,
        totalRows: 1,
        totalShows: 3,
        seatConfigurationStatus: 'CONFIGURED' as const,
      },
    ],
    pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
  };

  const mockSeats = [
    {
      id: 's-1',
      screenId: 'sc-1',
      rowLabel: 'A',
      seatNumber: 1,
      label: 'A1',
      x: 0.2,
      y: 0.3,
      rotation: 0,
      type: 'REGULAR' as const,
      isActive: true,
    },
    {
      id: 's-2',
      screenId: 'sc-1',
      rowLabel: 'A',
      seatNumber: 2,
      label: 'A2',
      x: 0.4,
      y: 0.3,
      rotation: 0,
      type: 'PREMIUM' as const,
      isActive: true,
    },
  ];

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();

    vi.spyOn(theatreOverviewApi, 'getOverview').mockResolvedValue(
      mockOverview as unknown as Awaited<ReturnType<typeof theatreOverviewApi.getOverview>>,
    );
    vi.spyOn(screensApi, 'getScreens').mockResolvedValue(
      mockScreens as unknown as Awaited<ReturnType<typeof screensApi.getScreens>>,
    );
  });

  const renderPage = (initialUrl = '/theatre-admin/theatres/th-1/screens/sc-1/seats') =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialUrl]}>
          <Routes>
            <Route
              path="/theatre-admin/theatres/:theatreId/screens/:screenId/seats"
              element={<ScreenSeatManagementPage />}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

  it('renders setup mode when screen has no seats configured', async () => {
    vi.spyOn(seatsApi, 'getScreenSeatLayout').mockResolvedValue([]);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Configure Seating Layout')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /generate seat grid/i })).toBeInTheDocument();
    });
  });

  it('renders editor mode and toolbar when seats exist', async () => {
    vi.spyOn(seatsApi, 'getScreenSeatLayout').mockResolvedValue(mockSeats);

    renderPage();

    await waitFor(() => {
      expect(
        screen.getByText(/Screen 1 IMAX — Seating Layout Editor/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/2 Total Seats/i)).toBeInTheDocument();
    });
  });

  it('switches to table view and displays accessible list of seats', async () => {
    vi.spyOn(seatsApi, 'getScreenSeatLayout').mockResolvedValue(mockSeats);

    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /table list/i })).toBeInTheDocument();
    });

    const tableModeBtn = screen.getByRole('button', { name: /table list/i });
    await user.click(tableModeBtn);

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('A1')).toBeInTheDocument();
      expect(screen.getByText('A2')).toBeInTheDocument();
    });
  });

  it('handles save layout errors with descriptive banner', async () => {
    vi.spyOn(seatsApi, 'getScreenSeatLayout').mockResolvedValue(mockSeats);

    const axiosError = new AxiosError('Conflict');
    axiosError.response = {
      status: 409,
      statusText: 'Conflict',
      headers: {},
      config: { headers: new AxiosHeaders() },
      data: {
        success: false,
        code: 'CONFLICT',
        message: 'Screen is inactive',
      },
    };
    vi.spyOn(seatsApi, 'updateSeatProperties').mockRejectedValue(axiosError);

    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /table list/i })).toBeInTheDocument();
    });

    // Switch to table view to modify property
    const tableModeBtn = screen.getByRole('button', { name: /table list/i });
    await user.click(tableModeBtn);

    // Toggle active status for A1
    const activeBtns = screen.getAllByRole('button', { name: /active/i });
    await user.click(activeBtns[0]);

    // Now save layout
    const saveBtn = screen.getByRole('button', { name: /save layout/i });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByText(/Screen is inactive/i)).toBeInTheDocument();
    });
  });

  describe('Setup -> Editor Multi-Section Preset Integration', () => {
    const setupBackendPipelineMocks = () => {
      let persistedSeats: Seat[] = [];

      vi.spyOn(seatsApi, 'getScreenSeatLayout').mockImplementation(async () => persistedSeats);

      vi.spyOn(seatsApi, 'bulkCreateSeats').mockImplementation(
        async (_screenId: string, payload: BulkCreateSeatsPayload) => {
          const created: Seat[] = [];
          payload.rows.forEach((row, rowIndex) => {
            const worldY = BLOCK_ORIGIN.y + rowIndex * SEAT_PITCH_Y;
            const ny = Math.round(Math.min(worldY / WORLD_HEIGHT, 1) * 10000) / 10000;
            for (let s = 1; s <= row.seatCount; s++) {
              const worldX = BLOCK_ORIGIN.x + (s - 1) * SEAT_PITCH_X;
              const nx = Math.round(Math.min(worldX / WORLD_WIDTH, 1) * 10000) / 10000;
              created.push({
                id: `seat-${row.rowLabel}-${s}`,
                screenId: 'sc-1',
                rowLabel: row.rowLabel,
                seatNumber: s,
                label: `${row.rowLabel}${s}`,
                x: nx,
                y: ny,
                rotation: 0,
                type: row.type,
                isActive: true,
              });
            }
          });
          persistedSeats = created;
          return created;
        },
      );

      vi.spyOn(seatsApi, 'updateSeatLayout').mockImplementation(
        async (_screenId: string, payload: UpdateSeatLayoutPayload) => {
          const updateMap = new Map(payload.seats.map((u) => [u.seatId, u]));
          persistedSeats = persistedSeats.map((seat) => {
            const u = updateMap.get(seat.id);
            return u ? { ...seat, x: u.x, y: u.y, rotation: u.rotation ?? seat.rotation } : seat;
          });
          return persistedSeats;
        },
      );
    };

    it('generates BookMyShow 4-Section (7-9-9-7) and opens editor with 622 seats, 4 sections, and cross-aisles after SB, F, L', async () => {
      setupBackendPipelineMocks();

      const user = userEvent.setup();
      renderPage();

      await waitFor(() => {
        expect(screen.getByText('BookMyShow 4-Section (7-9-9-7)')).toBeInTheDocument();
      });

      await user.click(screen.getByText('BookMyShow 4-Section (7-9-9-7)'));
      await user.click(screen.getByRole('button', { name: /generate seat grid/i }));

      await waitFor(() => {
        expect(screen.getByText(/Screen 1 IMAX — Seating Layout Editor/i)).toBeInTheDocument();
      });

      const editorSeats = useSeatEditorStore.getState().seats;
      expect(editorSeats).toHaveLength(622);

      const metadata = computeLayoutMetadata(editorSeats);
      expect(metadata.rows).toHaveLength(20);
      for (const row of metadata.rows) {
        expect(row.sections).toHaveLength(4);
      }
      expect(metadata.crossAisles.map((ca) => ca.afterRowLabel)).toEqual(['SB', 'F', 'L']);
      expect(metadata.tierBlocks.map((tb) => tb.type)).toEqual(['RECLINER', 'PREMIUM', 'REGULAR']);
    });

    it('generates BookMyShow Classic Triple (7-14-7) and opens editor with 160 seats, 3 sections, and cross-aisle after C', async () => {
      setupBackendPipelineMocks();

      const user = userEvent.setup();
      renderPage();

      await waitFor(() => {
        expect(screen.getByText('BookMyShow Classic Triple')).toBeInTheDocument();
      });

      await user.click(screen.getByText('BookMyShow Classic Triple'));
      await user.click(screen.getByRole('button', { name: /generate seat grid/i }));

      await waitFor(() => {
        expect(screen.getByText(/Screen 1 IMAX — Seating Layout Editor/i)).toBeInTheDocument();
      });

      const editorSeats = useSeatEditorStore.getState().seats;
      expect(editorSeats).toHaveLength(160);

      const metadata = computeLayoutMetadata(editorSeats);
      expect(metadata.rows).toHaveLength(6);
      for (const row of metadata.rows) {
        expect(row.sections).toHaveLength(3);
      }
      expect(metadata.crossAisles.map((ca) => ca.afterRowLabel)).toEqual(['C']);
      expect(metadata.tierBlocks.map((tb) => tb.type)).toEqual(['PREMIUM', 'REGULAR']);
    });

    it('generates VIP Club Lounge (4-8-4) and opens editor with 48 seats, 3 sections, and cross-aisle after B', async () => {
      setupBackendPipelineMocks();

      const user = userEvent.setup();
      renderPage();

      await waitFor(() => {
        expect(screen.getByText('VIP Club Lounge')).toBeInTheDocument();
      });

      await user.click(screen.getByText('VIP Club Lounge'));
      await user.click(screen.getByRole('button', { name: /generate seat grid/i }));

      await waitFor(() => {
        expect(screen.getByText(/Screen 1 IMAX — Seating Layout Editor/i)).toBeInTheDocument();
      });

      const editorSeats = useSeatEditorStore.getState().seats;
      expect(editorSeats).toHaveLength(48);

      const metadata = computeLayoutMetadata(editorSeats);
      expect(metadata.rows).toHaveLength(3);
      for (const row of metadata.rows) {
        expect(row.sections).toHaveLength(3);
      }
      expect(metadata.crossAisles.map((ca) => ca.afterRowLabel)).toEqual(['B']);
      expect(metadata.tierBlocks.map((tb) => tb.type)).toEqual(['RECLINER', 'SOFA']);
    });
  });
});
