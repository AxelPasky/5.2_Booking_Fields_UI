// filepath: 5.2_Booking_Fields_UI/src/pages/MyBookingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './MyBookingsPage.css';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-booking-fields.up.railway.app/api';

function MyBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
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

        fetchBookings();
    }, [token]);

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
                <p>You have no bookings yet.</p>
            ) : (
                <ul className="bookings-list">
                    {bookings.map((booking) => (
                        <li key={booking.id} className="booking-card">
                            <h3>{booking.field.name}</h3>
                            <p><strong>Date:</strong> {new Date(booking.start_time).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {new Date(booking.start_time).toLocaleTimeString()} - {new Date(booking.end_time).toLocaleTimeString()}</p>
                            <p><strong>Price:</strong> €{booking.total_price}</p>
                            <p><strong>Status:</strong> <span className={`status status-${booking.status}`}>{booking.status}</span></p>
                            <button className="cancel-button">Cancel Booking</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MyBookingsPage;