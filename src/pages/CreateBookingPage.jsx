import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './CreateBookingPage.css'; // Per ora manteniamo lo stesso CSS

// Usiamo l'API pubblica per ora
const API_URL = 'https://api-booking-fields.up.railway.app/api';

function CreateBookingPage() { // <-- RINOMINATO QUI
    const { fieldId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [field, setField] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [availability, setAvailability] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 1. Recupera i dettagli del campo all'avvio
    useEffect(() => {
        const fetchFieldDetails = async () => {
            try {
                const response = await fetch(`${API_URL}/fields/${fieldId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch field details.');
                const data = await response.json();
                setField(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFieldDetails();
    }, [fieldId, token]);

    // Funzioni che implementeremo dopo
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        // Qui in futuro faremo la chiamata per l'availability
        console.log("Data selezionata:", e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Qui in futuro invieremo la prenotazione
        alert('Booking submission logic to be implemented!');
    };

    if (loading) return <div className="loading-message">Loading field information...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;
    if (!field) return <div className="error-message">Field not found.</div>;

    return (
        <div className="booking-page-container">
            <div className="booking-form-card">
                <h2>Book: {field.name}</h2>
                <p className="field-description">{field.description}</p>
                <p className="field-price">Rate: <strong>€{parseFloat(field.hourly_rate || 0).toFixed(2)} / hour</strong></p>
                
                <hr />

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="booking-date">1. Select a Date</label>
                        <input
                            type="date"
                            id="booking-date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            min={new Date().toISOString().split('T')[0]} // Imposta la data minima a oggi
                            required
                        />
                    </div>

                    {/* Qui mostreremo gli slot disponibili */}

                    <button type="submit" className="submit-booking-button" disabled={!selectedSlot}>
                        Confirm Booking
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateBookingPage; // <-- E QUI