import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '../LoginForm';
import { useAuthStore } from '../../stores/auth.store';
import { ApiError } from '@/shared/lib/ApiError';

describe('LoginForm Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLoginForm = () =>
    render(
      <MemoryRouter>
        <LoginForm
          title="Sign In"
          description="Access your account"
          redirectTo="/dashboard"
        />
      </MemoryRouter>,
    );

  it('renders backend message in the error banner on 401 Unauthorized', async () => {
    const mockLogin = vi.fn().mockRejectedValue(
      new ApiError('Invalid email or password.', 401, {
        success: false,
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password.',
      }),
    );
    useAuthStore.setState({ login: mockLogin, isLoading: false });

    const user = userEvent.setup();
    renderLoginForm();

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'wrongpassword123');

    const submitBtn = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password.');
    });
  });
});

