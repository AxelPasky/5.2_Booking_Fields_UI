import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Importa l'hook
import './HomePage.css';

function HomePage() {
  const { t } = useTranslation(); // Inizializza l'hook

  return (
    <div className="landing-container">
      <div className="landing-content">
        <img src="/logo.svg" alt="Booking Fields Logo" className="landing-logo" />
        {/* Usa la funzione t() per ottenere le traduzioni */}
        <h1 className="landing-title">{t('landingTitle')}</h1>
        <p className="landing-subtitle">
          {t('landingSubtitle')}
        </p>
        <div className="landing-actions">
          <Link to="/login" className="btn btn-primary">{t('login')}</Link>
          <Link to="/register" className="btn btn-secondary">{t('registerNow')}</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;