import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from './shared/components/ErrorBoundary/ErrorBoundary';
import queryClient from './shared/lib/queryClient';
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from './App';
import './styles/globals.css';



// const qeuryClient = new QueryClient()


const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
// const clientId = env.googleClientId;
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
           <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
      </ErrorBoundary>
 
    </QueryClientProvider>

  </StrictMode>,
);
