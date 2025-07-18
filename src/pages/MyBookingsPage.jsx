import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Importa motion
import './MyBookingsPage.css';

const API_URL = 'https://api-booking-fields.up.railway.app/api';

function MyBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

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

    // La logica per cancellare una prenotazione rimane INVARIATA
    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Sei sicuro di voler cancellare questa prenotazione?')) {
            return;
        }
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
        } catch (e) {
            alert(`Error: ${e.message}`);
        }
    };

    // Definiamo le varianti per l'animazione
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
    };

    if (loading) return <div className="loading-message">Loading your bookings...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="my-bookings-page">
            <h1 className="page-title">Le Mie Prenotazioni</h1>
            {bookings.length === 0 ? (
                <div className="no-bookings-message">
                    <p>Non hai ancora nessuna prenotazione.</p>
                    <Link to="/fields" className="btn-primary">Sfoglia i Campi</Link>
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
                                    <h3>{booking.field ? booking.field.name : 'Campo non disponibile'}</h3>
                                </div>
                                <div className="booking-card-body">
                                    <p><strong>Data:</strong> {new Date(booking.start_time).toLocaleDateString('it-IT')}</p>
                                    <p><strong>Orario:</strong> {new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    <p><strong>Prezzo:</strong> €{parseFloat(booking.total_price).toFixed(2)}</p>
                                    <p><strong>Stato:</strong> <span className={`status-badge status-${booking.status}`}>{booking.status}</span></p>
                                </div>
                                {booking.status !== 'cancelled' && (
                                    <div className="booking-card-footer">
                                        <button
                                            className="cancel-button"
                                            onClick={() => handleCancelBooking(booking.id)}
                                        >
                                            Annulla
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