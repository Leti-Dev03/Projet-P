// import { useState } from 'react';
// import ClientSidebar from '../../components/client/ClientSidebar';
// import { reclamationsAPI } from '../../services/api';

// const TYPES = ['connexion', 'facturation', 'equipement', 'service', 'autre'];

// export default function ClientReclamation({ clientId }) {
//   const [form, setForm]         = useState({ nom:'', prenom:'', adresse:'', type_probleme:'', description:'' });
//   const [loading, setLoading]   = useState(false);
//   const [success, setSuccess]   = useState(false);
//   const [error, setError]       = useState('');
//   const [typeOpen, setTypeOpen] = useState(false);

//   const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

//   const handleSubmit = async () => {
//     if (!form.nom || !form.prenom || !form.type_probleme || !form.description) {
//       setError('Veuillez remplir tous les champs obligatoires'); return;
//     }
//     setLoading(true); setError('');
//     try {
//       await reclamationsAPI.create({
//         client_id: clientId || '6bdcc9ba-523d-4141-b551-307e5f29aaa5',
//         titre: `${form.type_probleme} — ${form.nom} ${form.prenom}`,
//         description: form.description,
//         type_probleme: form.type_probleme,
//         priorite: 'normale',
//         adresse_probleme: form.adresse,
//       });
//       setSuccess(true);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Erreur lors de l\'envoi');
//     } finally { setLoading(false); }
//   };

//   return (
//     <div style={{
//       width: '100vw', height: '100vh',
//       background: '#FAFAFA',
//       fontFamily: "'Poppins', sans-serif",
//       overflow: 'hidden',
//     }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
//         * { box-sizing:border-box; margin:0; padding:0; }
//         @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
//         @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
//         @keyframes bounceIn { 0%{transform:scale(0.3);opacity:0} 50%{transform:scale(1.05)} 70%{transform:scale(0.9)} 100%{transform:scale(1);opacity:1} }
//         @keyframes spin     { to{transform:rotate(360deg)} }
//         @keyframes mapFloat { 0%,100%{transform:translate(-50%,-55%)} 50%{transform:translate(-50%,-65%)} }

//         .ri { width:100%; background:#fff; border:1.5px solid #E8E8E8; border-radius:50px; padding:11px 20px; font-size:13px; font-family:'Nunito',sans-serif; color:#333; outline:none; transition:all 0.2s; box-shadow:0 1px 4px rgba(0,0,0,0.05); }
//         .ri:focus { border-color:#4CAF50; box-shadow:0 0 0 3px rgba(76,175,80,0.1); }
//         .ri::placeholder { color:#C0C0C0; font-size:12px; }

//         .rt { width:100%; background:#fff; border:1.5px solid #E8E8E8; border-radius:16px; padding:11px 20px; font-size:13px; font-family:'Nunito',sans-serif; color:#333; outline:none; resize:none; transition:all 0.2s; box-shadow:0 1px 4px rgba(0,0,0,0.05); }
//         .rt:focus { border-color:#4CAF50; box-shadow:0 0 0 3px rgba(76,175,80,0.1); }
//         .rt::placeholder { color:#C0C0C0; font-size:12px; }

//         .sb { background:#4CAF50; border:none; border-radius:50px; color:#fff; font-family:'Nunito',sans-serif; font-size:14px; font-weight:700; padding:12px 0; width:100%; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 12px rgba(76,175,80,0.35); }
//         .sb:hover:not(:disabled) { background:#43A047; transform:translateY(-1px); }
//         .sb:disabled { opacity:0.7; cursor:not-allowed; }

//         .cb { display:flex; align-items:center; justify-content:center; gap:6px; background:#4CAF50; border:none; border-radius:50px; color:#fff; padding:10px 0; flex:1; font-family:'Nunito',sans-serif; font-size:14px; font-weight:700; cursor:pointer; transition:all 0.2s; box-shadow:0 3px 10px rgba(76,175,80,0.3); }
//         .cb:hover { background:#43A047; transform:translateY(-1px); }

//         .to { padding:10px 18px; cursor:pointer; font-size:13px; color:#555; transition:all 0.15s; text-transform:capitalize; }
//         .to:hover { background:#F5FBF5; color:#4CAF50; padding-left:24px; }
//         .to.sel { background:#F5FBF5; color:#4CAF50; font-weight:700; }
//         .fl { font-size:12px; font-weight:700; color:#444; margin-bottom:6px; display:block; }
//       `}</style>

//       {/* Sidebar flottante */}
//       <ClientSidebar />

//       {/* Zone principale */}
//       <div style={{
//         marginLeft: 84,
//         height: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//         padding: '20px 24px',
//       }}>

