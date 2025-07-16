import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './CreateBookingPage.css'; 

// Usiamo l'API pubblica per ora
const API_URL = 'https://api-booking-fields.up.railway.app/api';

function CreateBookingPage() {
    const { fieldId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [field, setField] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [availability, setAvailability] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);

    const [loading, setLoading] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(false); // Aggiunto per gli slot
    const [error, setError] = useState('');

    // ++ AGGIUNTA FUNZIONE MANCANTE ++
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    // 1. Recupera i dettagli del campo (invariato)
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

    // 2. Recupera la disponibilità quando la data cambia
    useEffect(() => {
        if (!selectedDate) {
            setAvailability([]);
            return;
        }

        const fetchAvailability = async () => {
            setLoadingSlots(true);
            setError('');
            setAvailability([]);
            setSelectedSlot(null);

            try {
                // RIPRISTINO: Torniamo a usare GET con un parametro query nell'URL
                const response = await fetch(`${API_URL}/fields/${fieldId}/availability?date=${selectedDate}`, {
                    method: 'GET', // <-- Riportato a GET
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                    // Nessun body per la richiesta GET
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || 'Failed to fetch availability.');
                }
                const data = await response.json();
                setAvailability(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingSlots(false);
            }
        };

        fetchAvailability();
    }, [selectedDate, fieldId, token]);

    // MODIFICATA: Gestisce la selezione di uno slot (stringa) e calcola l'ora di fine
    const handleSlotSelection = (startTimeString) => {
        const startTime = new Date(startTimeString.replace(' ', 'T'));
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Aggiunge 1 ora

        // Formatta le date nel formato 'YYYY-MM-DD HH:MM:SS' richiesto dall'API per l'invio
        const formatForApi = (date) => {
            // Per evitare problemi di fuso orario, ricostruiamo la stringa manualmente
            const pad = (num) => num.toString().padStart(2, '0');
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        };

        const newSelectedSlot = {
            // MODIFICA: Usiamo la stringa originale per il confronto nella UI
            // e le stringhe formattate per l'invio all'API.
            key: startTimeString, // <-- Usato per l'evidenziazione
            start_time: startTimeString, // <-- Inviato all'API
            end_time: formatForApi(endTime), // <-- Inviato all'API
        };

        setSelectedSlot(newSelectedSlot);
        
        // Calcola il prezzo
        const durationHours = 1; // Durata fissa di 1 ora
        setTotalPrice(durationHours * (parseFloat(field.hourly_rate) || 0));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSlot) {
            alert('Please select a time slot.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    field_id: fieldId,
                    start_time: selectedSlot.start_time,
                    end_time: selectedSlot.end_time,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                // Gestisce errori di validazione specifici
                if (response.status === 422) {
                    const errorMessages = Object.values(errorData.errors).flat().join('\n');
                    throw new Error(errorMessages);
                }
                throw new Error(errorData.message || 'Failed to create booking.');
            }

            alert('Booking created successfully!');
            navigate('/bookings'); // Reindirizza a "My Bookings"

        } catch (err) {
            setError(err.message);
            alert(`Error: ${err.message}`);
        }
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
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>

                    {selectedDate && (
                        <div className="form-group">
                            <label>2. Select an Available Time Slot</label>
                            {loadingSlots && <p>Loading slots...</p>}
                            <div className="slots-container">
                                {availability.length > 0 ? (
                                    availability
                                        // MODIFICATO: Filtra solo le stringhe valide
                                        .filter(slot => typeof slot === 'string' && slot.length > 0)
                                        .map((startTimeString) => {
                                            // Calcoliamo l'ora di fine per la visualizzazione
                                            const startTime = new Date(startTimeString.replace(' ', 'T'));
                                            const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +1 ora

                                            return (
                                                <button
                                                    type="button"
                                                    key={startTimeString}
                                                    // MODIFICA: Confronta con la chiave salvata
                                                    className={`slot-button ${selectedSlot?.key === startTimeString ? 'selected' : ''}`}
                                                    onClick={() => handleSlotSelection(startTimeString)}
                                                >
                                                    {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    -
                                                    {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </button>
                                            );
                                        })
                                ) : (
                                    !loadingSlots && <p>No available slots for this date.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {selectedSlot && (
                        <div className="price-summary">
                            Total Price: <strong>€{totalPrice.toFixed(2)}</strong>
                        </div>
                    )}

                    <button type="submit" className="submit-booking-button" disabled={!selectedSlot}>
                        Confirm Booking
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateBookingPage;