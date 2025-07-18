import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom'; // Aggiungi useOutletContext
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next'; // Importa
import './MyBookingsPage.css';

const API_URL = 'https://api-booking-fields.up.railway.app/api';

function MyBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    const { t } = useTranslation();
    const { showNotification, showConfirmModal } = useOutletContext(); // Ottieni entrambe le funzioni

    // La logica per recuperare le prenotazioni rimane INVARIATA
    useEffect(() => {
        const fetchBookings = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(`${API_URL}/bookings`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch bookings.');
                }
                const data = await response.json();
                setBookings(data.data);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [token]);

    const handleCancelBooking = async (bookingId) => {
        // La logica di cancellazione effettiva
        const proceedCancellation = async () => {
            try {
                const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to cancel booking.');
                }
                setBookings(bookings.filter(b => b.id !== bookingId));
                showNotification(t('bookingCancelledSuccess'), 'success');
            } catch (e) {
                showNotification(t('cancelBookingError'), 'error');
            }
        };

        // MODIFICA: Usa la modale di conferma personalizzata
        showConfirmModal(
            t('cancelBookingConfirm'), // Messaggio
            proceedCancellation      // Funzione da eseguire alla conferma
        );
    };

    // Definiamo le varianti per l'animazione
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
    };

    if (loading) return <div className="loading-message">{t('loadingBookings')}</div>;
    if (error) return <div className="error-message">{t('error', { message: error })}</div>;

    return (
        <div className="my-bookings-page">
            <h1 className="page-title">{t('myBookings')}</h1>
            {bookings.length === 0 ? (
                <div className="no-bookings-message">
                    <p>{t('noBookings')}</p>
                    <Link to="/fields" className="btn-primary">{t('browseFields')}</Link>
                </div>
            ) : (
                <ul className="bookings-grid">
                    <AnimatePresence>
                        {bookings.map((booking) => (
                            <motion.li
                                key={booking.id}
                                className="booking-card"
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                layout
                            >
                                <div className="booking-card-header">
                                    <h3>{booking.field ? booking.field.name : t('fieldUnavailable')}</h3>
                                </div>
                                <div className="booking-card-body">
                                    <p><strong>{t('date')}:</strong> {new Date(booking.start_time).toLocaleDateString('it-IT')}</p>
                                    <p><strong>{t('time')}:</strong> {new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    <p><strong>{t('price')}:</strong> €{parseFloat(booking.total_price).toFixed(2)}</p>
                                    <p>
                                        <strong>{t('status')}:</strong> 
                                        <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                                            {/* CORREZIONE: Traduce lo stato ricevuto dall'API */}
                                            {t(`status.${booking.status.toLowerCase()}`, booking.status)}
                                        </span>
                                    </p>
                                </div>
                                {booking.status !== 'cancelled' && (
                                    <div className="booking-card-footer">
                                        <Link to={`/bookings/edit/${booking.id}`} className="edit-button">
                                            {t('edit')}
                                        </Link>
                                        <button
                                            className="cancel-button"
                                            onClick={() => handleCancelBooking(booking.id)}
                                        >
                                            {t('cancel')}
                                        </button>
                                    </div>
                                )}
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            )}
        </div>
    );
}

export default MyBookingsPage;