import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import queryClient from '@/shared/lib/queryClient';
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from '@/app/App';
import '@fontsource-variable/roboto';
import './styles/globals.css';



import env from '@/shared/lib/env';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <GoogleOAuthProvider clientId={env.googleClientId}>
          <App />
        </GoogleOAuthProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
);
