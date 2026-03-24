// import { useState, useEffect, useCallback } from 'react';
// import ClientSidebar from '../../components/client/ClientSidebar';
// import { reclamationsAPI } from '../../services/api';

// const statutSteps = [
//   { key: 'ouvert',      label: 'Soumise',          desc: 'Votre réclamation a été reçue',             icon: '📋' },
//   { key: 'en_attente',  label: 'En attente',       desc: 'En cours d’analyse par notre équipe',       icon: '🔍' },
//   { key: 'en_cours',    label: 'En traitement',    desc: 'Un agent traite votre demande',             icon: '⚙️' },
//   { key: 'resolu',      label: 'Résolue',          desc: 'Votre problème a été résolu',               icon: '✅' },
// ];

// const prioriteConfig = {
//   urgente: { color: '#dc2626', bg: 'rgba(239,68,68,0.1)', label: 'Urgente' },
//   haute:   { color: '#d97706', bg: 'rgba(245,158,11,0.1)', label: 'Haute'   },
//   normale: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', label: 'Normale'},
//   basse:   { color: '#059669', bg: 'rgba(16,185,129,0.1)', label: 'Basse'  },
// };

// const typeIcon = {
//   connexion:   '',
//   facturation: '',
//   equipement:  '',
//   service:     '',
//   autre:       '',
// };

// function getStepIndex(statut) {
//   const map = { ouvert: 0, en_attente: 1, en_cours: 2, resolu: 3, ferme: 3 };
//   return map[statut] ?? 0;
// }

// function TimelineStep({ step, index, currentIndex, isLast }) {
//   const done   = index <= currentIndex;
//   const active = index === currentIndex;
//   const green  = '#22c55e';

//   return (
//     <div style={{ display: 'flex', gap: 20, position: 'relative', padding: '8px 0' }}>
//       {/* Ligne verticale gradient */}
//       {!isLast && (
//         <div style={{
//           position: 'absolute',
//           left: 20,
//           top: 44,
//           width: 3,
//           height: 'calc(100% + 8px)',
//           background: done && index < currentIndex
//             ? 'linear-gradient(to bottom, #22c55e, #86efac)'
//             : '#e5e7eb',
//           borderRadius: 3,
//           transition: 'background 0.6s ease',
//         }} />
//       )}

//       {/* Cercle avec glow */}
//       <div style={{
//         width: 44,
//         height: 44,
//         borderRadius: '50%',
//         flexShrink: 0,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         fontSize: 20,
//         background: active ? `linear-gradient(135deg, #22c55e, #16a34a)` : done ? '#f0fdf4' : '#f3f4f6',
//         border: active ? '4px solid #86efac' : done ? '3px solid #86efac' : '3px solid #d1d5db',
//         boxShadow: active
//           ? '0 0 0 8px rgba(34,197,94,0.22), 0 4px 12px rgba(0,0,0,0.06)'
//           : done
//           ? '0 2px 8px rgba(34,197,94,0.15)'
//           : '0 1px 4px rgba(0,0,0,0.04)',
//         transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
//         zIndex: 1,
//       }}>
//         {done && !active ? <span style={{ color: green, fontSize: 24 }}>✓</span> : step.icon}
//       </div>

