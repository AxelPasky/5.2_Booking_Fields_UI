import React from 'react';
import { motion } from 'framer-motion';
import './BookingCard.css';

const BookingCard = ({ booking, onCancel }) => {
    const formattedDate = new Date(booking.date).toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div className="booking-card" variants={cardVariants}>
            <div className="booking-card-header">
                <h3>{booking.fieldName}</h3>
            </div>
            <div className="booking-card-body">
                <p><strong>Data:</strong> {formattedDate}</p>
                <p><strong>Orario:</strong> {booking.startTime} - {booking.endTime}</p>
                <p><strong>Prezzo:</strong> €{parseFloat(booking.price).toFixed(2)}</p>
                <p><strong>Stato:</strong> <span className={`status-badge status-${booking.status.toLowerCase()}`}>{booking.status}</span></p>
            </div>
            <div className="booking-card-footer">
                <button 
                    onClick={() => onCancel(booking.id)} 
                    className="cancel-button"
                >
                    Annulla Prenotazione
                </button>
            </div>
        </motion.div>
    );
};

export default BookingCard;