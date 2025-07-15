import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { token, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // Mostra un messaggio di caricamento mentre verifichiamo l'autenticazione
        // per evitare sfarfallii o reindirizzamenti prematuri.
        return <div>Loading...</div>;
    }

    if (!token) {
        // Se non c'è il token, reindirizza l'utente alla pagina di login.
        // Salviamo la posizione corrente (location) in modo da poterlo
        // reindirizzare indietro dopo un login riuscito.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Se l'utente è autenticato, renderizza il componente figlio richiesto.
    return children;
};

export default ProtectedRoute;