//       {/* Contenu */}
//       <div style={{ paddingTop: 8, paddingBottom: isLast ? 0 : 32 }}>
//         <div style={{
//           fontSize: 14,
//           fontWeight: active ? 600 : 500,
//           color: active ? '#065f46' : done ? '#15803d' : '#6b7280',
//           letterSpacing: '-0.01em',
//         }}>
//           {step.label}
//         </div>
//         <div style={{
//           fontSize: 13,
//           color: active ? '#374151' : done ? '#4b5563' : '#9ca3af',
//           marginTop: 4,
//           lineHeight: 1.4,
//         }}>
//           {step.desc}
//         </div>
//         {active && (
//           <div style={{
//             marginTop: 10,
//             display: 'inline-flex',
//             alignItems: 'center',
//             gap: 6,
//             background: 'rgba(34,197,94,0.1)',
//             borderRadius: 999,
//             padding: '5px 12px',
//             fontSize: 12,
//             fontWeight: 600,
//             color: '#15803d',
//           }}>
//             <span style={{
//               width: 8,
//               height: 8,
//               borderRadius: '50%',
//               background: '#22c55e',
//               animation: 'pulse 1.8s infinite',
//             }} />
//             En cours
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function ReclamationCard({ reclamation, selected, onClick }) {
//   const p = prioriteConfig[reclamation.priorite] || prioriteConfig.normale;
//   const stepIdx = getStepIndex(reclamation.statut);

//   return (
//     <div
//       onClick={onClick}
//       style={{
//         background: 'rgba(255,255,255,0.85)',
//         backdropFilter: 'blur(10px)',
//         border: `1.5px solid ${selected ? '#22c55e' : 'rgba(229,231,235,0.8)'}`,
//         borderRadius: 16,
//         padding: '16px 18px',
//         cursor: 'pointer',
//         transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
//         marginBottom: 12,
//         boxShadow: selected
//           ? '0 10px 30px -10px rgba(34,197,94,0.18), 0 4px 16px rgba(0,0,0,0.06)'
//           : '0 6px 20px rgba(0,0,0,0.05)',
//         transform: selected ? 'translateY(-4px) scale(1.015)' : 'scale(1)',
//       }}
//       onMouseEnter={e => {
//         if (!selected) {
//           e.currentTarget.style.transform = 'translateY(-3px) scale(1.01)';
//           e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)';
//         }
//       }}
//       onMouseLeave={e => {
//         if (!selected) {
//           e.currentTarget.style.transform = 'scale(1)';
//           e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.05)';
//         }
//       }}
//     >
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//           <div style={{
//             width: 42,
//             height: 42,
//             borderRadius: 12,
//             background: 'rgba(34,197,94,0.08)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             fontSize: 22,
//             border: '1px solid rgba(34,197,94,0.15)',
//           }}>
//             {typeIcon[reclamation.type_probleme] || '💬'}
//           </div>
//           <div>
//             <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
//               {reclamation.titre?.length > 38 ? reclamation.titre.slice(0, 38) + '…' : reclamation.titre}
//             </div>
//             <div style={{ fontSize: 12, color: '#6b7280', marginTop: 3, textTransform: 'capitalize' }}>
//               {reclamation.type_probleme}
//             </div>
//           </div>
//         </div>
//         <span style={{
//           fontSize: 11.5,
//           fontWeight: 600,
//           padding: '5px 12px',
//           borderRadius: 999,
//           background: p.bg,
//           color: p.color,
//           border: `1px solid ${p.color}30`,
//           boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
//         }}>
//           {p.label}
//         </span>
//       </div>

//       {/* Progress bar améliorée */}
//       <div style={{ height: 6, background: 'rgba(229,231,235,0.6)', borderRadius: 3, overflow: 'hidden', margin: '12px 0' }}>
//         <div style={{
//           height: '100%',
//           background: 'linear-gradient(to right, #22c55e, #86efac)',
//           width: `${((stepIdx + 1) / 4) * 100}%`,
//           transition: 'width 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
//           boxShadow: '0 1px 6px rgba(34,197,94,0.4)',
//         }} />
//       </div>

//       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280' }}>
//         <span>{new Date(reclamation.created_at).toLocaleDateString('fr-DZ')}</span>
//         <span style={{ color: '#15803d', fontWeight: 500 }}>
//           {statutSteps[stepIdx]?.label}
//         </span>
//       </div>
//     </div>
//   );
// }

// export default function SuiviReclamation({ clientId }) {
//   const [reclamations, setReclamations] = useState([]);
//   const [selected, setSelected]         = useState(null);
//   const [loading, setLoading]           = useState(true);
//   const [filter, setFilter]             = useState('all');

//   const fetchReclamations = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await reclamationsAPI.getAll({
//         client_id: clientId || '6bdcc9ba-523d-4141-b551-307e5f29aaa5',
//         limit: 50,
//       });
//       const data = res.data?.data || res.data || [];
//       setReclamations(Array.isArray(data) ? data : []);
//       if (data.length > 0 && !selected) setSelected(data[0]);
//     } catch {
//       setReclamations([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [clientId]);

//   useEffect(() => { fetchReclamations(); }, [fetchReclamations]);

//   const filtered = reclamations.filter(r => {
//     if (filter === 'all') return true;
//     if (filter === 'open') return ['ouvert', 'en_attente', 'en_cours'].includes(r.statut);
//     if (filter === 'closed') return ['resolu', 'ferme'].includes(r.statut);
//     return true;
//   });

//   const stepIdx = selected ? getStepIndex(selected.statut) : 0;
//   const p = selected ? (prioriteConfig[selected.priorite] || prioriteConfig.normale) : prioriteConfig.normale;

//   return (
//     <div style={{
//       width: '100vw',
//       height: '100vh',
//       background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
//       fontFamily: "'Poppins', sans-serif",
//       overflow: 'hidden',
//       display: 'flex',
//     }}>
//       <style>{`
//         @keyframes pulse {
//           0%, 100% { opacity: 1; transform: scale(1); }
//           50%      { opacity: 0.5; transform: scale(1.3); }
//         }
//         @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
//         @keyframes slideIn { from { opacity:0; transform:translateX(16px); } to { opacity:1; transform:none; } }
//         ::-webkit-scrollbar { width: 5px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
//       `}</style>

//       <ClientSidebar />

//       <div style={{
//         marginLeft: 78,
//         flex: 1,
//         display: 'flex',
//         flexDirection: 'column',
//         height: '100vh',
//         padding: '20px 24px',
//         gap: 16,
//       }}>

//         {/* Topbar premium */}
//         <div style={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           flexShrink: 0,
//           animation: 'fadeUp 0.5s both',
//         }}>
//           <div>
//             <h1 style={{ fontSize: 20, fontWeight: 600, color: '#111827', margin: 0 }}>
//               Suivi des réclamations
//             </h1>
//             <p style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>
//               Suivez l'évolution de vos demandes en temps réel
//             </p>
//           </div>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//             <div style={{ position: 'relative' }}>
//               <button style={{
//                 width: 40,
//                 height: 40,
//                 borderRadius: 12,
//                 background: 'white',
//                 border: '1px solid #e2e8f0',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 cursor: 'pointer',
//                 boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
//               }}>
//                 <svg width="18" height="18" viewBox="0 0 24 24" fill="#22c55e">
//                   <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
//                 </svg>
//               </button>
//               <div style={{
//                 position: 'absolute',
//                 top: -4,
//                 right: -4,
//                 width: 16,
//                 height: 16,
//                 borderRadius: '50%',
//                 background: '#22c55e',
//                 border: '2px solid #f8fafc',
//                 fontSize: 10,
//                 color: 'white',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 fontWeight: 600,
//               }}>2</div>
//             </div>

//             <div style={{
//               width: 40,
//               height: 40,
//               borderRadius: '50%',
//               background: 'linear-gradient(135deg, #22c55e, #16a34a)',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontSize: 15,
//               color: 'white',
//               fontWeight: 600,
//               boxShadow: '0 0 0 4px rgba(34,197,94,0.25)',
//               cursor: 'pointer',
//             }}>C</div>
//           </div>
//         </div>

//         {/* Corps principal */}
//         <div style={{
//           flex: 1,
//           display: 'grid',
//           gridTemplateColumns: 'minmax(0, 0.95fr) minmax(0, 1.45fr)',
//           gap: 20,
//           minHeight: 0,
//         }}>

//           {/* Colonne gauche - Liste */}
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>

//             {/* Filtres + stats */}
//             <div style={{
//               background: 'rgba(255,255,255,0.8)',
//               backdropFilter: 'blur(12px)',
//               borderRadius: 16,
//               padding: '16px 18px',
//               border: '1px solid rgba(229,231,235,0.7)',
//               boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
//               flexShrink: 0,
//             }}>
//               <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
//                 {[['all','Toutes'], ['open','En cours'], ['closed','Résolues']].map(([k, l]) => (
//                   <button
//                     key={k}
//                     onClick={() => setFilter(k)}
//                     style={{
//                       flex: 1,
//                       padding: '8px 0',
//                       borderRadius: 999,
//                       border: 'none',
//                       cursor: 'pointer',
//                       fontSize: 13,
//                       fontWeight: 600,
//                       transition: 'all 0.22s',
//                       background: filter === k ? '#22c55e' : 'rgba(0,0,0,0.04)',
//                       color: filter === k ? 'white' : '#475569',
//                       boxShadow: filter === k ? '0 3px 12px rgba(34,197,94,0.3)' : 'none',
//                     }}
//                   >
//                     {l}
//                   </button>
//                 ))}
//               </div>

//               <div style={{ display: 'flex', gap: 12 }}>
//                 {[
//                   { label: 'Total', value: reclamations.length, color: '#22c55e' },
//                   { label: 'En cours', value: reclamations.filter(r => ['ouvert','en_attente','en_cours'].includes(r.statut)).length, color: '#ea580c' },
//                   { label: 'Résolues', value: reclamations.filter(r => ['resolu','ferme'].includes(r.statut)).length, color: '#3b82f6' },
//                 ].map((s, i) => (
//                   <div key={i} style={{
//                     flex: 1,
//                     background: 'rgba(248,250,252,0.9)',
//                     borderRadius: 12,
//                     padding: '12px 8px',
//                     textAlign: 'center',
//                     border: '1px solid rgba(226,232,240,0.8)',
//                   }}>
//                     <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
//                     <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2 }}>{s.label}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Liste scrollable */}
//             <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
//               {loading ? (
//                 <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b' }}>
//                   <div style={{
//                     width: 48,
//                     height: 48,
//                     border: '5px solid #e2e8f0',
//                     borderTopColor: '#22c55e',
//                     borderRadius: '50%',
//                     animation: 'spin 1s linear infinite',
//                     margin: '0 auto 16px',
//                   }} />
//                   <div style={{ fontSize: 15 }}>Chargement des réclamations...</div>
//                 </div>
//               ) : filtered.length === 0 ? (
//                 <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
//                   <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.4 }}>📋</div>
//                   <div style={{ fontSize: 16, fontWeight: 500 }}>Aucune réclamation pour le moment</div>
//                 </div>
//               ) : (
//                 filtered.map(r => (
//                   <ReclamationCard
//                     key={r.id}
//                     reclamation={r}
//                     selected={selected?.id === r.id}
//                     onClick={() => setSelected(r)}
//                   />
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Colonne droite - Détail + Timeline */}
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minHeight: 0 }}>
//             {!selected ? (
//               <div style={{
//                 flex: 1,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 background: 'rgba(255,255,255,0.75)',
//                 backdropFilter: 'blur(12px)',
//                 borderRadius: 20,
//                 border: '1px solid rgba(229,231,235,0.6)',
//                 boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
//               }}>
//                 <div style={{ textAlign: 'center', color: '#94a3b8' }}>
//                   <div style={{ fontSize: 72, marginBottom: 16, opacity: 0.5 }}>👈</div>
//                   <div style={{ fontSize: 17, fontWeight: 500 }}>Sélectionnez une réclamation</div>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 {/* Détail card */}
//                 <div style={{
//                   background: 'rgba(255,255,255,0.85)',
//                   backdropFilter: 'blur(12px)',
//                   borderRadius: 20,
//                   border: '1px solid rgba(34,197,94,0.2)',
//                   padding: '24px 28px',
//                   boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
//                   animation: 'slideIn 0.5s both',
//                   flexShrink: 0,
//                 }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
//                       <div style={{
//                         width: 52,
//                         height: 52,
//                         borderRadius: 16,
//                         background: 'rgba(34,197,94,0.08)',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         fontSize: 26,
//                         border: '1px solid rgba(34,197,94,0.18)',
//                       }}>
//                         {typeIcon[selected.type_probleme] || '💬'}
//                       </div>
//                       <div>
//                         <div style={{ fontSize: 17, fontWeight: 600, color: '#111827' }}>
//                           {selected.titre}
//                         </div>
//                         <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
//                           {selected.type_probleme} · {new Date(selected.created_at).toLocaleDateString('fr-DZ', { day: 'numeric', month: 'long', year: 'numeric' })}
//                         </div>
//                       </div>
//                     </div>
//                     <span style={{
//                       fontSize: 12.5,
//                       fontWeight: 600,
//                       padding: '6px 14px',
//                       borderRadius: 999,
//                       background: p.bg,
//                       color: p.color,
//                       border: `1px solid ${p.color}40`,
//                     }}>
//                       {p.label}
//                     </span>
//                   </div>