//         {/* ── TOPBAR : profil + messages EN DEHORS de la card ── */}
//         <div style={{
//           display: 'flex',
//           justifyContent: 'flex-end',
//           alignItems: 'center',
//           gap: 12,
//           marginBottom: 16,
//           flexShrink: 0,
//           animation: 'fadeUp 0.3s both',
//         }}>
//           {/* Message */}
//           <div style={{
//             width: 38, height: 38, borderRadius: 10,
//             background: '#fff', display: 'flex',
//             alignItems: 'center', justifyContent: 'center',
//             fontSize: 17, cursor: 'pointer', position: 'relative',
//             boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'transform 0.2s',
//           }}
//             onMouseEnter={e => e.currentTarget.style.transform='scale(1.08)'}
//             onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
//           >
//             💬
//             <div style={{ position:'absolute', top:-3, right:-3, width:15, height:15, borderRadius:'50%', background:'#4CAF50', border:'2px solid #FAFAFA', fontSize:8, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>2</div>
//           </div>

//           {/* Profil */}
//           <div style={{
//             display: 'flex', alignItems: 'center', gap: 10,
//             cursor: 'pointer', background: '#fff',
//             borderRadius: 14, padding: '7px 14px 7px 10px',
//             boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
//             transition: 'box-shadow 0.2s',
//           }}
//             onMouseEnter={e => e.currentTarget.style.boxShadow='0 4px 14px rgba(0,0,0,0.12)'}
//             onMouseLeave={e => e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'}
//           >
//             <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#4CAF50,#2E7D32)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, color:'#fff', boxShadow:'0 2px 6px rgba(76,175,80,0.4)' }}>👤</div>
//             <div>
//               <div style={{ fontSize:12, fontWeight:700, color:'#2D4A2D' }}>Mon Compte</div>
//               <div style={{ fontSize:10, color:'#8AAA8A' }}>Client</div>
//             </div>
//           </div>
//         </div>

//         {/* ── CARD RÉCLAMATION ── */}
//         <div style={{
//           flex: 1,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}>
//           {success ? (
//             <div style={{ textAlign:'center', animation:'fadeIn 0.4s both' }}>
//               <div style={{ fontSize:72, marginBottom:16, animation:'bounceIn 0.6s both' }}>✅</div>
//               <div style={{ fontSize:22, fontWeight:800, color:'#4CAF50', marginBottom:8 }}>Réclamation envoyée !</div>
//               <div style={{ fontSize:14, color:'#888', marginBottom:24 }}>Un agent vous contactera sous 24h.</div>
//               <button className="sb" style={{ maxWidth:220, margin:'0 auto', display:'block' }}
//                 onClick={() => { setSuccess(false); setForm({ nom:'', prenom:'', adresse:'', type_probleme:'', description:'' }); }}>
//                 Nouvelle réclamation
//               </button>
//             </div>
//           ) : (
//             <div style={{
//               background: '#fff',
//               borderRadius: 20,
//               border: '2px solid #B8DDB8',
//               boxShadow: '0 4px 24px rgba(76,175,80,0.08)',
//               width: '100%',
//               maxWidth: 860,
//               padding: '26px 28px 24px',
//               animation: 'fadeUp 0.4s 0.1s both',
//             }}>
//               {/* Header card */}
//               <div style={{ textAlign:'center', marginBottom:20 }}>
//                 <span style={{ fontSize:14, color:'#4CAF50', fontWeight:700, textDecoration:'underline', cursor:'pointer' }}>
//                   Déposez votre réclamation ici ou appelez-nous directement.
//                 </span>
//               </div>

//               {error && (
//                 <div style={{ background:'#FEE2E2', borderRadius:10, padding:'9px 16px', marginBottom:16, fontSize:12, color:'#DC2626' }}>
//                   ⚠️ {error}
//                 </div>
//               )}

//               {/* Grille 50/50 */}
//               <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>

