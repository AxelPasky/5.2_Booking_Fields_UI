import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Creeremo questo file per lo stile

function HomePage() {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <img src="/logo.svg" alt="Booking Fields Logo" className="landing-logo" />
        <h1 className="landing-title">Booking Fields</h1>
        <p className="landing-subtitle">
          Il modo più semplice per trovare e prenotare il campo sportivo perfetto per te.
        </p>
        <div className="landing-actions">
          <Link to="/login" className="btn btn-primary">Accedi</Link>
          <Link to="/register" className="btn btn-secondary">Registrati Ora</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;