import { StrictMode } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from 'react-dom/client'
import {
    RouterProvider,
  } from "react-router-dom";
import PersonalBrowserRouter from './Router'
import { AuthProvider } from './context/AuthProvider';
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={PersonalBrowserRouter} />
    </AuthProvider>
  </StrictMode>,
)