//                 {/* GAUCHE — champs */}
//                 <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
//                   <div>
//                     <span className="fl">Nom</span>
//                     <input className="ri" placeholder="Entrer votre nom" value={form.nom} onChange={e=>set('nom',e.target.value)}/>
//                   </div>
//                   <div>
//                     <span className="fl">Prénom</span>
//                     <input className="ri" placeholder="Entrer votre prénom" value={form.prenom} onChange={e=>set('prenom',e.target.value)}/>
//                   </div>
//                   <div>
//                     <span className="fl">Adresse</span>
//                     <input className="ri" placeholder="Entrer votre adresse" value={form.adresse} onChange={e=>set('adresse',e.target.value)}/>
//                   </div>
//                   <div style={{ position:'relative' }}>
//                     <span className="fl">Type problème</span>
//                     <div className="ri" style={{ cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between' }}
//                       onClick={() => setTypeOpen(o=>!o)}>
//                       <span style={{ color:form.type_probleme?'#333':'#C0C0C0', fontSize:12, textTransform:'capitalize' }}>
//                         {form.type_probleme || 'Sélectionner un type'}
//                       </span>
//                       <span style={{ color:'#C0C0C0', fontSize:10, transition:'transform 0.2s', transform:typeOpen?'rotate(180deg)':'none' }}>▼</span>
//                     </div>
//                     {typeOpen && (
//                       <div style={{
//                         position:'absolute', top:'100%', left:0, right:0, zIndex:200,
//                         background:'#fff', borderRadius:14, marginTop:4,
//                         boxShadow:'0 8px 24px rgba(0,0,0,0.10)',
//                         border:'1px solid #E8E8E8', overflow:'hidden',
//                         animation:'fadeUp 0.2s both',
//                       }}>
//                         {TYPES.map(t => (
//                           <div key={t} className={`to ${form.type_probleme===t?'sel':''}`}
//                             onClick={()=>{ set('type_probleme',t); setTypeOpen(false); }}>
//                             {form.type_probleme===t&&'✓ '}{t}
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                   <div>
//                     <span className="fl">Description</span>
//                     <textarea className="rt" rows={4} placeholder="Écrire le problème..."
//                       value={form.description} onChange={e=>set('description',e.target.value)}/>
//                   </div>
//                 </div>

//                 {/* DROITE — appel + carte + bouton */}
//                 <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
//                   <div style={{ background:'#fff', borderRadius:16, padding:'14px 16px', boxShadow:'0 2px 12px rgba(0,0,0,0.07)', border:'1px solid #F0F0F0' }}>
//                     <div style={{ fontSize:13, fontWeight:800, color:'#222', textAlign:'center', marginBottom:10 }}>appelez-nous</div>
//                     <div style={{ display:'flex', gap:10 }}>
//                       <button className="cb">📞 12</button>
//                       <button className="cb">📞 101</button>
//                     </div>
//                   </div>

//                   <div style={{ borderRadius:16, overflow:'hidden', height:200, position:'relative', boxShadow:'0 4px 16px rgba(0,0,0,0.10)', flexShrink:0 }}>
//                     <iframe
//                       title="map"
//                       src="https://www.openstreetmap.org/export/embed.html?bbox=2.9%2C36.6%2C3.3%2C36.9&layer=mapnik"
//                       style={{ width:'100%', height:'100%', border:'none', display:'block' }}
//                       loading="lazy"
//                     />
//                     <div style={{ position:'absolute', top:'50%', left:'50%', fontSize:22, pointerEvents:'none', filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.3))', animation:'mapFloat 2s ease-in-out infinite' }}>📍</div>
//                   </div>

//                   <button className="sb" onClick={handleSubmit} disabled={loading}>
//                     {loading ? (
//                       <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
//                         <span style={{ width:13, height:13, border:'2px solid #fff4', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite', display:'inline-block' }}/>
//                         Envoi…
//                       </span>
//                     ) : 'Soumettre'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // import { useState } from 'react';
// // import ClientSidebar from '../../components/client/ClientSidebar';
// // import { reclamationsAPI } from '../../services/api';

// // const TYPES = [
// //   { value:'connexion',   label:'Problème de connexion' },
// //   { value:'facturation', label:'Erreur de facturation' },
// //   { value:'equipement',  label:'Équipement défectueux' },
// //   { value:'service',     label:'Service indisponible' },
// //   { value:'autre',       label:'Autre problème' },
// // ];

// // export default function ClientReclamation({ clientId }) {
// //   const [form, setForm]         = useState({ nom:'', prenom:'', adresse:'', type_probleme:'', description:'' });
// //   const [loading, setLoading]   = useState(false);
// //   const [success, setSuccess]   = useState(false);
// //   const [error, setError]       = useState('');
// //   const [typeOpen, setTypeOpen] = useState(false);
// //   const [focused, setFocused]   = useState('');

// //   const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

// //   const handleSubmit = async () => {
// //     if (!form.nom || !form.prenom || !form.type_probleme || !form.description) {
// //       setError('Veuillez remplir tous les champs obligatoires'); return;
// //     }
// //     setLoading(true); setError('');
// //     try {
// //       await reclamationsAPI.create({
// //         client_id: clientId || '6bdcc9ba-523d-4141-b551-307e5f29aaa5',
// //         titre: `${form.type_probleme} — ${form.nom} ${form.prenom}`,
// //         description: form.description,
// //         type_probleme: form.type_probleme,
// //         priorite: 'normale',
// //         adresse_probleme: form.adresse,
// //       });
// //       setSuccess(true);
// //     } catch (err) {
// //       setError(err.response?.data?.error || 'Erreur lors de l\'envoi');
// //     } finally { setLoading(false); }
// //   };

