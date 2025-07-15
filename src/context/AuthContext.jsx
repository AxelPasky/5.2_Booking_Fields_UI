import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);
const API_URL = 'https://api-booking-fields.up.railway.app/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            fetch(`${API_URL}/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            })
            .then(response => {
                if (response.ok) return response.json();
                throw new Error('Invalid token');
            })
            .then(data => setUser(data.data))
            .catch(() => {
                localStorage.removeItem('authToken');
                setToken(null);
                setUser(null);
            })
            .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (credentials) => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to login');
        }

        const data = await response.json();
        localStorage.setItem('authToken', data.access_token);
        setToken(data.access_token);
        navigate('/fields');
    };

    const register = async (userData) => {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (errorData.errors) {
                const messages = Object.values(errorData.errors).flat();
                throw new Error(messages.join('\n'));
            }
            throw new Error(errorData.message || 'Failed to register');
        }

        // NON salviamo più il token e NON aggiorniamo lo stato.
        // Reindirizziamo semplicemente alla pagina di login con un messaggio di stato.
        navigate('/login', {
            state: { message: 'Registration successful! Please log in.' }
        });
    };

    const logout = async () => {
        if (token) {
            await fetch(`${API_URL}/logout`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
            });
        }
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    const value = { user, token, login, register, logout, loading };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);