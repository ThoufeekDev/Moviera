import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './app';
import './styles/globals.css';



const qeuryClient = new QueryClient()

import { GoogleOAuthProvider } from "@react-oauth/google";
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    
    <QueryClientProvider client={qeuryClient}>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
    </QueryClientProvider>

  </StrictMode>,
);
