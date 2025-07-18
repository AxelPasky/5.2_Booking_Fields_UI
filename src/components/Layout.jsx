import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next'; // Importa
import './Layout.css';

function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { t } = useTranslation(); // Inizializza

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
            <img src="/logo.svg" alt="Booking Fields Logo" className="header-logo" />
            <h1>Booking Fields</h1>
          </Link>
          <nav>
            {user ? (
              <>
                <div className="nav-links">
                  <Link to="/fields">{t('fields')}</Link>
                  <Link to="/bookings">{t('myBookings')}</Link>
                </div>
                <div className="user-actions">
                  <span className="welcome-user">{t('welcome', { name: user.name })}</span>
                  <button onClick={logout} className="logout-button">{t('logout')}</button>
                </div>
              </>
            ) : (
              // Questo blocco non verrà mai mostrato qui, ma lo lasciamo per coerenza
              <div className="nav-links">
                <Link to="/login">{t('login')}</Link>
                <Link to="/register">{t('register')}</Link>
              </div>
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
          <p>{t('copyright')}</p>
        </footer>
      )}
    </div>
  );
}

export default Layout;