// //   const selectedType = TYPES.find(t => t.value === form.type_probleme);

// //   return (
// //     <div style={{ width:'100vw', height:'100vh', background:'#F2F4F2', fontFamily:"'Segoe UI',system-ui,sans-serif", overflow:'hidden', display:'flex' }}>
// //       <style>{`
// //         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
// //         * { box-sizing:border-box; margin:0; padding:0; }
// //         @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
// //         @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
// //         @keyframes bounceIn { 0%{transform:scale(0.3);opacity:0} 50%{transform:scale(1.05)} 70%{transform:scale(0.9)} 100%{transform:scale(1);opacity:1} }
// //         @keyframes spin     { to{transform:rotate(360deg)} }
// //         @keyframes shimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

// //         .inp {
// //           width:100%; background:#FAFBFA; border:1.5px solid #E8EDE8;
// //           border-radius:50px; padding:11px 18px; font-size:13px;
// //           font-family:'Inter',system-ui,sans-serif; color:#2A2A2A; outline:none;
// //           transition:border-color 0.2s, box-shadow 0.2s, background 0.2s;
// //         }
// //         .inp:focus { border-color:#4CAF50; box-shadow:0 0 0 3px rgba(76,175,80,0.12); background:#fff; }
// //         .inp.focused { border-color:#4CAF50; box-shadow:0 0 0 3px rgba(76,175,80,0.12); background:#fff; }
// //         .inp::placeholder { color:#C0C8C0; font-size:12px; }

// //         .tarea {
// //           width:100%; background:#FAFBFA; border:1.5px solid #E8EDE8;
// //           border-radius:16px; padding:11px 18px; font-size:13px;
// //           font-family:'Inter',system-ui,sans-serif; color:#2A2A2A; outline:none;
// //           resize:none; transition:border-color 0.2s, box-shadow 0.2s, background 0.2s;
// //           flex:1; min-height:0;
// //         }
// //         .tarea:focus { border-color:#4CAF50; box-shadow:0 0 0 3px rgba(76,175,80,0.12); background:#fff; }
// //         .tarea::placeholder { color:#C0C8C0; font-size:12px; }

// //         .lbl { font-size:11px; font-weight:600; color:#5A6A5A; margin-bottom:6px; display:block; letter-spacing:0.2px; text-transform:uppercase; }

// //         .drop-item { padding:10px 16px; font-size:13px; color:#3A3A3A; cursor:pointer; transition:all 0.12s; display:flex; align-items:center; gap:8px; }
// //         .drop-item:hover { background:#F5FAF5; color:#4CAF50; padding-left:22px; }
// //         .drop-item.sel { background:#F5FAF5; color:#4CAF50; font-weight:600; }

// //         .sub-btn {
// //           background:#4CAF50; border:none; border-radius:50px;
// //           color:white; font-family:'Inter',system-ui,sans-serif;
// //           font-size:13px; font-weight:600; padding:12px 30px;
// //           cursor:pointer; transition:all 0.2s;
// //           box-shadow:0 4px 14px rgba(76,175,80,0.35);
// //           letter-spacing:0.2px;
// //         }
// //         .sub-btn:hover:not(:disabled) { background:#3D9140; transform:translateY(-1px); box-shadow:0 6px 18px rgba(76,175,80,0.45); }
// //         .sub-btn:active:not(:disabled) { transform:translateY(0); }
// //         .sub-btn:disabled { opacity:0.6; cursor:not-allowed; }

// //         .call-btn {
// //           flex:1; display:flex; align-items:center; justify-content:center; gap:7px;
// //           background:white; border:1.5px solid #4CAF50; border-radius:50px;
// //           color:#4CAF50; padding:10px 0; font-family:'Inter',system-ui,sans-serif;
// //           font-size:14px; font-weight:600; cursor:pointer; transition:all 0.18s;
// //         }
// //         .call-btn:hover { background:#4CAF50; color:white; transform:translateY(-1px); box-shadow:0 4px 12px rgba(76,175,80,0.3); }
// //         .call-btn:hover svg path { fill:white !important; }
// //       `}</style>

// //       <ClientSidebar />

// //       <div style={{ marginLeft:80, flex:1, display:'flex', flexDirection:'column', height:'100vh', padding:'16px 20px 16px 16px', gap:14 }}>

