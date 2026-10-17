const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  turnstileSiteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined,
};

export default env;