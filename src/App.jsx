import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import './App.css';

// We'll create these page components in the next steps
const HomePage = () => <div className="page-content"><h2>Home Page</h2><p>List of fields will be here.</p></div>;
const LoginPage = () => <div className="page-content"><h2>Login Page</h2></div>;
const RegisterPage = () => <div className="page-content"><h2>Register Page</h2></div>;
const MyBookingsPage = () => <div className="page-content"><h2>My Bookings</h2></div>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
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