//                   {selected.description && (
//                     <div style={{
//                       background: 'rgba(249,250,251,0.7)',
//                       borderRadius: 14,
//                       padding: '16px 18px',
//                       border: '1px solid rgba(229,231,235,0.7)',
//                       marginTop: 16,
//                     }}>
//                       <div style={{
//                         fontSize: 11.5,
//                         fontWeight: 600,
//                         color: '#475569',
//                         textTransform: 'uppercase',
//                         letterSpacing: 0.6,
//                         marginBottom: 8,
//                       }}>
//                         Description
//                       </div>
//                       <div style={{ fontSize: 14, color: '#1f2937', lineHeight: 1.6 }}>
//                         {selected.description}
//                       </div>
//                     </div>
//                   )}

//                   {selected.region && (
//                     <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, fontSize: 13, color: '#475569' }}>
//                       <span>📍</span> {selected.region}
//                     </div>
//                   )}
//                 </div>

//                 {/* Timeline glass */}
//                 <div style={{
//                   background: 'rgba(255,255,255,0.82)',
//                   backdropFilter: 'blur(14px)',
//                   borderRadius: 20,
//                   border: '1px solid rgba(229,231,235,0.7)',
//                   padding: '24px 28px',
//                   flex: 1,
//                   overflowY: 'auto',
//                   boxShadow: '0 12px 40px rgba(0,0,0,0.07)',
//                   animation: 'slideIn 0.6s 0.1s both',
//                 }}>
//                   <div style={{
//                     fontSize: 13.5,
//                     fontWeight: 600,
//                     color: '#475569',
//                     textTransform: 'uppercase',
//                     letterSpacing: 0.8,
//                     marginBottom: 24,
//                   }}>
//                     Progression de votre demande
//                   </div>

