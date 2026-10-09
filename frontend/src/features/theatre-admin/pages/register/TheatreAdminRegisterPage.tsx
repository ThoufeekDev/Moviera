import { ComingSoon } from '@/shared/ui/ComingSoon';

export default function TheatreAdminRegisterPage() {
  return (
    <ComingSoon
      title="Theatre Partner Registration"
      description="Cinema partner registration is coming soon. Please contact support or login if you already have an account."
      backTo="/theatre-admin/login"
      backLabel="Back to Admin Login"
    />
  );
}
