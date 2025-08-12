import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

export default App;