//                   {statutSteps.map((step, i) => (
//                     <TimelineStep
//                       key={step.key}
//                       step={step}
//                       index={i}
//                       currentIndex={stepIdx}
//                       isLast={i === statutSteps.length - 1}
//                     />
//                   ))}

//                   {/* Messages de statut */}
//                   {selected.statut !== 'resolu' && selected.statut !== 'ferme' && (
//                     <div style={{
//                       marginTop: 28,
//                       background: 'rgba(254,249,195,0.4)',
//                       borderRadius: 14,
//                       padding: '16px 18px',
//                       border: '1px solid rgba(250,204,21,0.3)',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: 14,
//                     }}>
//                       <span style={{ fontSize: 28 }}>⏱</span>
//                       <div>
//                         <div style={{ fontSize: 13.5, fontWeight: 600, color: '#854d0e' }}>
//                           Délai estimé
//                         </div>
//                         <div style={{ fontSize: 13, color: '#713f12', marginTop: 3 }}>
//                           {selected.priorite === 'urgente' ? 'Moins de 2 heures' :
//                            selected.priorite === 'haute'   ? 'Sous 24 heures' :
//                            '24 à 48 heures'}
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {(selected.statut === 'resolu' || selected.statut === 'ferme') && (
//                     <div style={{
//                       marginTop: 28,
//                       background: 'rgba(240,253,244,0.6)',
//                       borderRadius: 14,
//                       padding: '16px 18px',
//                       border: '1px solid rgba(134,239,172,0.5)',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: 14,
//                     }}>
//                       <span style={{ fontSize: 28 }}>🎉</span>
//                       <div>
//                         <div style={{ fontSize: 13.5, fontWeight: 600, color: '#065f46' }}>
//                           Réclamation résolue avec succès
//                         </div>
//                         <div style={{ fontSize: 13, color: '#064e3b', marginTop: 3 }}>
//                           Merci de votre confiance
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   <button
//                     onClick={fetchReclamations}
//                     style={{
//                       marginTop: 24,
//                       width: '100%',
//                       padding: '14px',
//                       background: 'white',
//                       border: '1.5px solid #d1fae5',
//                       borderRadius: 999,
//                       cursor: 'pointer',
//                       fontSize: 13.5,
//                       fontWeight: 600,
//                       color: '#15803d',
//                       transition: 'all 0.22s',
//                       boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
//                     }}
//                     onMouseEnter={e => {
//                       e.currentTarget.style.background = '#f0fdf4';
//                       e.currentTarget.style.borderColor = '#22c55e';
//                       e.currentTarget.style.boxShadow = '0 6px 20px rgba(34,197,94,0.15)';
//                     }}
//                     onMouseLeave={e => {
//                       e.currentTarget.style.background = 'white';
//                       e.currentTarget.style.borderColor = '#d1fae5';
//                       e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
//                     }}
//                   >
//                     ↻ Actualiser le statut
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// import { useState, useEffect, useCallback } from 'react';
// import ClientSidebar from '../../components/client/ClientSidebar';
// import { reclamationsAPI } from '../../services/api';

// const statutSteps = [
//   { key: 'ouvert',      label: 'Soumise',       icon: '📥', color: '#6b7280' },
//   { key: 'en_attente',  label: 'En attente',    icon: '⏳', color: '#f59e0b' },
//   { key: 'en_cours',    label: 'En traitement', icon: '🔧', color: '#3b82f6' },
//   { key: 'resolu',      label: 'Résolue',       icon: '🎯', color: '#10b981' },
// ];

// function getStepIndex(statut) {
//   const map = { ouvert: 0, en_attente: 1, en_cours: 2, resolu: 3, ferme: 3 };
//   return map[statut] ?? 0;
// }

// function StatusStepper({ currentStep }) {
//   return (
//     <div style={{
//       display: 'flex',
//       justifyContent: 'space-between',
//       maxWidth: 700,
//       margin: '0 auto 32px',
//       position: 'relative',
//     }}>
//       <div style={{
//         position: 'absolute',
//         top: 20,
//         left: '10%',
//         right: '10%',
//         height: 4,
//         background: 'linear-gradient(to right, #e5e7eb 0%, #e5e7eb 100%)',
//         borderRadius: 2,
//       }}>
//         <div style={{
//           height: '100%',
//           width: `${(currentStep / (statutSteps.length - 1)) * 100}%`,
//           background: 'linear-gradient(to right, #10b981, #34d399)',
//           borderRadius: 2,
//           transition: 'width 0.7s ease',
//         }} />
//       </div>

//       {statutSteps.map((step, i) => {
//         const active = i === currentStep;
//         const done = i <= currentStep;

//         return (
//           <div key={step.key} style={{
//             textAlign: 'center',
//             position: 'relative',
//             zIndex: 1,
//           }}>
//             <div style={{
//               width: 56,
//               height: 56,
//               margin: '0 auto 8px',
//               borderRadius: '50%',
//               background: active ? '#10b981' : done ? '#ecfdf5' : '#f3f4f6',
//               border: active ? '4px solid #6ee7b7' : done ? '3px solid #a7f3d0' : '3px solid #d1d5db',
//               boxShadow: active ? '0 0 0 8px rgba(16,185,129,0.25)' : 'none',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontSize: 24,
//               color: active || done ? '#065f46' : '#9ca3af',
//               transition: 'all 0.4s',
//             }}>
//               {done && !active ? '✓' : step.icon}
//             </div>
//             <div style={{
//               fontSize: 13,
//               fontWeight: active ? 600 : 500,
//               color: active ? '#065f46' : done ? '#10b981' : '#6b7280',
//             }}>
//               {step.label}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// function ReclamationItem({ rec, isSelected, onSelect }) {
//   const prio = {
//     urgente: { bg: '#fee2e2', text: '#b91c1c', label: 'Urgente' },
//     haute:   { bg: '#fef3c7', text: '#b45309', label: 'Haute' },
//     normale: { bg: '#dbeafe', text: '#1d4ed8', label: 'Normale' },
//     basse:   { bg: '#d1fae5', text: '#065f46', label: 'Basse' },
//   }[rec.priorite] || { bg: '#f3f4f6', text: '#4b5563', label: '—' };

//   return (
//     <div
//       onClick={() => onSelect(rec)}
//       style={{
//         padding: '16px 20px',
//         borderRadius: 16,
//         background: isSelected ? 'rgba(16,185,129,0.08)' : 'white',
//         border: `1px solid ${isSelected ? '#10b981' : '#e5e7eb'}`,
//         marginBottom: 12,
//         cursor: 'pointer',
//         transition: 'all 0.22s ease',
//         boxShadow: isSelected ? '0 6px 20px rgba(16,185,129,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
//         transform: isSelected ? 'translateX(8px)' : 'none',
//       }}
//     >
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 16 }}>
//         <div style={{ flex: 1 }}>
//           <div style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 4 }}>
//             {rec.titre}
//           </div>
//           <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
//             {rec.type_probleme} • {new Date(rec.created_at).toLocaleDateString('fr-FR', {
//               day: 'numeric', month: 'short', year: 'numeric'
//             })}
//           </div>
//         </div>

