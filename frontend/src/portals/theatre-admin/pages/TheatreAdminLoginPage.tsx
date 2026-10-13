import { LoginForm } from '@/features/auth';
import { Role } from '@/shared/constants/Role';

export default function TheatreAdminLoginPage() {
  return (
    <LoginForm
      role={Role.THEATRE_ADMIN}
      title="Theatre Partner Login"
      description="Manage your screens, schedules, and ticket operations"
      redirectTo="/theatre-admin"
      placeholderEmail="admin@cinema.com"
      showRememberMe
      registerLink={{
        prompt: "Need a cinema partner account?",
        label: "Register Here",
        to: "/theatre-admin/register",
      }}
    />
  );
}
