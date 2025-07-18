import React, { Suspense } from 'react'; 
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FieldsPage from './pages/FieldsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import EditBookingPage from './pages/EditBookingPage';
import ProtectedRoute from './components/ProtectedRoute';
import CreateBookingPage from './pages/CreateBookingPage.jsx';

import './index.css';
import './i18n';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
            <CreateBookingPage /> 
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
        path: "bookings/edit/:bookingId", 
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
    <Suspense fallback="Loading...">
      <RouterProvider router={router} />
    </Suspense>
  </React.StrictMode>,
);