//         <div style={{
//           padding: '6px 12px',
//           borderRadius: 999,
//           background: prio.bg,
//           color: prio.text,
//           fontSize: 12,
//           fontWeight: 600,
//           whiteSpace: 'nowrap',
//         }}>
//           {prio.label}
//         </div>
//       </div>

//       <div style={{
//         marginTop: 12,
//         fontSize: 13,
//         color: '#10b981',
//         fontWeight: 500,
//       }}>
//         {statutSteps[getStepIndex(rec.statut)].label}
//       </div>
//     </div>
//   );
// }

// export default function SuiviReclamation({ clientId }) {
//   const [reclamations, setReclamations] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState('all');

//   const fetchReclamations = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await reclamationsAPI.getAll({
//         client_id: clientId || '6bdcc9ba-523d-4141-b551-307e5f29aaa5',
//         limit: 50,
//       });
//       const data = res.data?.data || res.data || [];
//       setReclamations(Array.isArray(data) ? data : []);
//       if (data.length > 0 && !selected) setSelected(data[0]);
//     } catch (err) {
//       console.error(err);
//       setReclamations([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [clientId, selected]);

//   useEffect(() => {
//     fetchReclamations();
//   }, [fetchReclamations]);

//   const filteredReclamations = reclamations.filter(r => {
//     if (filter === 'all') return true;
//     if (filter === 'open') return !['resolu', 'ferme'].includes(r.statut);
//     if (filter === 'closed') return ['resolu', 'ferme'].includes(r.statut);
//     return true;
//   });

