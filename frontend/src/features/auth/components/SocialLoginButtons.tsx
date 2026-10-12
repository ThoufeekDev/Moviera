import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuthStore } from '../stores/auth.store';

export default function SocialLoginButtons() {
  const googleLogin = useAuthStore((state) => state.googleLogin);

  const handleSuccess = async (response: CredentialResponse) => {
    try {
      if (!response.credential) {
        console.error('Google credential is missing');
        return;
      }

      await googleLogin(response.credential);
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  return (
    <div className="flex w-full justify-center my-3">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          console.error('Google Login Failed');
        }}
      />
    </div>
  );
}
