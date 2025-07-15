import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import './App.css';

function App() {
  // Ora App avvolge il Layout con l'AuthProvider.
  // Poiché App è renderizzato dal Router, AuthProvider può usare useNavigate.
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

export default App;