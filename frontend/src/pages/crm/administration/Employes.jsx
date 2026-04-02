import { useState, useEffect } from 'react';
import { getUsers, createUser, toggleUserStatut, resetUserPassword } from '../../../services/crm/users.js';
import { getRoles } from '../../../services/crm/roles.js';
import { useAuth } from '../../../context/crm/AuthContext.jsx';

export default function Employes() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '', role_id: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { hasPermission } = useAuth();

  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    try {
      const [usersData, rolesData] = await Promise.all([getUsers(), getRoles()]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await createUser(form);
      setMessage({ type: 'success', text: 'Compte créé et email envoyé ✅' });
      setShowModal(false);
      setForm({ nom: '', prenom: '', email: '', telephone: '', role_id: '' });
      chargerDonnees();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la création' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggle = async (user) => {
    const newStatut = user.statut === 'actif' ? 'inactif' : 'actif';
    try {
      await toggleUserStatut(user.id, newStatut);
      chargerDonnees();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur' });
    }
  };

  const handleReset = async (user) => {
    if (!window.confirm(`Réinitialiser le mot de passe de ${user.prenom} ${user.nom} ?`)) return;
    try {
      await resetUserPassword(user.id);
      setMessage({ type: 'success', text: `Mot de passe réinitialisé — email envoyé à ${user.email}` });
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de la réinitialisation' });
    }
  };

  const statutBadge = (statut) => {
    const colors = { actif: '#006837', inactif: '#999', suspendu: '#e74c3c', bloque: '#c0392b' };
    return (
      <span style={{ ...styles.badge, backgroundColor: colors[statut] || '#999' }}>
        {statut}
      </span>
    );
  };

  if (loading) return <div style={styles.loading}>Chargement...</div>;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Gestion des Employés</h1>
          <p style={styles.subtitle}>{users.length} compte(s) interne(s)</p>
        </div>
        {hasPermission('utilisateurs', 'create') && (
          <button style={styles.btnPrimary} onClick={() => setShowModal(true)}>
            + Nouveau compte
          </button>
        )}
      </div>

      {/* Message */}
      {message && (
        <div style={{ ...styles.alert, backgroundColor: message.type === 'success' ? '#f0fff4' : '#fff0f0', borderColor: message.type === 'success' ? '#006837' : '#e74c3c', color: message.type === 'success' ? '#006837' : '#c0392b' }}>
          {message.text}
          <button onClick={() => setMessage(null)} style={styles.closeBtn}>✕</button>
        </div>
      )}

      {/* Tableau */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Employé</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Rôle</th>
              <th style={styles.th}>Statut</th>
              <th style={styles.th}>Dernière connexion</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={styles.avatar}>{user.prenom?.[0]}{user.nom?.[0]}</div>
                  <div>
                    <div style={styles.userName}>{user.prenom} {user.nom}</div>
                    {user.est_superadmin && <span style={styles.superadmin}>Super Admin</span>}
                  </div>
                </td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.roles?.map(r => r?.nom).join(', ') || '—'}</td>
                <td style={styles.td}>{statutBadge(user.statut)}</td>
                <td style={styles.td}>{user.dernier_login ? new Date(user.dernier_login).toLocaleString('fr-DZ') : 'Jamais'}</td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    {hasPermission('utilisateurs', 'update') && !user.est_superadmin && (
                      <>
                        <button style={styles.btnSm} onClick={() => handleToggle(user)}>
                          {user.statut === 'actif' ? 'Désactiver' : 'Activer'}
                        </button>
                        <button style={{ ...styles.btnSm, backgroundColor: '#e67e22' }} onClick={() => handleReset(user)}>
                          Reset MDP
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal création */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Créer un compte</h2>
              <button onClick={() => setShowModal(false)} style={styles.closeBtn}>✕</button>
            </div>
            <form onSubmit={handleCreate} style={styles.modalForm}>
              {[
                { label: 'Prénom', key: 'prenom', type: 'text' },
                { label: 'Nom', key: 'nom', type: 'text' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Téléphone', key: 'telephone', type: 'tel' },
              ].map(({ label, key, type }) => (
                <div key={key} style={styles.field}>
                  <label style={styles.label}>{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    required={key !== 'telephone'}
                    style={styles.input}
                  />
                </div>
              ))}
              <div style={styles.field}>
                <label style={styles.label}>Rôle *</label>
                <select value={form.role_id} onChange={(e) => setForm({ ...form, role_id: e.target.value })} required style={styles.input}>
                  <option value="">-- Sélectionner un rôle --</option>
                  {roles.map((r) => <option key={r.id} value={r.id}>{r.nom}</option>)}
                </select>
              </div>
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} style={styles.btnSecondary}>Annuler</button>
                <button type="submit" disabled={formLoading} style={styles.btnPrimary}>
                  {formLoading ? 'Création...' : 'Créer le compte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: '32px', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px' },
  subtitle: { fontSize: '14px', color: '#666', margin: 0 },
  loading: { padding: '48px', textAlign: 'center', color: '#666' },
  alert: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '8px', border: '1px solid', marginBottom: '20px', fontSize: '14px' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: 'inherit' },
  tableWrap: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#f8f9fa' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #eee' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#333', display: 'table-cell', verticalAlign: 'middle' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#006837', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600', marginRight: '10px' },
  userName: { fontWeight: '600', display: 'inline' },
  superadmin: { fontSize: '11px', backgroundColor: '#fff3cd', color: '#856404', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px' },
  badge: { padding: '3px 10px', borderRadius: '20px', fontSize: '12px', color: 'white', fontWeight: '500' },
  actions: { display: 'flex', gap: '8px' },
  btnPrimary: { padding: '10px 20px', backgroundColor: '#006837', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  btnSecondary: { padding: '10px 20px', backgroundColor: '#f0f0f0', color: '#333', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
  btnSm: { padding: '6px 12px', backgroundColor: '#006837', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: 'white', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  modalTitle: { fontSize: '20px', fontWeight: '700', margin: 0 },
  modalForm: { display: 'flex', flexDirection: 'column', gap: '16px' },
  modalActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#333' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' },
};