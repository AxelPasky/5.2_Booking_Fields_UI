import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import Notification from './Notification';
import ConfirmModal from './ConfirmModal'; 
import './Layout.css';

function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  const [notification, setNotification] = useState({ message: '', type: '' });
  const [confirmState, setConfirmState] = useState({ isOpen: false, message: '', onConfirm: () => {} });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const clearNotification = () => {
    setNotification({ message: '', type: '' });
  };

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

  const isFullScreenPage = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <div className="app-container">
      <video autoPlay loop muted className="background-video">
        <source src="/background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

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

      <Notification 
        message={notification.message} 
        type={notification.type}
        onClear={clearNotification}
      />
      
      <ConfirmModal 
        isOpen={confirmState.isOpen}
        message={confirmState.message}
        onConfirm={handleConfirm}
        onCancel={hideConfirmModal}
      />

  
      <main className={location.pathname === '/' ? 'app-main-full' : 'app-main'}>
        <Outlet context={{ showNotification, showConfirmModal }} />
      </main>
      
      {!isFullScreenPage && (
        <footer className="app-footer">
          <p>{t('copyright')}</p>
        </footer>
      )}
    </div>
  );
}

export default Layout;