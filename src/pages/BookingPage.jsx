import React from 'react';
import { useParams } from 'react-router-dom';

function BookingPage() {
    // Usiamo useParams per ottenere l'ID del campo dall'URL (es. /book/1)
    const { fieldId } = useParams();

    return (
        <div>
            <h2>Book a Field</h2>
            <p>You are booking the field with ID: {fieldId}</p>
            {/* Qui inseriremo il form di prenotazione */}
        </div>
    );
}

export default BookingPage;