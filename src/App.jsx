import { createBrowserRouter, RouterProvider } from 'react-router-dom'; //library- instant reload
import Layout from './components/Layout';
import './App.css';


import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyBookingsPage from './pages/MyBookingsPage';
import FieldsPage from './pages/FieldsPage';

const router = createBrowserRouter([ //creating "Map" of routes.
  {
    path: "/", //parent route
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "fields", element: <FieldsPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "bookings", element: <MyBookingsPage /> },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