//   const currentStep = selected ? getStepIndex(selected.statut) : 0;

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',
//       fontFamily: "'Poppins', system-ui, sans-serif",
//       display: 'flex',
//     }}>
//       <ClientSidebar />

//       <main style={{ 
//         marginLeft: 80, 
//         flex: 1, 
//         padding: '32px 40px',
//         maxWidth: 1400,
//         margin: '0 auto',
//         width: '100%',
//       }}>
//         <header style={{ marginBottom: 40 }}>
//           <h1 style={{ fontSize: 28, fontWeight: 600, color: '#111827', margin: 0 }}>
//             Mes réclamations
//           </h1>
//           <p style={{ color: '#64748b', fontSize: 15, marginTop: 6 }}>
//             Suivi en temps réel de vos demandes
//           </p>
//         </header>

//         {/* Filtres rapides */}
//         <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
//           {['all', 'open', 'closed'].map(key => (
//             <button
//               key={key}
//               onClick={() => setFilter(key)}
//               style={{
//                 padding: '10px 20px',
//                 borderRadius: 999,
//                 border: 'none',
//                 background: filter === key ? '#10b981' : '#e5e7eb',
//                 color: filter === key ? 'white' : '#475569',
//                 fontWeight: 500,
//                 cursor: 'pointer',
//                 transition: 'all 0.2s',
//               }}
//             >
//               {key === 'all' ? 'Toutes' : key === 'open' ? 'En cours' : 'Résolues'}
//             </button>
//           ))}

//           <button
//             onClick={fetchReclamations}
//             style={{
//               marginLeft: 'auto',
//               padding: '10px 20px',
//               border: '1px solid #d1fae5',
//               background: 'white',
//               borderRadius: 999,
//               color: '#10b981',
//               fontWeight: 500,
//               cursor: 'pointer',
//             }}
//           >
//             ↻ Actualiser
//           </button>
//         </div>

//         {loading ? (
//           <div style={{ textAlign: 'center', padding: 80 }}>
//             <div style={{
//               width: 60,
//               height: 60,
//               border: '6px solid #e5e7eb',
//               borderTopColor: '#10b981',
//               borderRadius: '50%',
//               animation: 'spin 1s linear infinite',
//               margin: '0 auto 20px',
//             }} />
//             <div style={{ color: '#64748b', fontSize: 16 }}>Chargement...</div>
//           </div>
//         ) : filteredReclamations.length === 0 ? (
//           <div style={{ textAlign: 'center', padding: 80, color: '#94a3b8' }}>
//             <div style={{ fontSize: 80, marginBottom: 16 }}>📭</div>
//             <div style={{ fontSize: 18, fontWeight: 500 }}>Aucune réclamation{filter !== 'all' ? ` (${filter})` : ''}</div>
//           </div>
//         ) : (
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
//             {/* Liste des réclamations */}
//             <div>
//               <div style={{ fontSize: 17, fontWeight: 600, color: '#111827', marginBottom: 16 }}>
//                 Vos demandes ({filteredReclamations.length})
//               </div>
//               {filteredReclamations.map(rec => (
//                 <ReclamationItem
//                   key={rec.id}
//                   rec={rec}
//                   isSelected={selected?.id === rec.id}
//                   onSelect={setSelected}
//                 />
//               ))}
//             </div>

//             {/* Détail sélectionné */}
//             {selected ? (
//               <div>
//                 <div style={{
//                   background: 'white',
//                   borderRadius: 20,
//                   padding: 32,
//                   boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
//                   border: '1px solid #e5e7eb',
//                 }}>
//                   <StatusStepper currentStep={currentStep} />

//                   <div style={{ marginBottom: 24 }}>
//                     <div style={{ fontSize: 22, fontWeight: 600, color: '#111827', marginBottom: 8 }}>
//                       {selected.titre}
//                     </div>
//                     <div style={{ color: '#64748b', fontSize: 14, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
//                       <span>{selected.type_probleme}</span>
//                       <span>•</span>
//                       <span>Créée le {new Date(selected.created_at).toLocaleDateString('fr-FR', {
//                         day: 'numeric', month: 'long', year: 'numeric'
//                       })}</span>
//                       {selected.region && (
//                         <>
//                           <span>•</span>
//                           <span>📍 {selected.region}</span>
//                         </>
//                       )}
//                     </div>
//                   </div>

//                   {selected.description && (
//                     <div style={{
//                       background: '#f8fafc',
//                       padding: 20,
//                       borderRadius: 12,
//                       border: '1px solid #e5e7eb',
//                       marginBottom: 24,
//                       lineHeight: 1.6,
//                       color: '#1f2937',
//                     }}>
//                       {selected.description}
//                     </div>
//                   )}

