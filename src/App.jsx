import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import './App.css';

function App() {
  // Rimuoviamo tutta la logica di notifica da qui.
  // App ora si occupa solo di fornire il contesto di autenticazione
  // e di renderizzare il Layout principale.
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

export default App;