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
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [availability, setAvailability] = useState([]);
    // MODIFICA: selectedSlots ora è un array per la selezione multipla
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const [loading, setLoading] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(false);
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

    // MODIFICATA: Gestisce la selezione e deselezione di più slot
    const handleSlotSelection = (slotString) => {
        setSelectedSlots(prevSlots => {
            const isSelected = prevSlots.includes(slotString);
            if (isSelected) {
                return prevSlots.filter(s => s !== slotString);
            } else {
                return [...prevSlots, slotString].sort();
            }
        });
    };

    // AGGIUNTA: useEffect per calcolare il prezzo quando gli slot cambiano
    useEffect(() => {
        if (selectedSlots.length > 0 && field?.price_per_hour) {
            // Usa 'price_per_hour' direttamente dall'API
            const pricePerHour = parseFloat(field.price_per_hour);
            // Ogni slot dura 30 minuti (come definito in FieldController)
            const price = selectedSlots.length * (pricePerHour / 2);
            setTotalPrice(price);
        } else {
            setTotalPrice(0);
        }
    }, [selectedSlots, field]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedSlots.length === 0) {
            setError('Please select at least one time slot.');
            return;
        }

        // Trova l'orario di inizio e di fine del blocco contiguo
        const firstSlot = selectedSlots[0];
        const lastSlot = selectedSlots[selectedSlots.length - 1];
        
        const lastSlotStartTime = new Date(lastSlot.replace(' ', 'T'));
        // L'ora di fine è 30 minuti dopo l'inizio dell'ultimo slot
        const endTime = new Date(lastSlotStartTime.getTime() + 30 * 60 * 1000);

        const bookingDetails = {
            field_id: fieldId,
            start_time: firstSlot,
            end_time: endTime.toISOString().slice(0, 19).replace('T', ' '),
        };

        try {
            const response = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingDetails),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create booking.');
            }

            alert('Booking created successfully!');
            navigate('/my-bookings');

        } catch (err) {
            setError(err.message);
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
                                        .filter(slot => typeof slot === 'string' && slot.length > 0)
                                        .map((startTimeString) => {
                                            const startTime = new Date(startTimeString.replace(' ', 'T'));
                                            // Gli slot sono di 30 minuti
                                            const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); 

                                            return (
                                                <button
                                                    type="button"
                                                    key={startTimeString}
                                                    // MODIFICA: Controlla se lo slot è nell'array
                                                    className={`slot-button ${selectedSlots.includes(startTimeString) ? 'selected' : ''}`}
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

                    {/* MODIFICA: Mostra il prezzo solo se ci sono slot selezionati */}
                    {selectedSlots.length > 0 && (
                        <div className="price-summary">
                            Total Price: <strong>€{totalPrice.toFixed(2)}</strong>
                        </div>
                    )}

                    <button type="submit" className="submit-booking-button" disabled={selectedSlots.length === 0}>
                        Confirm Booking
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateBookingPage;