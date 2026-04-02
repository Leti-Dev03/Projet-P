import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/crm/AuthContext.jsx';
import Layout from '../../../components/crm/common/Layout.jsx';
import api from '../../../services/crm/api.js';

// ─── Icônes inline SVG ───────────────────────────────────────
const IconUser    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const IconLock    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconServer  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="5" rx="1"/><rect x="2" y="10" width="20" height="5" rx="1"/><rect x="2" y="17" width="20" height="5" rx="1"/><circle cx="6" cy="5.5" r="1" fill="currentColor"/><circle cx="6" cy="12.5" r="1" fill="currentColor"/><circle cx="6" cy="19.5" r="1" fill="currentColor"/></svg>;
const IconCheck   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconEye     = ({ off }) => off
  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;

// ─── Composant champ input ────────────────────────────────────
function Field({ label, type = 'text', value, onChange, disabled, hint, rightEl }) {
  return (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          style={{ ...s.input, ...(disabled ? s.inputDisabled : {}), paddingRight: rightEl ? '40px' : '14px' }}
        />
        {rightEl && (
          <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#999' }}>
            {rightEl}
          </div>
        )}
      </div>
      {hint && <span style={s.hint}>{hint}</span>}
    </div>
  );
}

// ─── Toast notification ───────────────────────────────────────
function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  if (!msg) return null;
  const isErr = msg.type === 'error';
  return (
    <div style={{ ...s.toast, background: isErr ? '#fff0f0' : '#f0fff4', borderColor: isErr ? '#e74c3c' : '#4CAF50', color: isErr ? '#c0392b' : '#2e7d32' }}>
      {!isErr && <span style={{ marginRight: '8px' }}><IconCheck /></span>}
      {msg.text}
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────
function Section({ icon, title, subtitle, children }) {
  return (
    <div style={s.section}>
      <div style={s.sectionHead}>
        <div style={s.sectionIcon}>{icon}</div>
        <div>
          <div style={s.sectionTitle}>{title}</div>
          <div style={s.sectionSub}>{subtitle}</div>
        </div>
      </div>
      <div style={s.sectionBody}>{children}</div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────
export default function Parametres() {
  const { user, login } = useAuth();

  // Profil
  const [profil, setProfil] = useState({ nom: '', prenom: '', email: '', telephone: '' });
  const [profilLoading, setProfilLoading] = useState(false);

  // Mot de passe
  const [mdp, setMdp] = useState({ ancien: '', nouveau: '', confirm: '' });
  const [showMdp, setShowMdp] = useState({ ancien: false, nouveau: false, confirm: false });
  const [mdpLoading, setMdpLoading] = useState(false);

  // Système
  const [sysInfo, setSysInfo] = useState(null);
  const [sysLoading, setSysLoading] = useState(true);

  // Feedback
  const [toast, setToast] = useState(null);

  // Init profil depuis user connecté
  useEffect(() => {
    if (user) {
      setProfil({
        nom:       user.nom       || '',
        prenom:    user.prenom    || '',
        email:     user.email     || '',
        telephone: user.telephone || '',
      });
    }
  }, [user]);

  // Charger infos système
  useEffect(() => {
    const fetchSys = async () => {
      try {
        const { data } = await api.get('/health');
        setSysInfo(data);
      } catch {
        setSysInfo({ status: 'Inconnu', timestamp: null });
      } finally {
        setSysLoading(false);
      }
    };
    fetchSys();
  }, []);

  const notify = (type, text) => setToast({ type, text });

  // ── Sauvegarde profil ──
  const handleSaveProfil = async (e) => {
    e.preventDefault();
    if (!profil.nom.trim() || !profil.prenom.trim()) {
      return notify('error', 'Nom et prénom sont obligatoires');
    }
    setProfilLoading(true);
    try {
      await api.put(`/users/${user.id}`, {
        nom: profil.nom,
        prenom: profil.prenom,
        telephone: profil.telephone,
      });
      notify('success', 'Profil mis à jour avec succès');
    } catch (err) {
      notify('error', err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setProfilLoading(false);
    }
  };

  // ── Changement mot de passe ──
  const handleSaveMdp = async (e) => {
    e.preventDefault();
    if (!mdp.ancien || !mdp.nouveau || !mdp.confirm) {
      return notify('error', 'Tous les champs sont obligatoires');
    }
    if (mdp.nouveau.length < 8) {
      return notify('error', 'Le nouveau mot de passe doit faire au moins 8 caractères');
    }
    if (mdp.nouveau !== mdp.confirm) {
      return notify('error', 'Les mots de passe ne correspondent pas');
    }
    setMdpLoading(true);
    try {
      await api.put(`/users/${user.id}/password`, {
        ancien_mot_de_passe: mdp.ancien,
        nouveau_mot_de_passe: mdp.nouveau,
      });
      setMdp({ ancien: '', nouveau: '', confirm: '' });
      notify('success', 'Mot de passe changé avec succès');
    } catch (err) {
      notify('error', err.response?.data?.message || 'Mot de passe actuel incorrect');
    } finally {
      setMdpLoading(false);
    }
  };

  const toggleVoir = (key) => setShowMdp(prev => ({ ...prev, [key]: !prev[key] }));

  // Force du mot de passe
  const forceScore = () => {
    const p = mdp.nouveau;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8)  score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };
  const force = forceScore();
  const forceLabel = ['', 'Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'][force];
  const forceColor = ['', '#e74c3c', '#e67e22', '#f39c12', '#4CAF50', '#2e7d32'][force];

  return (
    <Layout>
      <div style={s.page}>
        {/* En-tête */}
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Paramètres</h1>
            <p style={s.subtitle}>Gérez votre profil et les préférences du système</p>
          </div>
          {user?.est_superadmin && (
            <span style={s.superBadge}>⚡ Super Admin</span>
          )}
        </div>

        <Toast msg={toast} onClose={() => setToast(null)} />

        <div style={s.grid}>

          {/* ── Section Profil ── */}
          <Section
            icon={<IconUser />}
            title="Mon profil"
            subtitle="Informations personnelles de votre compte"
          >
            <form onSubmit={handleSaveProfil} style={s.form}>
              {/* Avatar initiales */}
              <div style={s.avatarWrap}>
                <div style={s.avatar}>
                  {(user?.prenom?.[0] || '?')}{(user?.nom?.[0] || '')}
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '15px' }}>{user?.prenom} {user?.nom}</div>
                  <div style={{ fontSize: '13px', color: '#888' }}>{user?.email}</div>
                </div>
              </div>

              <div style={s.row}>
                <Field label="Prénom *" value={profil.prenom} onChange={e => setProfil({ ...profil, prenom: e.target.value })} />
                <Field label="Nom *" value={profil.nom} onChange={e => setProfil({ ...profil, nom: e.target.value })} />
              </div>
              <Field label="Email" value={profil.email} disabled hint="L'email ne peut pas être modifié" />
              <Field label="Téléphone" value={profil.telephone} onChange={e => setProfil({ ...profil, telephone: e.target.value })} />

              <div style={s.formFooter}>
                <button type="submit" disabled={profilLoading} style={s.btnPrimary}>
                  {profilLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </div>
            </form>
          </Section>

          {/* ── Section Sécurité ── */}
          <Section
            icon={<IconLock />}
            title="Sécurité"
            subtitle="Changez votre mot de passe"
          >
            <form onSubmit={handleSaveMdp} style={s.form}>
              <Field
                label="Mot de passe actuel"
                type={showMdp.ancien ? 'text' : 'password'}
                value={mdp.ancien}
                onChange={e => setMdp({ ...mdp, ancien: e.target.value })}
                rightEl={<span onClick={() => toggleVoir('ancien')}><IconEye off={showMdp.ancien} /></span>}
              />
              <Field
                label="Nouveau mot de passe"
                type={showMdp.nouveau ? 'text' : 'password'}
                value={mdp.nouveau}
                onChange={e => setMdp({ ...mdp, nouveau: e.target.value })}
                rightEl={<span onClick={() => toggleVoir('nouveau')}><IconEye off={showMdp.nouveau} /></span>}
              />

              {/* Barre de force */}
              {mdp.nouveau && (
                <div style={{ marginTop: '-8px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i <= force ? forceColor : '#eee', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '12px', color: forceColor, fontWeight: '600' }}>{forceLabel}</span>
                </div>
              )}

              <Field
                label="Confirmer le nouveau mot de passe"
                type={showMdp.confirm ? 'text' : 'password'}
                value={mdp.confirm}
                onChange={e => setMdp({ ...mdp, confirm: e.target.value })}
                rightEl={<span onClick={() => toggleVoir('confirm')}><IconEye off={showMdp.confirm} /></span>}
              />

              {/* Confirmation visuelle */}
              {mdp.confirm && mdp.nouveau && (
                <div style={{ fontSize: '12px', color: mdp.nouveau === mdp.confirm ? '#4CAF50' : '#e74c3c', fontWeight: '600' }}>
                  {mdp.nouveau === mdp.confirm ? '✓ Les mots de passe correspondent' : '✗ Les mots de passe ne correspondent pas'}
                </div>
              )}

              <div style={s.requirements}>
                <div style={s.reqTitle}>Exigences :</div>
                {[
                  { ok: mdp.nouveau.length >= 8,        text: 'Au moins 8 caractères' },
                  { ok: /[A-Z]/.test(mdp.nouveau),      text: 'Une majuscule' },
                  { ok: /[0-9]/.test(mdp.nouveau),      text: 'Un chiffre' },
                ].map((r, i) => (
                  <div key={i} style={{ ...s.reqItem, color: r.ok ? '#4CAF50' : '#aaa' }}>
                    {r.ok ? '✓' : '○'} {r.text}
                  </div>
                ))}
              </div>

              <div style={s.formFooter}>
                <button type="submit" disabled={mdpLoading} style={s.btnPrimary}>
                  {mdpLoading ? 'Modification...' : 'Changer le mot de passe'}
                </button>
              </div>
            </form>
          </Section>

          {/* ── Section Système ── */}
          <Section
            icon={<IconServer />}
            title="Informations système"
            subtitle="État du serveur et de la base de données"
          >
            {sysLoading ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#999', fontSize: '14px' }}>Chargement...</div>
            ) : (
              <div style={s.sysGrid}>
                {[
                  { label: 'Statut API',      value: sysInfo?.status || 'Inconnu',    ok: sysInfo?.status === 'OK' },
                  { label: 'Version',          value: 'v1.0.0',                        ok: true },
                  { label: 'Base de données',  value: 'Supabase PostgreSQL',           ok: true },
                  { label: 'Environnement',    value: process.env.NODE_ENV || 'dev',   ok: true },
                  { label: 'Dernière synchro', value: sysInfo?.timestamp ? new Date(sysInfo.timestamp).toLocaleString('fr-DZ') : '—', ok: true },
                  { label: 'Votre rôle',       value: user?.est_superadmin ? 'Super Admin' : (user?.roles?.[0]?.nom || '—'), ok: true },
                ].map((item, i) => (
                  <div key={i} style={s.sysRow}>
                    <span style={s.sysLabel}>{item.label}</span>
                    <span style={{ ...s.sysValue, color: item.label === 'Statut API' ? (item.ok ? '#4CAF50' : '#e74c3c') : '#1a1a1a' }}>
                      {item.label === 'Statut API' && (
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: item.ok ? '#4CAF50' : '#e74c3c', marginRight: '6px' }} />
                      )}
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Section>

        </div>
      </div>
    </Layout>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const s = {
  page:        { padding: '32px', maxWidth: '1100px', margin: '0 auto' },
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' },
  title:       { fontSize: '24px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px' },
  subtitle:    { fontSize: '14px', color: '#666', margin: 0 },
  superBadge:  { padding: '6px 14px', background: '#fff8e1', color: '#e65100', border: '1px solid #ffe0b2', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },

  grid:        { display: 'flex', flexDirection: 'column', gap: '24px' },

  section:     { background: '#fff', borderRadius: '16px', boxShadow: '0 1px 8px rgba(0,0,0,0.07)', overflow: 'hidden' },
  sectionHead: { display: 'flex', alignItems: 'center', gap: '14px', padding: '20px 24px', borderBottom: '1px solid #f0f0f0' },
  sectionIcon: { width: '40px', height: '40px', borderRadius: '10px', background: '#E8F5E9', color: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  sectionTitle:{ fontWeight: '700', fontSize: '16px', color: '#1a1a1a' },
  sectionSub:  { fontSize: '13px', color: '#888', marginTop: '2px' },
  sectionBody: { padding: '24px' },

  form:        { display: 'flex', flexDirection: 'column', gap: '16px' },
  row:         { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  field:       { display: 'flex', flexDirection: 'column', gap: '6px' },
  label:       { fontSize: '13px', fontWeight: '600', color: '#444' },
  input:       { padding: '10px 14px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' },
  inputDisabled:{ background: '#f8f9fa', color: '#999', cursor: 'not-allowed' },
  hint:        { fontSize: '12px', color: '#aaa', marginTop: '2px' },

  formFooter:  { display: 'flex', justifyContent: 'flex-end', paddingTop: '8px' },
  btnPrimary:  { padding: '11px 24px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },

  avatarWrap:  { display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', background: '#f8f9fa', borderRadius: '10px', marginBottom: '4px' },
  avatar:      { width: '48px', height: '48px', borderRadius: '50%', background: '#4CAF50', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', flexShrink: 0 },

  requirements:{ background: '#f8f9fa', borderRadius: '8px', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '4px' },
  reqTitle:    { fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '4px' },
  reqItem:     { fontSize: '12px', transition: 'color 0.2s' },

  sysGrid:     { display: 'flex', flexDirection: 'column', gap: '0' },
  sysRow:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' },
  sysLabel:    { fontSize: '14px', color: '#666' },
  sysValue:    { fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center' },

  toast:       { position: 'fixed', top: '24px', right: '24px', padding: '14px 20px', borderRadius: '10px', border: '1px solid', fontSize: '14px', fontWeight: '500', zIndex: 9999, display: 'flex', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', animation: 'slideIn 0.3s ease' },
};