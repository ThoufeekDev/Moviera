// features/auth/components/SocialLoginButtons.tsx
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useAuthStore } from "../store/auth.store";
export default function SocialLoginButtons() {
  const googleLogin = useAuthStore((state) => state.googleLogin)

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
    <div className="social-grid">


      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          console.log('Google Login Failed');
        }}
      />

    </div>
  );
}
