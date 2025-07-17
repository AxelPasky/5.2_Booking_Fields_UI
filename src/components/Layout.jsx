import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // MODIFICA: Considera anche /login e /register come pagine a schermo intero
  const isFullScreenPage = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <div className="app-container">
      <video autoPlay loop muted className="background-video">
        <source src="/background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Mostra l'header solo se NON siamo su una pagina a schermo intero */}
      {!isFullScreenPage && (
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
              // Questo blocco non verrà mai mostrato qui, ma lo lasciamo per coerenza
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </nav>
        </header>
      )}

      {/* Usa la classe 'app-main' per avere padding o 'app-main-full' per la homepage */}
      <main className={location.pathname === '/' ? 'app-main-full' : 'app-main'}>
        <Outlet />
      </main>

      {/* Mostra il footer solo se NON siamo su una pagina a schermo intero */}
      {!isFullScreenPage && (
        <footer className="app-footer">
          <p>&copy; 2025 Booking Fields. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
}

export default Layout;