// //         {/* Topbar */}
// //         <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, animation:'fadeUp 0.3s both' }}>
// //           <div style={{ display:'flex', alignItems:'center', gap:12 }}>
// //             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Algerie_Telecom_logo.svg/200px-Algerie_Telecom_logo.svg.png"
// //               alt="AT" style={{ height:36, objectFit:'contain' }}
// //               onError={e => { e.target.style.display='none'; }}
// //             />
// //             <div style={{ height:28, width:1, background:'#E0E0E0' }}/>
// //             <div>
// //               <div style={{ fontSize:14, fontWeight:600, color:'#1a1a1a' }}>Réclamations</div>
// //               <div style={{ fontSize:11, color:'#999' }}>Espace client</div>
// //             </div>
// //           </div>
// //           <div style={{ display:'flex', alignItems:'center', gap:10 }}>
// //             {/* Message */}
// //             <div style={{ position:'relative' }}>
// //               <div style={{ width:36, height:36, borderRadius:10, background:'white', border:'1px solid #EBEBEB', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.2s' }}
// //                 onMouseEnter={e=>{ e.currentTarget.style.background='#F5FAF5'; e.currentTarget.style.borderColor='#4CAF50'; }}
// //                 onMouseLeave={e=>{ e.currentTarget.style.background='white'; e.currentTarget.style.borderColor='#EBEBEB'; }}
// //               >
// //                 <svg width="16" height="16" viewBox="0 0 24 24" fill="#4CAF50"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
// //               </div>
// //               <div style={{ position:'absolute', top:-3, right:-3, width:14, height:14, borderRadius:'50%', background:'#4CAF50', border:'2px solid #F2F4F2', fontSize:8, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600 }}>2</div>
// //             </div>
// //             {/* Profil */}
// //             <div style={{ width:36, height:36, borderRadius:'50%', overflow:'hidden', cursor:'pointer', border:'2px solid #4CAF50', boxShadow:'0 2px 8px rgba(76,175,80,0.3)' }}>
// //               <img src="https://ui-avatars.com/api/?name=C&background=4CAF50&color=fff&size=36&bold=true" alt="P" width="36" height="36" style={{ display:'block' }}/>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Corps principal */}
// //         {success ? (
// //           <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16, animation:'fadeIn 0.4s both' }}>
// //             <div style={{ fontSize:72, animation:'bounceIn 0.6s both' }}>✅</div>
// //             <div style={{ fontSize:22, fontWeight:600, color:'#4CAF50' }}>Réclamation envoyée !</div>
// //             <div style={{ fontSize:14, color:'#888', textAlign:'center', maxWidth:320 }}>
// //               Votre demande a été enregistrée. Un agent vous contactera sous 24–48h.
// //             </div>
// //             <button className="sub-btn" style={{ marginTop:8 }}
// //               onClick={() => { setSuccess(false); setForm({ nom:'', prenom:'', adresse:'', type_probleme:'', description:'' }); }}>
// //               Nouvelle réclamation
// //             </button>
// //           </div>
// //         ) : (
// //           <div style={{ flex:1, display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,1fr)', gap:14, minHeight:0 }}>

// //             {/* GAUCHE — Card formulaire */}
// //             <div style={{
// //               background:'white', borderRadius:20, border:'1.5px solid #E8EDE8',
// //               padding:'22px 24px', display:'flex', flexDirection:'column', gap:14,
// //               animation:'fadeUp 0.4s both', overflow:'hidden',
// //             }}>

// //               {/* Header card */}
// //               <div style={{ textAlign:'center', paddingBottom:14, borderBottom:'1px solid #F0F5F0', flexShrink:0 }}>
// //                 <div style={{ fontSize:13, color:'#4CAF50', fontWeight:600, cursor:'pointer' }}>
// //                   Déposez votre réclamation ici ou appelez-nous directement.
// //                 </div>
// //               </div>

// //               {error && (
// //                 <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:12, padding:'9px 14px', fontSize:12, color:'#DC2626', flexShrink:0 }}>
// //                   ⚠ {error}
// //                 </div>
// //               )}

// //               {/* Nom */}
// //               <div style={{ flexShrink:0 }}>
// //                 <span className="lbl">Nom</span>
// //                 <input className="inp" placeholder="Entrer votre nom" value={form.nom}
// //                   onChange={e=>set('nom',e.target.value)}
// //                   onFocus={()=>setFocused('nom')} onBlur={()=>setFocused('')}/>
// //               </div>

// //               {/* Prénom */}
// //               <div style={{ flexShrink:0 }}>
// //                 <span className="lbl">Prénom</span>
// //                 <input className="inp" placeholder="Entrer votre prénom" value={form.prenom}
// //                   onChange={e=>set('prenom',e.target.value)}
// //                   onFocus={()=>setFocused('prenom')} onBlur={()=>setFocused('')}/>
// //               </div>

// //               {/* Adresse */}
// //               <div style={{ flexShrink:0 }}>
// //                 <span className="lbl">Adresse</span>
// //                 <input className="inp" placeholder="Entrer votre adresse" value={form.adresse}
// //                   onChange={e=>set('adresse',e.target.value)}
// //                   onFocus={()=>setFocused('adresse')} onBlur={()=>setFocused('')}/>
// //               </div>

