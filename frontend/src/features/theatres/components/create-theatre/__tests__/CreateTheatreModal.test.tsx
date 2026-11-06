import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CreateTheatreModal } from '../CreateTheatreModal';
import * as createTheatreApiModule from '../../../api/createTheatre.api';
import * as getCitiesApi from '../../../api/getCities.api';
import * as facilitiesApi from '../../../api/facilities.api';
import { ApiError } from '@/shared/lib/ApiError';

describe('CreateTheatreModal Error Handling (Pilot Form)', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();

    vi.spyOn(getCitiesApi, 'getCities').mockResolvedValue([
      { id: 'city-1', name: 'Kochi', state: 'Kerala' },
    ]);
    vi.spyOn(facilitiesApi, 'getActiveFacilities').mockResolvedValue([]);
  });

  const renderModal = (onClose = vi.fn()) =>
    render(
      <QueryClientProvider client={queryClient}>
        <CreateTheatreModal isOpen={true} onClose={onClose} />
      </QueryClientProvider>,
    );

  const fillValidForm = async (user: ReturnType<typeof userEvent.setup>, name: string) => {
    await user.type(screen.getByLabelText(/theatre name/i), name);
    await user.type(screen.getByLabelText(/street address/i), 'Edapally Toll, Kochi');
    await user.type(screen.getByLabelText(/licence number/i), 'LIC-12345');
    await user.type(screen.getByLabelText(/contact email/i), 'contact@theatre.com');
    await user.type(screen.getByLabelText(/contact phone/i), '9876543210');

    // Switch to manual mode
    const manualTab = screen.getByRole('tab', { name: /enter address manually/i });
    await user.click(manualTab);

    // Switch to manual new city to satisfy client validation easily
    const registerNewCityRadio = screen.getByLabelText(/register new city/i);
    await user.click(registerNewCityRadio);

    await user.type(screen.getByLabelText(/city name \*/i), 'Kochi');
    await user.type(screen.getByLabelText(/state \*/i), 'Kerala');
    await user.type(screen.getByLabelText(/country \*/i), 'India');
  };

  it('displays server conflict error on licenseNumber field when returned via details.field', async () => {
    vi.spyOn(createTheatreApiModule, 'createTheatreApi').mockRejectedValue(
      new ApiError(
        'A theatre with this licence number already exists',
        409,
        {
          success: false,
          code: 'CONFLICT',
          message: 'A theatre with this licence number already exists',
          details: { field: 'licenseNumber' },
        },
        {
          isRecognizedBackendError: true,
          fieldErrors: {
            licenseNumber: 'A theatre with this licence number already exists',
          },
        },
      ),
    );

    const user = userEvent.setup();
    renderModal();

    await fillValidForm(user, 'PVR Lulu');

    const submitBtn = screen.getByRole('button', { name: /create theatre/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText('A theatre with this licence number already exists'),
      ).toBeInTheDocument();
    });

    // Should NOT show in error banner when mapped directly to the field
    expect(screen.queryByTestId('form-error-banner')).not.toBeInTheDocument();
  });

  it('displays 500 error in FormErrorBanner with safe fallback message only', async () => {
    vi.spyOn(createTheatreApiModule, 'createTheatreApi').mockRejectedValue(
      new ApiError(
        'Something went wrong. Please try again.',
        500,
        undefined,
        {
          code: 'INTERNAL_ERROR',
          isRecognizedBackendError: false,
          fieldErrors: {},
        },
      ),
    );

    const user = userEvent.setup();
    renderModal();

    await fillValidForm(user, 'Cinepolis');

    const submitBtn = screen.getByRole('button', { name: /create theatre/i });
    await user.click(submitBtn);

    await waitFor(() => {
      const banner = screen.getByTestId('form-error-banner');
      expect(banner).toBeInTheDocument();
      expect(banner).toHaveTextContent('Something went wrong. Please try again.');
    });
  });
});
