import React from 'react';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    // Add providers here like ThemeProvider, QueryClientProvider, AuthProvider
    <>{children}</>
  );
}