// //               {/* Type dropdown */}
// //               <div style={{ position:'relative', flexShrink:0 }}>
// //                 <span className="lbl">Type problème</span>
// //                 <div className={`inp${typeOpen?' focused':''}`}
// //                   style={{ cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between' }}
// //                   onClick={() => setTypeOpen(o=>!o)}
// //                 >
// //                   <span style={{ color:selectedType?'#2A2A2A':'#C0C8C0', fontSize:selectedType?'13px':'12px' }}>
// //                     {selectedType ? selectedType.label : 'Sélectionner un type'}
// //                   </span>
// //                   <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition:'transform 0.2s', transform:typeOpen?'rotate(180deg)':'none', flexShrink:0 }}>
// //                     <path d="M2 4l4 4 4-4" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/>
// //                   </svg>
// //                 </div>
// //                 {typeOpen && (
// //                   <div style={{
// //                     position:'absolute', top:'100%', left:0, right:0, zIndex:300,
// //                     background:'white', borderRadius:16, marginTop:6,
// //                     boxShadow:'0 12px 32px rgba(0,0,0,0.12)',
// //                     border:'1px solid #E8EDE8', overflow:'hidden',
// //                     animation:'fadeUp 0.18s both',
// //                   }}>
// //                     {TYPES.map(t => (
// //                       <div key={t.value} className={`drop-item ${form.type_probleme===t.value?'sel':''}`}
// //                         onClick={()=>{ set('type_probleme',t.value); setTypeOpen(false); }}>
// //                         {form.type_probleme===t.value && <span style={{ fontSize:11, color:'#4CAF50' }}>✓</span>}
// //                         {t.label}
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>

// //               {/* Description */}
// //               <div style={{ display:'flex', flexDirection:'column', flex:1, minHeight:0 }}>
// //                 <span className="lbl">Description</span>
// //                 <textarea className="tarea" placeholder="Écrire le problème en détail..."
// //                   value={form.description} onChange={e=>set('description',e.target.value)}/>
// //               </div>
// //             </div>

// //             {/* DROITE — Carte + appel + bouton */}
// //             <div style={{ display:'flex', flexDirection:'column', gap:12, animation:'fadeUp 0.4s 0.08s both' }}>

// //               {/* Carte OpenStreetMap */}
// //               <div style={{ flex:1, borderRadius:20, overflow:'hidden', border:'1.5px solid #E8EDE8', position:'relative', minHeight:0, boxShadow:'0 4px 16px rgba(0,0,0,0.07)' }}>
// //                 <iframe
// //                   title="map"
// //                   src="https://www.openstreetmap.org/export/embed.html?bbox=2.95%2C36.68%2C3.25%2C36.85&layer=mapnik&marker=36.75,3.06"
// //                   style={{ width:'100%', height:'100%', border:'none', display:'block' }}
// //                   loading="lazy"
// //                 />
// //                 {/* Badge agence */}
// //                 <div style={{
// //                   position:'absolute', top:12, left:12,
// //                   background:'rgba(255,255,255,0.92)', backdropFilter:'blur(8px)',
// //                   borderRadius:10, padding:'6px 12px',
// //                   border:'1px solid rgba(76,175,80,0.3)',
// //                   display:'flex', alignItems:'center', gap:6,
// //                 }}>
// //                   <div style={{ width:8, height:8, borderRadius:'50%', background:'#4CAF50', animation:'pulse 2s infinite' }}/>
// //                   <span style={{ fontSize:11, fontWeight:600, color:'#2A2A2A' }}>Agence Alger Centre</span>
// //                 </div>
// //               </div>

// //               {/* Appel + Soumettre */}
// //               <div style={{
// //                 background:'white', borderRadius:18, border:'1.5px solid #E8EDE8',
// //                 padding:'16px 18px', display:'flex', alignItems:'center', gap:14, flexShrink:0,
// //                 boxShadow:'0 2px 10px rgba(0,0,0,0.05)',
// //               }}>
// //                 <div style={{ flex:1 }}>
// //                   <div style={{ fontSize:11, fontWeight:600, color:'#888', letterSpacing:0.3, textAlign:'center', marginBottom:10, textTransform:'uppercase' }}>
// //                     Appelez-nous
// //                   </div>
// //                   <div style={{ display:'flex', gap:10 }}>
// //                     <button className="call-btn">
// //                       <svg width="14" height="14" viewBox="0 0 24 24">
// //                         <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill="#4CAF50"/>
// //                       </svg>
// //                       <span>12</span>
// //                     </button>
// //                     <button className="call-btn">
// //                       <svg width="14" height="14" viewBox="0 0 24 24">
// //                         <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill="#4CAF50"/>
// //                       </svg>
// //                       <span>101</span>
// //                     </button>
// //                   </div>
// //                 </div>

