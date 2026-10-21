import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { SettingsProvider } from '@/app/settings';
import { FocusProvider } from '@/app/focus';
import { router } from '@/app/router';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <FocusProvider>
        <RouterProvider router={router} />
      </FocusProvider>
    </SettingsProvider>
  </StrictMode>
);
