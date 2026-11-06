import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CreateScreenModal from '../CreateScreenModal';
import * as screensApi from '../../../api/screens.api';
import { ApiError } from '@/shared/lib/ApiError';

describe('CreateScreenModal Error Handling (Pilot Form)', () => {
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
        <CreateScreenModal isOpen={true} onClose={onClose} theatreId="theatre-1" />
      </QueryClientProvider>,
    );

  it('displays server field error next to the name field on conflict (409)', async () => {
    vi.spyOn(screensApi, 'createScreen').mockRejectedValue(
      new ApiError(
        'Screen with this name already exists in this theatre',
        409,
        {
          success: false,
          code: 'CONFLICT',
          message: 'Screen with this name already exists in this theatre',
          details: { field: 'name' },
        },
        {
          isRecognizedBackendError: true,
          fieldErrors: {
            name: 'Screen with this name already exists in this theatre',
          },
        },
      ),
    );

    const user = userEvent.setup();
    renderModal();

    const input = screen.getByLabelText(/screen name/i);
    await user.type(input, 'Audi 1');

    const submitBtn = screen.getByRole('button', { name: /create screen/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText('Screen with this name already exists in this theatre'),
      ).toBeInTheDocument();
    });

    // Should NOT show in error banner when mapped directly to the field
    expect(screen.queryByTestId('form-error-banner')).not.toBeInTheDocument();
  });

  it('displays general message in FormErrorBanner for 403 Forbidden without setting field errors', async () => {
    vi.spyOn(screensApi, 'createScreen').mockRejectedValue(
      new ApiError(
        'You are not assigned to manage this theatre',
        403,
        {
          success: false,
          code: 'FORBIDDEN',
          message: 'You are not assigned to manage this theatre',
        },
        {
          isRecognizedBackendError: true,
          fieldErrors: {},
        },
      ),
    );

    const user = userEvent.setup();
    renderModal();

    const input = screen.getByLabelText(/screen name/i);
    await user.type(input, 'Audi 2');

    const submitBtn = screen.getByRole('button', { name: /create screen/i });
    await user.click(submitBtn);

    await waitFor(() => {
      const banner = screen.getByRole('alert');
      expect(banner).toBeInTheDocument();
      expect(banner).toHaveTextContent('You are not assigned to manage this theatre');
    });
  });

  it('displays safe generic fallback message for 500 error in FormErrorBanner', async () => {
    vi.spyOn(screensApi, 'createScreen').mockRejectedValue(
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

    const input = screen.getByLabelText(/screen name/i);
    await user.type(input, 'Audi 3');

    const submitBtn = screen.getByRole('button', { name: /create screen/i });
    await user.click(submitBtn);

    await waitFor(() => {
      const banner = screen.getByRole('alert');
      expect(banner).toHaveTextContent('Something went wrong. Please try again.');
    });
  });
});
