import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.jsx';
import { AuthContextProvider } from './context/AuthContext.jsx';
import { UserProfileProvider } from './context/UserProfileContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <UserProfileProvider>
        <RouterProvider router={router} />
      </UserProfileProvider>
    </AuthContextProvider>
  </StrictMode>
);
