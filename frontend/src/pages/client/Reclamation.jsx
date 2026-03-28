import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaMapMarkerAlt, FaExclamationTriangle, FaPhoneAlt, FaChevronDown, FaPhone } from "react-icons/fa";
import { BiBookContent } from "react-icons/bi";
import ClientSidebar from '../../components/client/ClientSidebar';
import InputField from '../../components/InputField';
import ConfirmationSoumission from '../../components/client/ConfirmationSoumission';
import { reclamationsAPI } from '../../services/api';

const TYPES = [
  { value: 'connexion', label: 'Problème de connexion' },
  { value: 'facturation', label: 'Erreur de facturation' },
  { value: 'equipement', label: 'Équipement défectueux' },
  { value: 'service', label: 'Service indisponible' },
];

// Configuration des animations pour les éléments de liste
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function ClientReclamation({ clientId }) {
  const [form, setForm] = useState({ nom: '', prenom: '', telephone: '', adresse: '', type_probleme: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [error, setError] = useState('');

  const set = (name, value) => {
    setForm(f => ({ ...f, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!form.nom || !form.prenom || !form.telephone || !form.adresse || !form.type_probleme || !form.description) {
      setError('Veuillez remplir tous les champs avant de soumettre.');
      return;
    }
    setLoading(true);
    try {
      await reclamationsAPI.create({
        client_id: clientId || '6bdcc9ba-523d-4141-b551-307e5f29aaa5',
        titre: `${form.type_probleme} — ${form.nom}`,
        description: `Tel: ${form.telephone} | ${form.description}`,
        type_probleme: form.type_probleme,
        adresse_probleme: form.adresse,
      });
      setSuccess(true);
      setForm({ nom: '', prenom: '', telephone: '', adresse: '', type_probleme: '', description: '' });
    } catch (err) { 
      setError("Une erreur est survenue.");
    } finally { 
      setLoading(false); 
    }
  };

  const selectedType = TYPES.find(t => t.value === form.type_probleme);

  return (
    <div style={styles.pageBackground}>
      <ClientSidebar />
      <ConfirmationSoumission isVisible={success} onClose={() => setSuccess(false)} />

      <div style={styles.mainContent}>
        <div style={styles.topNav}>
          <button type="button" style={styles.navBtn}>✉️</button>
          <button type="button" style={styles.navBtn}>🔔</button>
          <div style={styles.userAvatar}>JD</div>
        </div>

        <div style={styles.cardWrapper}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={styles.authCard}
          >
            {/* PANNEAU GAUCHE */}
            <div style={styles.leftPanel}>
              <div style={styles.decoCircle1} />
              <div style={styles.decoCircle2} />
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ zIndex: 2 }}
              >
                <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                  <h1 style={styles.leftTitle}>RÉCLAMATION</h1>
                  <div style={styles.divider} />
                  <p style={styles.leftSub}>Assistance technique officielle<br/>Algérie Télécom.</p>
                </motion.div>

                <div style={{ marginTop: 40 }}>
                  <p style={styles.assistTitle}>ASSISTANCE DIRECTE</p>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <button type="button" style={styles.callBtn}><FaPhoneAlt size={10}/> 12</button>
                    <button type="button" style={styles.callBtn}><FaPhoneAlt size={10}/> 101</button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* PANNEAU DROIT ANIMÉ */}
            <div style={styles.rightPanel}>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={styles.formGrid}
              >
                <motion.div variants={itemVariants} style={styles.rightHeader}>
                  <h1 style={styles.formTitle}>Nouvelle Demande</h1>
                  <p style={styles.formSubTitle}>Tous les champs sont obligatoires.</p>
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0 }} style={styles.errorBanner}>
                      ⚠️ {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <motion.div variants={itemVariants} style={styles.row5050}>
                    <InputField icon={<FaUser />} placeholder="Nom" value={form.nom} onChange={e => set('nom', e.target.value)} />
                    <InputField icon={<FaUser />} placeholder="Prénom" value={form.prenom} onChange={e => set('prenom', e.target.value)} />
                  </motion.div>
                  
                  <motion.div variants={itemVariants} style={{ position: 'relative' }}>
                    <div style={styles.customInputLine} onClick={() => setTypeOpen(!typeOpen)}>
                      <FaExclamationTriangle style={styles.inputIcon} />
                      <div style={styles.selectText}>
                        <span style={{ color: selectedType ? '#1e293b' : '#a0aec0' }}>
                          {selectedType ? selectedType.label : 'Nature du problème'}
                        </span>
                        <FaChevronDown size={12} color="#a0aec0" />
                      </div>
                    </div>
                    {typeOpen && (
                      <div style={styles.dropdown}>
                        {TYPES.map(t => (
                          <div key={t.value} style={styles.dropItem} onClick={() => { set('type_probleme', t.value); setTypeOpen(false); }}>
                            {t.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <InputField icon={<FaPhone />} placeholder="Numéro de téléphone" value={form.telephone} onChange={e => set('telephone', e.target.value)} />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <InputField icon={<FaMapMarkerAlt />} placeholder="Adresse de l'incident" value={form.adresse} onChange={e => set('adresse', e.target.value)} />
                  </motion.div>

                  <motion.div variants={itemVariants} style={styles.descContainer}>
                    <BiBookContent style={styles.descIcon} />
                    <textarea 
                      placeholder="Description détaillée du problème..." 
                      value={form.description}
                      onChange={e => set('description', e.target.value)}
                      style={styles.textArea}
                    />
                  </motion.div>

                  <motion.button 
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, backgroundColor: '#16a34a' }}
                    whileTap={{ scale: 0.99 }}
                    type="submit" 
                    style={{...styles.submitButton, opacity: loading ? 0.7 : 1}} 
                    disabled={loading}
                  >
                    {loading ? 'ENVOI EN COURS...' : 'SOUMETTRE LA RÉCLAMATION'}
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageBackground: { height: '100vh', width: '100vw', background: '#F8FAFC', display: 'flex', overflow: 'hidden', position: 'fixed', top: 0, left: 0, fontFamily: "'Poppins', sans-serif" },
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 40px', marginLeft: '80px', height: '100vh', overflow: 'hidden' },
  topNav: { display: 'flex', alignSelf: 'flex-end', alignItems: 'center', gap: 20, marginBottom: '5px' },
  navBtn: { background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#64748b' },
  userAvatar: { width: 35, height: 35, borderRadius: '10px', background: '#1e293b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '12px' },
  cardWrapper: { display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: '30px' },
  authCard: { display: 'flex', width: '100%', maxWidth: '1000px', background: '#fff', borderRadius: '30px', boxShadow: '0 24px 80px rgba(0,0,0,0.06)', overflow: 'hidden', maxHeight: '92vh' },
  leftPanel: { width: '32%', background: '#f8fafc', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', borderRight: '1px solid #f1f5f9' },
  decoCircle1: { position: "absolute", top: -70, right: -70, width: 200, height: 240, borderRadius: "50%", background: "rgba(34, 197, 94, 0.04)", pointerEvents: "none" },
  decoCircle2: { position: "absolute", bottom: -50, left: -50, width: 150, height: 150, borderRadius: "50%", background: "rgba(0,112,184,0.03)", pointerEvents: "none" },
  rightPanel: { width: '68%', padding: '30px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  leftTitle: { fontSize: 26, fontWeight: 800, color: '#1e293b', margin: 0, letterSpacing: '1px', textAlign: 'center' },
  divider: { width: 35, height: 4, background: '#22C55E', margin: '12px auto', borderRadius: 10 },
  leftSub: { fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 1.5 },
  assistTitle: { fontSize: 10, fontWeight: 700, color: '#94a3b8', marginBottom: 15, textAlign: 'center', letterSpacing: '1px' },
  callBtn: { background: '#fff', border: '1.5px solid #e2e8f0', padding: '10px 20px', borderRadius: 12, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Poppins', sans-serif" },
  rightHeader: { marginBottom: 20 },
  formTitle: { fontSize: 22, fontWeight: 700, color: '#1e293b', margin: 0 },
  formSubTitle: { fontSize: 13, color: '#94a3b8', marginTop: 3 },
  formGrid: { display: 'flex', flexDirection: 'column', gap: '15px' }, 
  row5050: { display: 'flex', gap: '20px' },
  customInputLine: { display: 'flex', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px', gap: 15, cursor: 'pointer' },
  selectText: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1, fontSize: 14 },
  inputIcon: { color: '#cbd5e1', fontSize: 16 },
  dropdown: { position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 10, marginTop: 5, border: '1px solid #f1f5f9' },
  dropItem: { padding: '10px 15px', fontSize: 13, cursor: 'pointer' },
  descContainer: { display: 'flex', alignItems: 'flex-start', borderBottom: '2px solid #f1f5f9', paddingBottom: '5px', gap: 15 },
  descIcon: { color: '#cbd5e1', fontSize: 18, marginTop: '5px' },
  textArea: { flex: 1, border: 'none', outline: 'none', fontSize: 14, background: 'transparent', height: '60px', resize: 'none', color: '#1e293b', fontFamily: "'Poppins', sans-serif" },
  submitButton: { padding: '16px', marginTop: '10px', background: '#22C55E', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: 14, cursor: 'pointer', boxShadow: '0 10px 20px rgba(34, 197, 94, 0.2)', fontFamily: "'Poppins', sans-serif" },
  errorBanner: { background: '#FEF2F2', color: '#DC2626', padding: '12px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #FECACA', fontSize: '13px', fontWeight: 500 },
};