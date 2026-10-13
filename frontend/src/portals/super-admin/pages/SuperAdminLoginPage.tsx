import { LoginForm } from '@/features/auth';
import { Role } from '@/shared/constants/Role';

export default function SuperAdminLoginPage() {
  return (
    <LoginForm
      role={Role.SUPER_ADMIN}
      title="Super Admin Portal"
      description="Login to access platform administration and master catalogs"
      redirectTo="/super-admin"
      placeholderEmail="admin@moviera.com"
      showRememberMe
    />
  );
}
