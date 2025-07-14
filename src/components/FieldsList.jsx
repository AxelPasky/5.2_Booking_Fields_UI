import React, { useState, useEffect } from 'react';
import './FieldsList.css';

// We will get the token from our auth context later
const authToken = null; // Placeholder for now
const API_URL = 'https://api-booking-fields.up.railway.app/api';

function FieldsList() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFields = async () => {
      // If there's no token, we can't even try to fetch.
      if (!authToken) {
        setError('You must be logged in to view the fields.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/fields`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          // This will likely be a 401 error
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
  }, []);

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

export default FieldsList;