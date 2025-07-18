import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next'; 
import './CreateBookingPage.css'; 

// Usiamo l'API pubblica per ora
const API_URL = 'https://api-booking-fields.up.railway.app/api';

function CreateBookingPage() {
    const { fieldId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation(); 

    const [field, setField] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [availability, setAvailability] = useState([]);
    // MODIFICA: Lo stato ora gestisce un array di slot selezionati
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const [loading, setLoading] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [error, setError] = useState('');

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setSelectedSlots([]); // Resetta gli slot quando la data cambia
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
            // RIMUOVI QUESTA RIGA: Lo stato 'selectedSlot' non esiste più
            // setSelectedSlot(null); 

            try {
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

    // MODIFICATA: Logica per aggiungere/rimuovere slot dall'array
    const handleSlotSelection = (slotString) => {
        setSelectedSlots(prevSlots => {
            const isSelected = prevSlots.includes(slotString);
            if (isSelected) {
                // Deseleziona lo slot cliccato
                return prevSlots.filter(s => s !== slotString);
            } else {
                // Aggiunge il nuovo slot e mantiene l'ordine cronologico
                return [...prevSlots, slotString].sort();
            }
        });
    };

    // MODIFICATA: Calcola il prezzo totale in base al numero di slot
    useEffect(() => {
        if (selectedSlots.length > 0 && field?.price_per_hour) {
            const pricePerHour = parseFloat(field.price_per_hour);
            // Il backend genera slot ogni 30 minuti
            const pricePerSlot = pricePerHour / 2;
            setTotalPrice(selectedSlots.length * pricePerSlot);
        } else {
            setTotalPrice(0);
        }
    }, [selectedSlots, field]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedSlots.length === 0) {
            setError(t('selectSlotError'));
            return;
        }

        // Determina l'inizio del primo slot e la fine dell'ultimo
         const firstSlot = selectedSlots[0];
        const lastSlot = selectedSlots[selectedSlots.length - 1];
        
        // MODIFICA: Aggiungi 'Z' per trattare la data come UTC ed evitare problemi di fuso orario
        const lastSlotStartTime = new Date(lastSlot.replace(' ', 'T') + 'Z');
        // L'ora di fine della prenotazione è 30 minuti dopo l'inizio dell'ultimo slot
        const endTime = new Date(lastSlotStartTime.getTime() + 30 * 60 * 1000);

        const bookingDetails = {
            field_id: fieldId,
            start_time: firstSlot,
            // MODIFICA: Assicura che anche l'ora di fine sia formattata correttamente come UTC
            end_time: endTime.toISOString().slice(0, 19).replace('T', ' '),
        };

        try {
            const response = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    // AGGIUNTA: Assicura che Laravel risponda con JSON in caso di errore
                    'Accept': 'application/json', 
                },
                body: JSON.stringify(bookingDetails),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create booking.');
            }

            alert(t('bookingCreatedSuccess'));
            navigate('/bookings');

        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="loading-message">{t('loadingFieldInfo')}</div>;
    if (error) return <div className="error-message">{t('error', { message: error })}</div>;
    if (!field) return <div className="error-message">{t('fieldNotFound')}</div>;

    return (
        <div className="booking-page-container">
            <div className="booking-form-card">
                <h2>{t('bookField', { fieldName: field.name })}</h2>
                <p className="field-description">{field.description}</p>
                {/* MODIFICA: Usa 'price_per_hour' come fornito dall'API */}
                <p className="field-price">{t('rate')}: <strong>€{parseFloat(field.price_per_hour || 0).toFixed(2)} {t('perHour')}</strong></p>
                
                <hr />

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="booking-date">{t('selectDate')}</label>
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
                            <label>{t('selectTimeSlot')}</label>
                            {loadingSlots && <p>{t('loadingSlots')}</p>}
                            <div className="slots-container">
                                {availability.length > 0 ? (
                                    availability
                                        .filter(slot => typeof slot === 'string' && slot.length > 0)
                                        .map((startTimeString) => {
                                            const startTime = new Date(startTimeString.replace(' ', 'T'));
                                            const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // Slot di 30 min

                                            return (
                                                <button
                                                    type="button"
                                                    key={startTimeString}
                                                    // MODIFICA: Evidenzia se lo slot è nell'array
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

                    {/* MODIFICA: Mostra il prezzo solo se sono stati selezionati degli slot */}
                    {selectedSlots.length > 0 && (
                        <div className="price-summary">
                            {t('totalPrice')}: <strong>€{totalPrice.toFixed(2)}</strong>
                        </div>
                    )}

                    <button type="submit" className="submit-booking-button" disabled={selectedSlots.length === 0}>
                        {t('confirmBooking')}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateBookingPage;