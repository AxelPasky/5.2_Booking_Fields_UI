import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './FieldsList.css';

const API_URL = 'https://api-booking-fields.up.railway.app/api';

function FieldList() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth(); // Usa il token dal context!

  useEffect(() => {
    if (!token) {
      setError('You must be logged in to view the fields.');
      setLoading(false);
      return;
    }

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

    fetchFields();
  }, [token]); // Riesegui l'effetto se il token cambia

  if (loading) {
    return <div className="loading-message">Loading fields...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="field-list-container">
      <h2>Our Padel Fields</h2>
      <div className="fields-grid">
        {fields.map((field) => (
          <div key={field.id} className="field-card">
            <h3>{field.name}</h3>
            <p className="field-type">{field.type}</p>
            <p className="field-description">{field.description}</p>
            <div className="field-price">€{field.price_per_hour} / hour</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FieldList;