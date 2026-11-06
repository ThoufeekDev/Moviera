import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ScreenCard from '../ScreenCard';
import type { ScreenListItem } from '../../../types/screen.types';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ScreenCard', () => {
  const configuredScreen: ScreenListItem = {
    id: 'sc-1',
    theatreId: 'th-1',
    name: 'Audi 1 - IMAX',
    slug: 'audi-1-imax',
    isActive: true,
    totalSeats: 120,
    totalRows: 10,
    totalShows: 4,
    seatConfigurationStatus: 'CONFIGURED',
  };

  const unconfiguredScreen: ScreenListItem = {
    id: 'sc-2',
    theatreId: 'th-1',
    name: 'Audi 2',
    slug: 'audi-2',
    isActive: false,
    totalSeats: 0,
    totalRows: 0,
    totalShows: 0,
    seatConfigurationStatus: 'NOT_CONFIGURED',
  };

  it('renders screen details, statistics, and configured status badge', () => {
    render(
      <MemoryRouter>
        <ScreenCard screen={configuredScreen} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Audi 1 - IMAX')).toBeInTheDocument();
    expect(screen.getByText('ID: audi-1-imax')).toBeInTheDocument();
    expect(screen.getByText('Layout Configured')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('renders unconfigured badge when seat configuration is pending', () => {
    render(
      <MemoryRouter>
        <ScreenCard screen={unconfiguredScreen} />
      </MemoryRouter>,
    );

    expect(screen.getByText('No Seats Configured')).toBeInTheDocument();
  });

  it('navigates to the seat management page when "Manage Seats" is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ScreenCard screen={configuredScreen} />
      </MemoryRouter>,
    );

    const btn = screen.getByRole('button', { name: /manage seats for audi 1 - imax/i });
    await user.click(btn);

    expect(mockNavigate).toHaveBeenCalledWith('/theatre-admin/theatres/th-1/screens/sc-1/seats');
  });
});

