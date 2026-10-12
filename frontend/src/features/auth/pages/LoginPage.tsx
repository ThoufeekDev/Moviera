import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <LoginForm
      role="USER"
      title="Welcome Back"
      description="Login to access your movie tickets & account"
      redirectTo="/"
      placeholderEmail="you@example.com"
      showSocialLogin
      showRememberMe
      registerLink={{
        prompt: "Don't have an account?",
        label: "Sign Up",
        to: "/register/user",
      }}
    />
  );
}
