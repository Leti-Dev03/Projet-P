// src/pages/crm/login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/crm/AuthContext.jsx';

export default function LoginCRM() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/crm/dashboard');
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>AT</div>
          <h1 style={styles.title}>CRM Algérie Télécom</h1>
          <p style={styles.subtitle}>Espace de gestion interne</p>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="votre@email.com" 
              required 
              style={styles.input} 
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Mot de passe</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              required 
              style={styles.input} 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <p style={styles.footer}>Accès réservé au personnel autorisé</p>
      </div>
    </div>
  );
}

const styles = {
  page: { 
    minHeight: '100vh', 
    backgroundColor: '#f0f4f8', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: '20px' 
  },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: '12px', 
    padding: '40px', 
    width: '100%', 
    maxWidth: '420px', 
    boxShadow: '0 4px 24px rgba(0,0,0,0.1)' 
  },
  header: { 
    textAlign: 'center', 
    marginBottom: '32px' 
  },
  logo: { 
    width: '64px', 
    height: '64px', 
    borderRadius: '16px', 
    backgroundColor: '#006837', 
    color: 'white', 
    fontSize: '24px', 
    fontWeight: 'bold', 
    display: 'inline-flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: '16px' 
  },
  title: { 
    fontSize: '22px', 
    fontWeight: '700', 
    color: '#1a1a1a', 
    margin: '0 0 6px' 
  },
  subtitle: { 
    fontSize: '14px', 
    color: '#666', 
    margin: 0 
  },
  form: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '20px' 
  },
  error: { 
    backgroundColor: '#fff0f0', 
    border: '1px solid #ffcccc', 
    borderRadius: '8px', 
    padding: '12px', 
    color: '#c0392b', 
    fontSize: '14px' 
  },
  field: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '6px' 
  },
  label: { 
    fontSize: '14px', 
    fontWeight: '600', 
    color: '#333' 
  },
  input: { 
    padding: '12px 14px', 
    borderRadius: '8px', 
    border: '1px solid #ddd', 
    fontSize: '15px', 
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  btn: { 
    padding: '13px', 
    backgroundColor: '#006837', 
    color: 'white', 
    border: 'none', 
    borderRadius: '8px', 
    fontSize: '16px', 
    fontWeight: '600', 
    cursor: 'pointer',
    transition: 'opacity 0.2s'
  },
  footer: { 
    textAlign: 'center', 
    fontSize: '12px', 
    color: '#999', 
    marginTop: '24px' 
  },
};