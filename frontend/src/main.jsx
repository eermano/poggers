import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Alimentos from './pages/Alimentos.jsx';
import Receitas from './pages/Receitas.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Navigate to="/alimentos" replace />,
      },
      {
        path: '/alimentos',
        element: <Alimentos />,
      },
      {
        path: '/receitas',
        element: <Receitas />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
