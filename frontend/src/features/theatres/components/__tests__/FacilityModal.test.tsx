import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FacilityModal from '../FacilityModal';
import * as facilitiesApi from '../../api/facilities.api';
import { ApiError } from '@/shared/lib/ApiError';

describe('FacilityModal (React Hook Form + Zod + FormErrorBanner)', () => {
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

  const renderModal = (onClose = vi.fn()) =>
    render(
      <QueryClientProvider client={queryClient}>
        <FacilityModal isOpen={true} onClose={onClose} />
      </QueryClientProvider>,
    );

  it('renders field error when backend rejects duplicate facility name (409)', async () => {
    vi.spyOn(facilitiesApi, 'createFacility').mockRejectedValue(
      new ApiError(
        'A facility with this name already exists.',
        409,
        {
          success: false,
          code: 'CONFLICT',
          message: 'A facility with this name already exists.',
          details: { field: 'name' },
        },
      ),
    );

    const user = userEvent.setup();
    renderModal();

    const input = screen.getByLabelText(/facility name/i);
    await user.type(input, 'VIP Lounge');

    const submitBtn = screen.getByRole('button', { name: /create facility/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText('A facility with this name already exists.'),
      ).toBeInTheDocument();
    });
  });

  it('renders general error banner when backend returns an unmapped server error', async () => {
    vi.spyOn(facilitiesApi, 'createFacility').mockRejectedValue(
      new ApiError('Something went wrong. Please try again.', 500, {
        success: false,
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong. Please try again.',
      }),
    );

    const user = userEvent.setup();
    renderModal();

    const input = screen.getByLabelText(/facility name/i);
    await user.type(input, 'VIP Lounge');

    const submitBtn = screen.getByRole('button', { name: /create facility/i });
    await user.click(submitBtn);

    await waitFor(() => {
      const banner = screen.getByTestId('form-error-banner');
      expect(banner).toBeInTheDocument();
      expect(banner).toHaveTextContent('Something went wrong. Please try again.');
    });
  });
});
