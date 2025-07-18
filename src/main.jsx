import React, { Suspense } from 'react'; // Importa Suspense
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FieldsPage from './pages/FieldsPage'; // AGGIUNTA: Importa FieldsPage
import MyBookingsPage from './pages/MyBookingsPage';
import EditBookingPage from './pages/EditBookingPage'; // Importa la nuova pagina
import ProtectedRoute from './components/ProtectedRoute';
import CreateBookingPage from './pages/CreateBookingPage.jsx';

import './index.css';
import './i18n'; // Importa la configurazione di i18next

// Definiamo il router qui
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App diventa il punto di ingresso per il layout e i context
    children: [
      { index: true, element: <HomePage /> },
      { 
        path: "fields", 
        element: (
          <ProtectedRoute>
            <FieldsPage />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "book/:fieldId",
        element: (
          <ProtectedRoute>
            <CreateBookingPage /> {/* <-- MODIFICATO */}
          </ProtectedRoute>
        ) 
      },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { 
        path: "bookings", 
        element: (
          <ProtectedRoute>
            <MyBookingsPage />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "bookings/edit/:bookingId", // Aggiungi la nuova rotta
        element: (
          <ProtectedRoute>
            <EditBookingPage />
          </ProtectedRoute>
        ) 
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Avvolgi il RouterProvider con Suspense per gestire il caricamento delle traduzioni */}
    <Suspense fallback="Loading...">
      <RouterProvider router={router} />
    </Suspense>
  </React.StrictMode>,
);
