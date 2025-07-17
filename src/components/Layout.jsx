import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom'; // Importa useLocation
import { useAuth } from '../context/AuthContext';
import './Layout.css';

function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation(); // Ottieni la posizione corrente
  const isHomePage = location.pathname === '/'; // Controlla se siamo sulla homepage

  return (
    <div className="app-container">
      {/* AGGIUNTA: Video di sfondo */}
      <video autoPlay loop muted className="background-video">
        {/* Assicurati che il video sia in public/background-video.mp4 */}
        <source src="/background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Mostra l'header solo se NON siamo sulla homepage */}
      {!isHomePage && (
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
      )}

      {/* Il main ora non ha bisogno di padding se è la homepage */}
      <main className={isHomePage ? 'app-main-full' : 'app-main'}>
        <Outlet />
      </main>

      {/* Mostra il footer solo se NON siamo sulla homepage */}
      {!isHomePage && (
        <footer className="app-footer">
          <p>&copy; 2025 Booking Fields. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
}

export default Layout;