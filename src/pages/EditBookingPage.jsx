import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'; // Aggiungi useOutletContext
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './CreateBookingPage.css'; // Riutilizziamo lo stesso stile

// MODIFICA: Usa la variabile d'ambiente per l'URL dell'API
const API_URL = import.meta.env.VITE_API_URL;

function EditBookingPage() {
    const { bookingId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { showNotification } = useOutletContext(); // Ottieni la funzione di notifica

    const [booking, setBooking] = useState(null);
    const [field, setField] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [availability, setAvailability] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [error, setError] = useState('');

    // CORREZIONE: Dividiamo il fetch in due passaggi.
    // 1. Prima otteniamo i dati della prenotazione (che include field_id).
    // 2. Poi usiamo field_id per ottenere i dettagli del campo.
    useEffect(() => {
        const fetchBookingAndFieldDetails = async () => {
            setLoading(true);
            try {
                // Step 1: Fetch della prenotazione
                const bookingResponse = await fetch(`${API_URL}/bookings/${bookingId}`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
                });
                if (!bookingResponse.ok) throw new Error('Failed to fetch booking details.');
                const bookingData = await bookingResponse.json();
                const currentBooking = bookingData.data;
                setBooking(currentBooking);

                const bookingDate = new Date(currentBooking.start_time).toISOString().split('T')[0];
                setSelectedDate(bookingDate);

                // Step 2: Fetch dei dettagli del campo usando il field_id dalla prenotazione
                if (currentBooking.field_id) {
                    const fieldResponse = await fetch(`${API_URL}/fields/${currentBooking.field_id}`, {
                         headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
                    });
                    if (!fieldResponse.ok) throw new Error('Failed to fetch field details.');
                    const fieldData = await fieldResponse.json();
                    setField(fieldData.data);
                } else {
                    throw new Error('Field ID not found in booking details.');
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchBookingAndFieldDetails();
        }
    }, [bookingId, token]);

    // 2. Fetch disponibilità quando la data o il campo cambiano
    useEffect(() => {
        if (!selectedDate || !field) return;

        const fetchAvailability = async () => {
            setLoadingSlots(true);
            setError('');
            try {
                const response = await fetch(`${API_URL}/fields/${field.id}/availability?date=${selectedDate}`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
                });
                if (!response.ok) throw new Error('Failed to fetch availability.');
                const data = await response.json();
                setAvailability(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingSlots(false);
            }
        };
        fetchAvailability();
    }, [selectedDate, field, token]);
    
    // 3. Calcola il prezzo
    useEffect(() => {
        if (selectedSlots.length > 0 && field?.price_per_hour) {
            const pricePerSlot = parseFloat(field.price_per_hour) / 2;
            setTotalPrice(selectedSlots.length * pricePerSlot);
        } else {
            setTotalPrice(0);
        }
    }, [selectedSlots, field]);

    // 4. Gestione selezione/deselezione slot
    const handleSlotSelection = (slotString) => {
        setSelectedSlots(prev => prev.includes(slotString) ? prev.filter(s => s !== slotString) : [...prev, slotString].sort());
    };

    // 5. Submit del form di modifica
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedSlots.length === 0) {
            setError(t('selectSlotError'));
            return;
        }

        const firstSlot = selectedSlots[0];
        const lastSlot = selectedSlots[selectedSlots.length - 1];
        const lastSlotStartTime = new Date(lastSlot.replace(' ', 'T') + 'Z');
        const endTime = new Date(lastSlotStartTime.getTime() + 30 * 60 * 1000);

        const bookingDetails = {
            start_time: firstSlot,
            end_time: endTime.toISOString().slice(0, 19).replace('T', ' '),
        };

        try {
            const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(bookingDetails),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(t('bookingUpdateFailed'));
            }

            // MODIFICA: Usa la notifica personalizzata
            showNotification(t('bookingUpdateSuccess'), 'success');
            navigate('/bookings');
        } catch (err) {
            // MODIFICA: Usa la notifica personalizzata per l'errore
            showNotification(err.message, 'error');
            setError(err.message); // Puoi ancora mantenere l'errore locale se serve
        }
    };

    // CORREZIONE: Semplifichiamo la logica di rendering.
    // Mostra il caricamento finché loading è true.
    if (loading) return <div className="loading-message">{t('loadingBookings')}</div>;
    
    // Se c'è un errore (e non stiamo più caricando), mostralo.
    if (error) return <div className="error-message">{t('error', { message: error })}</div>;
    
    // Se non stiamo caricando, non ci sono errori, ma il campo non è stato trovato (es. API ha risposto con null), mostralo.
    if (!field) return <div className="error-message">{t('fieldNotFound')}</div>;

    return (
        <div className="booking-page-container">
            <div className="booking-form-card">
                <h2>{t('editBookingFor', { fieldName: field.name })}</h2>
                <p className="field-price">{t('rate')}: <strong>€{parseFloat(field.price_per_hour || 0).toFixed(2)} {t('perHour')}</strong></p>
                <hr />
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="booking-date">{t('selectDate')}</label>
                        <input
                            type="date"
                            id="booking-date"
                            value={selectedDate}
                            onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlots([]); }}
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>
                    {selectedDate && (
                        <div className="form-group">
                            <label>{t('selectTimeSlot')}</label>
                            {loadingSlots && <p>{t('loadingSlots')}</p>}
                            <div className="slots-container">
                                {availability.length > 0 ? (
                                    availability.map((startTimeString) => {
                                        const startTime = new Date(startTimeString.replace(' ', 'T'));
                                        const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
                                        return (
                                            <button
                                                type="button"
                                                key={startTimeString}
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
                                    !loadingSlots && <p>{t('noSlotsAvailable')}</p>
                                )}
                            </div>
                        </div>
                    )}
                    {selectedSlots.length > 0 && (
                        <div className="price-summary">
                            {t('totalPrice')}: <strong>€{totalPrice.toFixed(2)}</strong>
                        </div>
                    )}
                    <button type="submit" className="submit-booking-button" disabled={selectedSlots.length === 0}>
                        {t('updateBooking')}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditBookingPage;
