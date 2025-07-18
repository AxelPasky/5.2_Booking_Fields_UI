import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './FieldsList.css';

// MODIFICA: Usa la variabile d'ambiente per l'URL dell'API
const API_URL = import.meta.env.VITE_API_URL;

function FieldsList() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth(); // Usa il token dal context!
  const { t } = useTranslation();

  useEffect(() => {
    // Questo controllo non è più necessario!
    // ProtectedRoute si assicura che questo componente venga renderizzato
    // solo se l'utente è loggato e il token esiste.
    /* 
    if (!token) {
      setError('You must be logged in to view the fields.');
      setLoading(false);
      return;
    }
    */

    const fetchFields = async () => {
      try {
        const response = await fetch(`${API_URL}/fields`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch. Status: ${response.status}`);
        }
        const data = await response.json();
        setFields(data.data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    // Eseguiamo il fetch solo se il token è presente.
    // Anche se ridondante grazie a ProtectedRoute, è una buona pratica.
    if (token) {
        fetchFields();
    }
  }, [token]); // Riesegui l'effetto se il token cambia

  if (loading) {
    return <div className="loading-message">{t('loadingFields')}</div>;
  }

  if (error) {
    return <div className="error-message">{t('error', { message: error })}</div>;
  }

  return (
    <div className="fields-list-container">
      <h2>{t('availableFields')}</h2>
      <ul className="fields-grid">
        {fields.map((field) => (
          <li key={field.id} className="field-card">
            <div className="field-card" key={field.id}>
              <img
                src={`/Images/${field.name.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                alt={field.name}
                className="field-image"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x200'; }}
              />
              <div className="field-info">
                <h3>{field.name}</h3>
                <div className="field-details">
                  <span>{field.type}</span>
                  {/* MODIFICA: Usa 'price_per_hour' */}
                  <span className="price">€{parseFloat(field.price_per_hour).toFixed(2)} {t('perHour')}</span>
                </div>
                <p>{field.description}</p>
                <div className="field-actions">
                  {token && (
                    <Link to={`/book/${field.id}`} className="book-now-button">
                      {t('bookNow')}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FieldsList;