//                   {/* Message de statut final */}
//                   {(currentStep >= 3) ? (
//                     <div style={{
//                       background: '#ecfdf5',
//                       border: '1px solid #a7f3d0',
//                       borderRadius: 12,
//                       padding: 20,
//                       textAlign: 'center',
//                       color: '#065f46',
//                     }}>
//                       <div style={{ fontSize: 20, marginBottom: 8 }}>✓ Réclamation traitée avec succès</div>
//                       <div>Merci d’avoir utilisé notre service</div>
//                     </div>
//                   ) : (
//                     <div style={{
//                       background: '#fefce8',
//                       border: '1px solid #fef08a',
//                       borderRadius: 12,
//                       padding: 20,
//                       color: '#713f12',
//                     }}>
//                       <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
//                         Estimation restante : 
//                         {selected.priorite === 'urgente' ? ' < 4h' :
//                          selected.priorite === 'haute' ? ' 12–24h' : ' 24–72h'}
//                       </div>
//                       <div style={{ fontSize: 14 }}>Nous vous tenons informé·e dès qu’il y a du nouveau.</div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ) : (
//               <div style={{
//                 background: 'white',
//                 borderRadius: 20,
//                 padding: 40,
//                 textAlign: 'center',
//                 color: '#94a3b8',
//                 height: 'fit-content',
//                 boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
//               }}>
//                 <div style={{ fontSize: 80, marginBottom: 16 }}>👈</div>
//                 <div style={{ fontSize: 18, fontWeight: 500 }}>
//                   Sélectionnez une réclamation pour voir les détails
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </main>

//       <style>{`
//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// }


import { useState, useEffect, useCallback } from 'react';
import ClientSidebar from '../../components/client/ClientSidebar';
import { reclamationsAPI } from '../../services/api';

const statutSteps = [
  { key: 'ouvert',      label: 'Soumise',       icon: '📥', color: '#6b7280' },
  { key: 'en_attente',  label: 'En attente',    icon: '⏳', color: '#f59e0b' },
  { key: 'en_cours',    label: 'En traitement', icon: '🔧', color: '#3b82f6' },
  { key: 'resolu',      label: 'Résolue',       icon: '🎯', color: '#10b981' },
];

function getStepIndex(statut) {
  const map = { ouvert: 0, en_attente: 1, en_cours: 2, resolu: 3, ferme: 3 };
  return map[statut] ?? 0;
}

