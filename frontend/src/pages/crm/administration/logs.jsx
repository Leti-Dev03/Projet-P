import { useState, useEffect } from 'react';
import { getLogs } from '../../../services/crm/logs.js';

const ACTIONS = ['', 'LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'RESET_PASSWORD'];
const RESSOURCES = ['', 'auth', 'clients', 'factures', 'reclamations', 'interventions', 'utilisateurs_internes', 'roles', 'roles_permissions'];

const actionColors = {
  LOGIN: '#2ecc71', LOGOUT: '#95a5a6',
  CREATE: '#3498db', UPDATE: '#f39c12',
  DELETE: '#e74c3c', RESET_PASSWORD: '#9b59b6',
};

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    action: '', ressource: '', date_debut: '', date_fin: '',
  });

  const limit = 20;

  useEffect(() => {
    chargerLogs();
  }, [page, filters]);

  const chargerLogs = async () => {
    setLoading(true);
    try {
      const result = await getLogs({ ...filters, page, limit });
      setLogs(result.data || []);
      setTotal(result.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (key, value) => {
    setFilters(f => ({ ...f, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({ action: '', ressource: '', date_debut: '', date_fin: '' });
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleString('fr-DZ', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Logs d'activité</h1>
          <p style={styles.subtitle}>{total} action(s) enregistrée(s)</p>
        </div>
      </div>

      {/* Filtres */}
      <div style={styles.filtersWrap}>
        <select value={filters.action} onChange={e => handleFilter('action', e.target.value)} style={styles.select}>
          <option value="">Toutes les actions</option>
          {ACTIONS.filter(a => a).map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        <select value={filters.ressource} onChange={e => handleFilter('ressource', e.target.value)} style={styles.select}>
          <option value="">Toutes les ressources</option>
          {RESSOURCES.filter(r => r).map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        <input
          type="date" value={filters.date_debut}
          onChange={e => handleFilter('date_debut', e.target.value)}
          style={styles.input} placeholder="Date début"
        />

        <input
          type="date" value={filters.date_fin}
          onChange={e => handleFilter('date_fin', e.target.value)}
          style={styles.input} placeholder="Date fin"
        />

        <button onClick={resetFilters} style={styles.btnReset}>
          Réinitialiser
        </button>
      </div>

      {/* Tableau */}
      {loading ? (
        <div style={styles.loading}>Chargement...</div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Utilisateur</th>
                <th style={styles.th}>Action</th>
                <th style={styles.th}>Ressource</th>
                <th style={styles.th}>Détails</th>
                <th style={styles.th}>IP</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
                    Aucun log trouvé
                  </td>
                </tr>
              ) : logs.map((log) => (
                <tr key={log.id} style={styles.tr}>
                  <td style={styles.td}>
                    {log.utilisateurs_internes ? (
                      <div>
                        <div style={styles.userName}>
                          {log.utilisateurs_internes.prenom} {log.utilisateurs_internes.nom}
                        </div>
                        <div style={styles.userEmail}>{log.utilisateurs_internes.email}</div>
                      </div>
                    ) : <span style={{ color: '#999' }}>Système</span>}
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: actionColors[log.action] || '#95a5a6',
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.ressource}>{log.ressource || '—'}</span>
                  </td>
                  <td style={styles.td}>
                    {log.details ? (
                      <span style={styles.details}>
                        {JSON.stringify(log.details).slice(0, 50)}
                        {JSON.stringify(log.details).length > 50 ? '...' : ''}
                      </span>
                    ) : '—'}
                  </td>
                  <td style={styles.td}>
                    <span style={styles.ip}>{log.ip_address || '—'}</span>
                  </td>
                  <td style={styles.td}>{formatDate(log.date_action)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ ...styles.pageBtn, opacity: page === 1 ? 0.4 : 1 }}
          >
            ← Précédent
          </button>
          <span style={styles.pageInfo}>Page {page} / {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{ ...styles.pageBtn, opacity: page === totalPages ? 0.4 : 1 }}
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: '32px', maxWidth: '1400px', margin: '0 auto' },
  header: { marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px' },
  subtitle: { fontSize: '14px', color: '#666', margin: 0 },
  filtersWrap: { display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' },
  select: { padding: '9px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', backgroundColor: 'white', cursor: 'pointer', outline: 'none' },
  input: { padding: '9px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' },
  btnReset: { padding: '9px 16px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', color: '#333' },
  loading: { padding: '48px', textAlign: 'center', color: '#666' },
  tableWrap: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#f8f9fa' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#333', verticalAlign: 'middle' },
  userName: { fontWeight: '600', fontSize: '14px' },
  userEmail: { fontSize: '12px', color: '#999' },
  badge: { padding: '3px 10px', borderRadius: '20px', fontSize: '11px', color: 'white', fontWeight: '600', whiteSpace: 'nowrap' },
  ressource: { fontSize: '13px', color: '#555', fontFamily: 'monospace', backgroundColor: '#f5f5f5', padding: '2px 8px', borderRadius: '4px' },
  details: { fontSize: '12px', color: '#777', fontFamily: 'monospace' },
  ip: { fontSize: '12px', color: '#999', fontFamily: 'monospace' },
  pagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '24px' },
  pageBtn: { padding: '8px 16px', backgroundColor: '#006837', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
  pageInfo: { fontSize: '14px', color: '#666' },
};