// //                 <div style={{ width:1, height:50, background:'#F0F0F0', flexShrink:0 }}/>

// //                 <button className="sub-btn" onClick={handleSubmit} disabled={loading} style={{ flexShrink:0 }}>
// //                   {loading ? (
// //                     <span style={{ display:'flex', alignItems:'center', gap:8 }}>
// //                       <span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', animation:'spin 0.7s linear infinite', display:'inline-block' }}/>
// //                       Envoi…
// //                     </span>
// //                   ) : 'Soumettre'}
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }



import { useState } from 'react';
import ClientSidebar from '../../components/client/ClientSidebar';
import { reclamationsAPI } from '../../services/api';

const TYPES = [
  { value: 'connexion',   label: 'Problème de connexion', icon: '' },
  { value: 'facturation', label: 'Erreur de facturation', icon: '' },
  { value: 'equipement',  label: 'Équipement défectueux', icon: '' },
  { value: 'service',     label: 'Service indisponible',  icon: '' },
  { value: 'autre',       label: 'Autre problème',        icon: '' },
];

export default function ClientReclamation({ clientId }) {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    adresse: '',
    type_probleme: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [typeOpen, setTypeOpen] = useState(false);

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    if (!form.nom || !form.prenom || !form.type_probleme || !form.description) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await reclamationsAPI.create({
        client_id: clientId || '6bdcc9ba-523d-4141-b551-307e5f29aaa5',
        titre: `${form.type_probleme} — ${form.nom} ${form.prenom}`,
        description: form.description,
        type_probleme: form.type_probleme,
        priorite: 'normale',
        adresse_probleme: form.adresse,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  const selectedType = TYPES.find(t => t.value === form.type_probleme);

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      fontFamily: "'Inter', 'Poppins', system-ui, sans-serif",
      overflow: 'hidden',
      display: 'flex',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp    { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        @keyframes fadeIn    { from { opacity: 0; } to { opacity: 1; } }
        @keyframes confetti  { 0%   { transform: translateY(-100vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(120vh) rotate(720deg); opacity: 0; } }
        @keyframes spin      { to { transform: rotate(360deg); } }
        @keyframes pulseRing { 0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); } 70% { box-shadow: 0 0 0 12px rgba(16,185,129,0); } 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); } }

        .input-base {
          width: 100%;
          padding: 13px 18px;
          font-size: 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
        }
        .input-base:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 4px rgba(16,185,129,0.15);
        }
        .input-base::placeholder { color: #94a3b8; }

        .label {
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 6px;
          display: block;
          letter-spacing: 0.3px;
        }

        .dropdown-item {
          padding: 12px 16px;
          font-size: 14px;
          color: #1e293b;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .dropdown-item:hover {
          background: #f0fdf4;
          color: #10b981;
          padding-left: 20px;
        }
        .dropdown-item.selected {
          background: #ecfdf5;
          color: #10b981;
          font-weight: 600;
        }

        .submit-btn {
          background: #10b981;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.22s;
          box-shadow: 0 4px 14px rgba(16,185,129,0.3);
        }
        .submit-btn:hover:not(:disabled) {
          background: #059669;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(16,185,129,0.35);
        }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .call-btn {
          flex: 1;
          padding: 12px;
          background: white;
          border: 1.5px solid #10b981;
          border-radius: 12px;
          color: #10b981;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .call-btn:hover {
          background: #10b981;
          color: white;
          transform: translateY(-1px);
        }
      `}</style>

      <ClientSidebar />

      <div style={{
        marginLeft: 80,
        flex: 1,
        padding: '24px 32px',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
      }}>
        {/* Header simple */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 28,
          flexShrink: 0,
        }}>
          <div>
            <h1 style={{
              fontSize: 26,
              fontWeight: 700,
              color: '#111827',
              margin: 0,
              fontFamily: "'Poppins', sans-serif",
            }}>
              Nouvelle réclamation
            </h1>
            <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
              Décrivez votre problème, nous nous en occupons rapidement
            </p>
          </div>

          <div style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 600,
            boxShadow: '0 0 0 4px rgba(16,185,129,0.2)',
          }}>
            Vous
          </div>
        </div>

        {success ? (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.5s',
          }}>
            <div style={{
              fontSize: 90,
              marginBottom: 24,
              animation: 'bounceIn 0.7s',
            }}>🎉</div>
            <h2 style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#065f46',
              marginBottom: 12,
            }}>
              Réclamation envoyée avec succès !
            </h2>
            <p style={{
              fontSize: 16,
              color: '#475569',
              textAlign: 'center',
              maxWidth: 420,
              lineHeight: 1.5,
              marginBottom: 32,
            }}>
              Merci pour votre confiance. Un conseiller va étudier votre demande et vous recontactera dans les plus brefs délais.
            </p>

            <button
              onClick={() => {
                setSuccess(false);
                setForm({ nom: '', prenom: '', adresse: '', type_probleme: '', description: '' });
              }}
              style={{
                padding: '14px 40px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
              }}
            >
              Déposer une nouvelle réclamation
            </button>

            {/* Confetti CSS only */}
            <div style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              overflow: 'hidden',
            }}>
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${Math.random() * 100}%`,
                    width: '10px',
                    height: '10px',
                    background: ['#10b981', '#34d399', '#065f46', '#ecfdf5'][Math.floor(Math.random() * 4)],
                    borderRadius: '50%',
                    animation: `confetti ${3 + Math.random() * 3}s linear forwards`,
                    animationDelay: `${Math.random() * 1.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 32,
            overflow: 'hidden',
          }}>
            {/* Formulaire */}
            <div style={{
              background: 'white',
              borderRadius: 20,
              padding: '32px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              border: '1px solid #e5e7eb',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              overflowY: 'auto',
            }}>
              {error && (
                <div style={{
                  background: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: 12,
                  padding: '12px 16px',
                  color: '#b91c1c',
                  fontSize: 14,
                }}>
                  {error}
                </div>
              )}

              <div>
                <span className="label">Nom</span>
                <input
                  className="input-base"
                  placeholder="Votre nom"
                  value={form.nom}
                  onChange={e => set('nom', e.target.value)}
                />
              </div>

              <div>
                <span className="label">Prénom</span>
                <input
                  className="input-base"
                  placeholder="Votre prénom"
                  value={form.prenom}
                  onChange={e => set('prenom', e.target.value)}
                />
              </div>

              <div>
                <span className="label">Adresse concernée</span>
                <input
                  className="input-base"
                  placeholder="Adresse où se situe le problème"
                  value={form.adresse}
                  onChange={e => set('adresse', e.target.value)}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <span className="label">Type de problème</span>
                <div
                  className="input-base"
                  style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onClick={() => setTypeOpen(!typeOpen)}
                >
                  <span style={{ color: selectedType ? '#111827' : '#94a3b8' }}>
                    {selectedType ? selectedType.label : 'Choisir un type'}
                  </span>
                  <span style={{ transform: typeOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                </div>

                {typeOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: 8,
                    background: 'white',
                    borderRadius: 16,
                    boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                    border: '1px solid #e5e7eb',
                    zIndex: 10,
                    overflow: 'hidden',
                  }}>
                    {TYPES.map(t => (
                      <div
                        key={t.value}
                        className={`dropdown-item ${form.type_probleme === t.value ? 'selected' : ''}`}
                        onClick={() => {
                          set('type_probleme', t.value);
                          setTypeOpen(false);
                        }}
                      >
                        <span style={{ fontSize: 18 }}>{t.icon}</span>
                        {t.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span className="label">Description détaillée</span>
                <textarea
                  className="input-base"
                  style={{ resize: 'none', height: 140, fontFamily: 'inherit' }}
                  placeholder="Expliquez-nous précisément votre problème..."
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                />
              </div>

              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <span style={{
                      width: 18,
                      height: 18,
                      border: '3px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    Envoi en cours...
                  </span>
                ) : (
                  'Envoyer ma réclamation'
                )}
              </button>
            </div>

            {/* Colonne droite – Infos + Carte + Appel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Carte */}
              <div style={{
                flex: 1,
                borderRadius: 20,
                overflow: 'hidden',
                border: '1px solid #e5e7eb',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                position: 'relative',
              }}>
                <iframe
                  title="Agence proche"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=2.8,36.4,3.4,37.0&layer=mapnik&marker=36.48,2.83"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  loading="lazy"
                />
                <div style={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(8px)',
                  padding: '10px 16px',
                  borderRadius: 12,
                  border: '1px solid rgba(16,185,129,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#111827',
                  animation: 'pulseRing 2s infinite',
                }}>
                  <div style={{
                    width: 10,
                    height: 10,
                    background: '#10b981',
                    borderRadius: '50%',
                  }} />
                  Agence la plus proche détectée
                </div>
              </div>

              {/* Bloc appel rapide */}
              <div style={{
                background: 'white',
                borderRadius: 16,
                padding: '20px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
              }}>
                <div style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#111827',
                  marginBottom: 16,
                  textAlign: 'center',
                }}>
                  Besoin d'une réponse rapide ?
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="call-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    12
                  </button>
                  <button className="call-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    101
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}