function StatusStepper({ currentStep }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      maxWidth: 700,
      margin: '0 auto 32px',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        top: 20,
        left: '10%',
        right: '10%',
        height: 4,
        background: 'linear-gradient(to right, #e5e7eb 0%, #e5e7eb 100%)',
        borderRadius: 2,
      }}>
        <div style={{
          height: '100%',
          width: `${(currentStep / (statutSteps.length - 1)) * 100}%`,
          background: 'linear-gradient(to right, #10b981, #34d399)',
          borderRadius: 2,
          transition: 'width 0.7s ease',
        }} />
      </div>

      {statutSteps.map((step, i) => {
        const active = i === currentStep;
        const done = i <= currentStep;

        return (
          <div key={step.key} style={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}>
            <div style={{
              width: 56,
              height: 56,
              margin: '0 auto 8px',
              borderRadius: '50%',
              background: active ? '#10b981' : done ? '#ecfdf5' : '#f3f4f6',
              border: active ? '4px solid #6ee7b7' : done ? '3px solid #a7f3d0' : '3px solid #d1d5db',
              boxShadow: active ? '0 0 0 8px rgba(16,185,129,0.25)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              color: active || done ? '#065f46' : '#9ca3af',
              transition: 'all 0.4s',
            }}>
              {done && !active ? '✓' : step.icon}
            </div>
            <div style={{
              fontSize: 13,
              fontWeight: active ? 600 : 500,
              color: active ? '#065f46' : done ? '#10b981' : '#6b7280',
            }}>
              {step.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ReclamationItem({ rec, isSelected, onSelect }) {
  const prio = {
    urgente: { bg: '#fee2e2', text: '#b91c1c', label: 'Urgente' },
    haute:   { bg: '#fef3c7', text: '#b45309', label: 'Haute' },
    normale: { bg: '#dbeafe', text: '#1d4ed8', label: 'Normale' },
    basse:   { bg: '#d1fae5', text: '#065f46', label: 'Basse' },
  }[rec.priorite] || { bg: '#f3f4f6', text: '#4b5563', label: '—' };

  return (
    <div
      onClick={() => onSelect(rec)}
      style={{
        padding: '16px 20px',
        borderRadius: 16,
        background: isSelected ? 'rgba(16,185,129,0.08)' : 'white',
        border: `1px solid ${isSelected ? '#10b981' : '#e5e7eb'}`,
        marginBottom: 12,
        cursor: 'pointer',
        transition: 'all 0.22s ease',
        boxShadow: isSelected ? '0 6px 20px rgba(16,185,129,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
        transform: isSelected ? 'translateX(8px)' : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 4 }}>
            {rec.titre}
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
            {rec.type_probleme} • {new Date(rec.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'short', year: 'numeric'
            })}
          </div>
        </div>

        <div style={{
          padding: '6px 12px',
          borderRadius: 999,
          background: prio.bg,
          color: prio.text,
          fontSize: 12,
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}>
          {prio.label}
        </div>
      </div>

      <div style={{
        marginTop: 12,
        fontSize: 13,
        color: '#10b981',
        fontWeight: 500,
      }}>
        {statutSteps[getStepIndex(rec.statut)].label}
      </div>
    </div>
  );
}

export default function SuiviReclamation({ clientId }) {
  const [reclamations, setReclamations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchReclamations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reclamationsAPI.getAll({
        client_id: clientId || '6bdcc9ba-523d-4141-b551-307e5f29aaa5',
        limit: 50,
      });
      const data = res.data?.data || res.data || [];
      setReclamations(Array.isArray(data) ? data : []);
      if (data.length > 0 && !selected) setSelected(data[0]);
    } catch (err) {
      console.error(err);
      setReclamations([]);
    } finally {
      setLoading(false);
    }
  }, [clientId, selected]);

  useEffect(() => {
    fetchReclamations();
  }, [fetchReclamations]);

  const filteredReclamations = reclamations.filter(r => {
    if (filter === 'all') return true;
    if (filter === 'open') return !['resolu', 'ferme'].includes(r.statut);
    if (filter === 'closed') return ['resolu', 'ferme'].includes(r.statut);
    return true;
  });

  const currentStep = selected ? getStepIndex(selected.statut) : 0;

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',
      fontFamily: "'Poppins', system-ui, sans-serif",
      overflow: 'hidden',           // empêche tout débordement de la page entière
      display: 'flex',
    }}>
      <ClientSidebar /> {/* supposée fixed ou width fixe ~80px */}

      <main style={{
        marginLeft: 80,               // espace fixe pour la sidebar → pas de chevauchement
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',           // bloque le scroll global
      }}>
        <header style={{ 
          padding: '24px 32px 16px',
          flexShrink: 0,
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
        }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#111827', margin: 0 }}>
            Mes réclamations
          </h1>
          <p style={{ color: '#64748b', fontSize: 15, marginTop: 6 }}>
            Suivi en temps réel de vos demandes
          </p>
        </header>

        {/* Filtres + bouton actualiser */}
        <div style={{
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          flexShrink: 0,
        }}>
          {['all', 'open', 'closed'].map(key => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: '8px 20px',
                borderRadius: 999,
                border: 'none',
                background: filter === key ? '#10b981' : '#e5e7eb',
                color: filter === key ? 'white' : '#475569',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {key === 'all' ? 'Toutes' : key === 'open' ? 'En cours' : 'Résolues'}
            </button>
          ))}

          <button
            onClick={fetchReclamations}
            style={{
              marginLeft: 'auto',
              padding: '8px 20px',
              border: '1px solid #d1fae5',
              background: 'white',
              borderRadius: 999,
              color: '#10b981',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            ↻ Actualiser
          </button>
        </div>

        {/* Contenu principal avec scroll uniquement sur la liste */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 32,
          overflow: 'hidden',
          padding: '24px 32px',
        }}>
          {/* Colonne liste des réclamations → avec scroll */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            <div style={{
              fontSize: 17,
              fontWeight: 600,
              color: '#111827',
              marginBottom: 16,
              flexShrink: 0,
            }}>
              Vos demandes ({filteredReclamations.length})
            </div>

            <div style={{
              flex: 1,
              overflowY: 'auto',              // ← ici la barre de défilement apparaît quand nécessaire
              paddingRight: 8,                // espace pour la scrollbar
            }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: 60 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    border: '5px solid #e5e7eb',
                    borderTopColor: '#10b981',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 16px',
                  }} />
                  Chargement...
                </div>
              ) : filteredReclamations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
                  Aucune réclamation
                </div>
              ) : (
                filteredReclamations.map(rec => (
                  <ReclamationItem
                    key={rec.id}
                    rec={rec}
                    isSelected={selected?.id === rec.id}
                    onSelect={setSelected}
                  />
                ))
              )}
            </div>
          </div>

          {/* Colonne détail (scroll si contenu très long) */}
          <div style={{ overflowY: 'auto', paddingRight: 8 }}>
            {selected ? (
              <div style={{
                background: 'white',
                borderRadius: 20,
                padding: 32,
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                border: '1px solid #e5e7eb',
              }}>
                <StatusStepper currentStep={currentStep} />

                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 22, fontWeight: 600, color: '#111827', marginBottom: 8 }}>
                    {selected.titre}
                  </div>
                  <div style={{ color: '#64748b', fontSize: 14, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <span>{selected.type_probleme}</span>
                    <span>•</span>
                    <span>Créée le {new Date(selected.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}</span>
                    {selected.region && (
                      <>
                        <span>•</span>
                        <span>📍 {selected.region}</span>
                      </>
                    )}
                  </div>
                </div>

                {selected.description && (
                  <div style={{
                    background: '#f8fafc',
                    padding: 20,
                    borderRadius: 12,
                    border: '1px solid #e5e7eb',
                    marginBottom: 24,
                    lineHeight: 1.6,
                    color: '#1f2937',
                  }}>
                    {selected.description}
                  </div>
                )}

                {(currentStep >= 3) ? (
                  <div style={{
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    borderRadius: 12,
                    padding: 20,
                    textAlign: 'center',
                    color: '#065f46',
                  }}>
                    <div style={{ fontSize: 20, marginBottom: 8 }}>✓ Réclamation traitée avec succès</div>
                    <div>Merci d’avoir utilisé notre service</div>
                  </div>
                ) : (
                  <div style={{
                    background: '#fefce8',
                    border: '1px solid #fef08a',
                    borderRadius: 12,
                    padding: 20,
                    color: '#713f12',
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
                      Estimation restante : 
                      {selected.priorite === 'urgente' ? ' < 4h' :
                       selected.priorite === 'haute' ? ' 12–24h' : ' 24–72h'}
                    </div>
                    <div style={{ fontSize: 14 }}>Nous vous tenons informé·e dès qu’il y a du nouveau.</div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                background: 'white',
                borderRadius: 20,
                padding: 40,
                textAlign: 'center',
                color: '#94a3b8',
                boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
              }}>
                <div style={{ fontSize: 80, marginBottom: 16 }}>👈</div>
                <div style={{ fontSize: 18, fontWeight: 500 }}>
                  Sélectionnez une réclamation pour voir les détails
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </div>
  );
}