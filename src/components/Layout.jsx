import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import Notification from './Notification';
import ConfirmModal from './ConfirmModal'; // Importa la modale
import './Layout.css';

function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  const [notification, setNotification] = useState({ message: '', type: '' });
  // AGGIUNTA: Stato per la modale di conferma
  const [confirmState, setConfirmState] = useState({ isOpen: false, message: '', onConfirm: () => {} });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const clearNotification = () => {
    setNotification({ message: '', type: '' });
  };

  // AGGIUNTA: Funzioni per gestire la modale
  const showConfirmModal = (message, onConfirm) => {
    setConfirmState({ isOpen: true, message, onConfirm });
  };

  const hideConfirmModal = () => {
    setConfirmState({ isOpen: false, message: '', onConfirm: () => {} });
  };

  const handleConfirm = () => {
    confirmState.onConfirm();
    hideConfirmModal();
  };

  // MODIFICA: Considera anche /login e /register come pagine a schermo intero
  const isFullScreenPage = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <div className="app-container">
      <video autoPlay loop muted className="background-video">
        <source src="/background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* L'header rimane invariato */}
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
              <div className="nav-links">
                <Link to="/login">{t('login')}</Link>
                <Link to="/register">{t('register')}</Link>
              </div>
            )}
          </nav>
        </header>
      )}

      {/* Il componente Notification viene renderizzato qui */}
      <Notification 
        message={notification.message} 
        type={notification.type}
        onClear={clearNotification}
      />
      
      {/* AGGIUNTA: Render della modale */}
      <ConfirmModal 
        isOpen={confirmState.isOpen}
        message={confirmState.message}
        onConfirm={handleConfirm}
        onCancel={hideConfirmModal}
      />

      {/* Usa la classe 'app-main' per avere padding o 'app-main-full' per la homepage */}
      <main className={location.pathname === '/' ? 'app-main-full' : 'app-main'}>
        {/* L'Outlet ora riceve il context da Layout */}
        <Outlet context={{ showNotification, showConfirmModal }} />
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