import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/" className="logo">
          <h1>Booking Fields</h1>
        </Link>
        <nav>
          {user ? (
            <>
              <span className="welcome-user">Welcome, {user.name}!</span>
              <Link to="/fields">Fields</Link>
              <Link to="/bookings">My Bookings</Link>
              <button onClick={logout} className="logout-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>&copy; 2025 Booking Fields. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Layout;