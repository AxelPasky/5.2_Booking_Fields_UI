import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Importa
import './AuthForm.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const location = useLocation();
    const { t } = useTranslation(); // Inizializza

    // Controlla se c'è un messaggio di successo passato dallo stato della rotta
    const successMessage = location.state?.message;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login({ email, password });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>{t('login')}</h2>
                {/* Mostra il messaggio di successo se esiste */}
                {successMessage && <p className="success-message">{t(successMessage)}</p>}
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label htmlFor="email">{t('email')}</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">{t('password')}</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? t('loggingIn') : t('login')}
                </button>
            </form>
        </div>
    );
}

export default LoginPage;