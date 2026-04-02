import { useState, useEffect } from 'react';
import { getRoles, createRole, updateRole, deleteRole, getRolePermissions, updateRolePermissions } from '../../../services/crm/roles.js';
import { useAuth } from '../../../context/crm/AuthContext.jsx';

export default function Profils() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPermModal, setShowPermModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [matrice, setMatrice] = useState([]);
  const [form, setForm] = useState({ nom: '', description: '' });
  const [message, setMessage] = useState(null);
  const { hasPermission } = useAuth();

  useEffect(() => { chargerRoles(); }, []);

  const chargerRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const ouvrirPermissions = async (role) => {
    setSelectedRole(role);
    try {
      const data = await getRolePermissions(role.id);
      setMatrice(data);
      setShowPermModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const togglePermission = (ressourceIdx, permIdx) => {
    const newMatrice = [...matrice];
    newMatrice[ressourceIdx].permissions[permIdx].active = !newMatrice[ressourceIdx].permissions[permIdx].active;
    setMatrice(newMatrice);
  };

  const sauvegarderPermissions = async () => {
    const activeIds = matrice.flatMap((r) => r.permissions.filter((p) => p.active).map((p) => p.permission_id));
    try {
      await updateRolePermissions(selectedRole.id, activeIds);
      setMessage({ type: 'success', text: `Permissions de "${selectedRole.nom}" mises à jour ✅` });
      setShowPermModal(false);
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createRole(form);
      setMessage({ type: 'success', text: `Rôle "${form.nom}" créé ✅` });
      setShowCreateModal(false);
      setForm({ nom: '', description: '' });
      chargerRoles();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur' });
    }
  };

  const handleDelete = async (role) => {
    if (!window.confirm(`Supprimer le rôle "${role.nom}" ?`)) return;
    try {
      await deleteRole(role.id);
      setMessage({ type: 'success', text: `Rôle supprimé` });
      chargerRoles();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur' });
    }
  };

  const actionLabel = { create: 'Créer', read: 'Lire', update: 'Modifier', delete: 'Supprimer' };

  if (loading) return <div style={styles.loading}>Chargement...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Gestion des Profils</h1>
          <p style={styles.subtitle}>{roles.length} rôle(s) défini(s)</p>
        </div>
        {hasPermission('roles', 'create') && (
          <button style={styles.btnPrimary} onClick={() => setShowCreateModal(true)}>+ Nouveau profil</button>
        )}
      </div>

      {message && (
        <div style={{ ...styles.alert, backgroundColor: message.type === 'success' ? '#f0fff4' : '#fff0f0', borderColor: message.type === 'success' ? '#006837' : '#e74c3c', color: message.type === 'success' ? '#006837' : '#c0392b' }}>
          {message.text}
          <button onClick={() => setMessage(null)} style={styles.closeBtn}>✕</button>
        </div>
      )}

      {/* Grille des rôles */}
      <div style={styles.grid}>
        {roles.map((role) => (
          <div key={role.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.roleIcon}>{role.nom[0].toUpperCase()}</div>
              <div>
                <h3 style={styles.roleName}>{role.nom}</h3>
                <p style={styles.roleDesc}>{role.description || 'Aucune description'}</p>
              </div>
            </div>
            <div style={styles.cardActions}>
              {hasPermission('roles', 'read') && (
                <button style={styles.btnSm} onClick={() => ouvrirPermissions(role)}>
                  ⚙️ Permissions
                </button>
              )}
              {hasPermission('roles', 'delete') && role.nom !== 'admin' && (
                <button style={{ ...styles.btnSm, backgroundColor: '#e74c3c' }} onClick={() => handleDelete(role)}>
                  Supprimer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal création rôle */}
      {showCreateModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Nouveau profil</h2>
              <button onClick={() => setShowCreateModal(false)} style={styles.closeBtn}>✕</button>
            </div>
            <form onSubmit={handleCreate} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Nom du profil *</label>
                <input type="text" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Ex: Technicien, Commercial..." required style={styles.input} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Décrivez les responsabilités de ce profil..." style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }} />
              </div>
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={styles.btnSecondary}>Annuler</button>
                <button type="submit" style={styles.btnPrimary}>Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal permissions */}
      {showPermModal && selectedRole && (
        <div style={styles.overlay}>
          <div style={{ ...styles.modal, maxWidth: '700px' }}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Permissions — {selectedRole.nom}</h2>
              <button onClick={() => setShowPermModal(false)} style={styles.closeBtn}>✕</button>
            </div>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
              Cochez les actions autorisées pour ce profil sur chaque ressource.
            </p>
            <div style={styles.matriceWrap}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>Ressource</th>
                    <th style={styles.th}>Créer</th>
                    <th style={styles.th}>Lire</th>
                    <th style={styles.th}>Modifier</th>
                    <th style={styles.th}>Supprimer</th>
                  </tr>
                </thead>
                <tbody>
                  {matrice.map((ressource, ri) => (
                    <tr key={ressource.ressource_id} style={styles.tr}>
                      <td style={{ ...styles.td, fontWeight: '600', textTransform: 'capitalize' }}>{ressource.ressource_nom}</td>
                      {['create', 'read', 'update', 'delete'].map((action) => {
                        const perm = ressource.permissions.find((p) => p.action === action);
                        const pi = ressource.permissions.findIndex((p) => p.action === action);
                        return (
                          <td key={action} style={{ ...styles.td, textAlign: 'center' }}>
                            {perm ? (
                              <input
                                type="checkbox"
                                checked={perm.active}
                                onChange={() => togglePermission(ri, pi)}
                                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#006837' }}
                              />
                            ) : '—'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ ...styles.modalActions, marginTop: '20px' }}>
              <button onClick={() => setShowPermModal(false)} style={styles.btnSecondary}>Annuler</button>
              <button onClick={sauvegarderPermissions} style={styles.btnPrimary}>Sauvegarder</button>
            </div>
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' },
  card: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 8px rgba(0,0,0,0.08)' },
  cardHeader: { display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '20px' },
  roleIcon: { width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#006837', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700', flexShrink: 0 },
  roleName: { fontSize: '16px', fontWeight: '700', margin: '0 0 4px' },
  roleDesc: { fontSize: '13px', color: '#666', margin: 0 },
  cardActions: { display: 'flex', gap: '8px' },
  btnPrimary: { padding: '10px 20px', backgroundColor: '#006837', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  btnSecondary: { padding: '10px 20px', backgroundColor: '#f0f0f0', color: '#333', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
  btnSm: { padding: '8px 14px', backgroundColor: '#006837', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: 'white', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  modalTitle: { fontSize: '20px', fontWeight: '700', margin: 0 },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  modalActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#333' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' },
  matriceWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#f8f9fa' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', borderBottom: '1px solid #eee' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#333' },
};