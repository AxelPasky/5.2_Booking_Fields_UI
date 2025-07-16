// filepath: 5.2_Booking_Fields_UI/src/pages/MyBookingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom'; // <-- IMPORTA LINK
import './MyBookingsPage.css';

// Torniamo a usare direttamente l'URL pubblico per ora
const API_URL = 'https://api-booking-fields.up.railway.app/api';

function MyBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    const fetchBookings = async () => {
        if (!token) {
            setLoading(false);
            setError("Authentication token not found.");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/bookings`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setBookings(data.data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [token]);

    const handleCancelBooking = async (bookingId) => {
        // Chiedi conferma prima di procedere
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
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
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to cancel booking');
            }

            // Rimuovi la prenotazione cancellata dallo stato per aggiornare la UI
            setBookings(currentBookings =>
                currentBookings.filter(booking => booking.id !== bookingId)
            );
            // In alternativa, si potrebbe ricaricare la lista con fetchBookings()
            
        } catch (e) {
            // Mostra un alert in caso di errore
            alert(`Error: ${e.message}`);
        }
    };

    if (loading) {
        return <div className="loading-message">Loading your bookings...</div>;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    return (
        <div className="bookings-container">
            <h2>My Bookings</h2>
            {bookings.length === 0 ? (
                <div className="no-bookings-message">
                    <p>You don't have any bookings yet.</p>
                    <p>Ready to play? Find a field and make your first booking!</p>
                    <Link to="/fields" className="btn-primary">Browse Fields</Link>
                </div>
            ) : (
                <ul className="bookings-list">
                    {bookings.map((booking) => (
                        <li key={booking.id} className="booking-card">
                            {/* AGGIUNTA: Controlla se booking.field esiste prima di usarlo */}
                            <h3>{booking.field ? booking.field.name : 'Field name not available'}</h3>
                            <p><strong>Date:</strong> {new Date(booking.start_time).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {new Date(booking.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(booking.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            <p><strong>Price:</strong> €{parseFloat(booking.total_price).toFixed(2)}</p>
                            <p><strong>Status:</strong> <span className={`status status-${booking.status}`}>{booking.status}</span></p>
                            {booking.status !== 'cancelled' && (
                                <button 
                                    className="cancel-button"
                                    onClick={() => handleCancelBooking(booking.id)}
                                >
                                    Cancel Booking
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MyBookingsPage;