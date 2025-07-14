import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Layout.css';

function Layout() {
  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/" className="logo">
          <h1>Padel Booker</h1>
        </Link>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          {/* We will add a link to "My Bookings" and a "Logout" button later */}
        </nav>
      </header>
      <main className="app-main">
        <Outlet /> {/* This is where the content of each route will be rendered */}
      </main>
      <footer className="app-footer">
        <p>&copy; 2025 Padel Booker. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Layout;