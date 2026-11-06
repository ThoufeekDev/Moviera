import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TheatreAdminAssignModal } from '../TheatreAdminAssignModal';
import * as theatresApi from '../../../api/superAdminTheatres.api';
import { ApiError } from '@/shared/lib/ApiError';

describe('TheatreAdminAssignModal (React Hook Form + Zod + FormErrorBanner)', () => {
  let queryClient: QueryClient;

  const mockTheatres = [
    {
      id: 'th-1',
      name: 'Grand Cinema',
      city: 'Metropolis',
      status: 'ACTIVE' as const,
      totalScreens: 3,
    },
  ] as unknown as import('../types').TheatreItem[];

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
        <TheatreAdminAssignModal
          isOpen={true}
          onClose={onClose}
          theatres={mockTheatres}
          eligibleAdmins={[]}
          onAssignSuccess={vi.fn()}
        />
      </QueryClientProvider>,
    );

  it('renders field error from server when email is rejected by backend', async () => {
    vi.spyOn(theatresApi, 'assignTheatreAdminApi').mockRejectedValue(
      new ApiError(
        'A user with this email address already exists as an active theatre administrator',
        409,
        {
          success: false,
          code: 'CONFLICT',
          message: 'A user with this email address already exists as an active theatre administrator',
          details: { field: 'email' },
        },
      ),
    );

    const user = userEvent.setup();
    renderModal();

    const nameInput = screen.getByLabelText(/administrator full name/i);
    const emailInput = screen.getByLabelText(/email address/i);

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'existing@theatre.com');

    const submitBtn = screen.getByRole('button', { name: /create & dispatch access/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText('A user with this email address already exists as an active theatre administrator'),
      ).toBeInTheDocument();
    });
  });

  it('renders banner error on general server failure (500)', async () => {
    vi.spyOn(theatresApi, 'assignTheatreAdminApi').mockRejectedValue(
      new ApiError('Something went wrong. Please try again.', 500, {
        success: false,
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong. Please try again.',
      }),
    );

    const user = userEvent.setup();
    renderModal();

    const nameInput = screen.getByLabelText(/administrator full name/i);
    const emailInput = screen.getByLabelText(/email address/i);

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@theatre.com');

    const submitBtn = screen.getByRole('button', { name: /create & dispatch access/i });
    await user.click(submitBtn);

    await waitFor(() => {
      const banner = screen.getByTestId('form-error-banner');
      expect(banner).toBeInTheDocument();
      expect(banner).toHaveTextContent('Something went wrong. Please try again.');
    });
  });
});
