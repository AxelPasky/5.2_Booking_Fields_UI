import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './FieldsList.css';

// Torniamo a usare direttamente l'URL pubblico per ora
const API_URL = 'https://api-booking-fields.up.railway.app/api';

function FieldsList() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth(); // Usa il token dal context!

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
    return <div className="loading-message">Loading fields...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="fields-list-container">
      <h2>Available Fields</h2>
      <ul className="fields-grid">
        {fields.map((field) => (
          <li key={field.id} className="field-card">
            <img 
              src={field.image_url ? field.image_url : 'https://via.placeholder.com/400x250.png?text=Field+Image'} 
              alt={field.name} 
              className="field-image" 
            />
            <div className="field-info">
              <h3>{field.name}</h3>
              <p>{field.description}</p>
              <div className="field-details">
                <span>Type: {field.type}</span>
                <span className="price">€{(parseFloat(field.hourly_rate) || 0).toFixed(2)} / hour</span>
              </div>
              <div className="field-actions">
                <Link to={`/book/${field.id}`} className="book-now-button">
                  Book Now
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FieldsList;