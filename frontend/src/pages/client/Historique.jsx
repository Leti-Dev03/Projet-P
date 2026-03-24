import { useState, useEffect, useCallback } from 'react';
import ClientSidebar from '../../components/client/ClientSidebar';
import { reclamationsAPI } from '../../services/api';

const statutColor = {
  ouvert:     { bg:'#FEF2F2', color:'#EF4444', label:'Ouverte' },
  en_attente: { bg:'#FFFBEB', color:'#F59E0B', label:'En attente' },
  en_cours:   { bg:'#EFF6FF', color:'#3B82F6', label:'En cours' },
  resolu:     { bg:'#F0FDF4', color:'#22C55E', label:'Résolue' },
  ferme:      { bg:'#F9FAFB', color:'#6B7280', label:'Fermée' },
};

const typeIcon = {
  connexion:   { icon:'', color:'#3B82F6' },
  facturation: { icon:'', color:'#8B5CF6' },
  equipement:  { icon:'', color:'#F59E0B' },
  service:     { icon:'', color:'#EF4444' },
  autre:       { icon:'', color:'#6B7280' },
};

const TABS = [
  { key:'reclamations', label:'Réclamations', icon:'📋' },
  { key:'activite',     label:'Activité',     icon:'⚡' },
];

function buildActivite(reclamations) {
  const events = [];
  reclamations.forEach(r => {
    events.push({ 
      id:`r-${r.id}`, 
      type:'reclamation_creee', 
      date:r.created_at, 
      titre:`Réclamation soumise`, 
      desc:r.titre, 
      icon:'📋', 
      color:'#3B82F6' 
    });

    if (r.statut === 'resolu' || r.statut === 'ferme') {
      events.push({ 
        id:`r-ok-${r.id}`, 
        type:'reclamation_resolue', 
        date:r.updated_at || r.created_at, 
        titre:`Réclamation résolue`, 
        desc:r.titre, 
        icon:'✅', 
        color:'#22C55E' 
      });
    }
    if (r.statut === 'en_cours') {
      events.push({ 
        id:`r-ec-${r.id}`, 
        type:'reclamation_encours', 
        date:r.updated_at || r.created_at, 
        titre:`Prise en charge`, 
        desc:r.titre, 
        icon:'⚙️', 
        color:'#F59E0B' 
      });
    }
  });
  return events.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function formatDateShort(d) {
  return new Date(d).toLocaleDateString('fr-DZ', { day:'numeric', month:'short' });
}

function formatTime(d) {
  return new Date(d).toLocaleTimeString('fr-DZ', { hour:'2-digit', minute:'2-digit' });
}

// Grouper par mois
function groupByMonth(items, dateKey = 'created_at') {
  const groups = {};
  items.forEach(item => {
    const d = new Date(item[dateKey] || item.date);
    const key = d.toLocaleDateString('fr-DZ', { month:'long', year:'numeric' });
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return groups;
}

export default function Historique({ clientId }) {
  const [tab, setTab] = useState('reclamations');
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reclamationsAPI.getAll({ 
        client_id: clientId || '6bdcc9ba-523d-4141-b551-307e5f29aaa5', 
        limit: 100 
      });

      setReclamations(Array.isArray(res.data?.data) ? res.data.data : 
                     Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setReclamations([]);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Stats
  const stats = {
    total:    reclamations.length,
    resolues: reclamations.filter(r => r.statut === 'resolu' || r.statut === 'ferme').length,
    enCours:  reclamations.filter(r => ['ouvert','en_attente','en_cours'].includes(r.statut)).length,
  };

  // Filtrage
  const filteredRecla = reclamations.filter(r => {
    const matchSearch = !search || 
      r.titre?.toLowerCase().includes(search.toLowerCase()) || 
      r.type_probleme?.toLowerCase().includes(search.toLowerCase());
    const matchStatut = !filterStatut || r.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const activite = buildActivite(reclamations);
  const filteredActivite = activite.filter(a =>
    !search || a.titre?.toLowerCase().includes(search.toLowerCase()) || 
              a.desc?.toLowerCase().includes(search.toLowerCase())
  );

  const reclaGroups = groupByMonth(filteredRecla);
  const activGroups = groupByMonth(filteredActivite, 'date');

  return (
    <div style={{ width:'100vw', height:'100vh', background:'#F0F2F0', fontFamily: "'Poppins', sans-serif", overflow:'hidden', display:'flex' }}>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideIn { from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:none} }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#D0D8D0; border-radius:2px; }
        .row-hover:hover { background:#F8FBF8 !important; }
        .tab-btn { border:none; cursor:pointer; font-family:inherit; transition:all 0.18s; }
        .tab-btn:hover { transform:translateY(-1px); }
      `}</style>

      <ClientSidebar />

      <div style={{ marginLeft:78, flex:1, display:'flex', flexDirection:'column', height:'100vh', padding:'14px 20px 14px 14px', gap:12 }}>

        {/* Topbar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, animation:'fadeUp 0.3s both' }}>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:'#1a1a1a' }}>Historique</div>
            <div style={{ fontSize:11, color:'#999', marginTop:1 }}>Retrouvez l'ensemble de vos actions et demandes</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ position:'relative' }}>
              <div style={{ width:34, height:34, borderRadius:10, background:'white', border:'1px solid #E0E0E0', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#4CAF50"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
              </div>
              <div style={{ position:'absolute', top:-3, right:-3, width:13, height:13, borderRadius:'50%', background:'#4CAF50', border:'2px solid #F0F2F0', fontSize:7, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>2</div>
            </div>
            <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#4CAF50,#2E7D32)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, color:'white', fontWeight:700, cursor:'pointer' }}>C</div>
          </div>
        </div>

        {/* Stats cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, flexShrink:0, animation:'fadeUp 0.35s both' }}>
          {[
            { label:'Réclamations totales', value:stats.total,    color:'#3B82F6', bg:'#EFF6FF', icon:'📋' },
            { label:'Résolues',             value:stats.resolues,  color:'#22C55E', bg:'#F0FDF4', icon:'✅' },
            { label:'En cours',             value:stats.enCours,   color:'#F59E0B', bg:'#FFFBEB', icon:'⚙️' },
          ].map((s, i) => (
            <div key={i} style={{ background:'white', borderRadius:14, padding:'14px 16px', border:'1px solid #E8EDE8', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize:22, fontWeight:700, color:s.color }}>{s.value}</div>
                <div style={{ fontSize:10, color:'#999', marginTop:1 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Barre recherche + filtres + tabs */}
        <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0, animation:'fadeUp 0.4s both' }}>
          {/* Tabs */}
          <div style={{ display:'flex', gap:6, background:'white', borderRadius:12, padding:4, border:'1px solid #E8EDE8' }}>
            {TABS.map(t => (
              <button key={t.key} className="tab-btn" onClick={() => { setTab(t.key); setSearch(''); setFilterStatut(''); }}
                style={{
                  padding:'7px 14px', borderRadius:9,
                  background: tab===t.key ? '#4CAF50' : 'transparent',
                  color: tab===t.key ? 'white' : '#666',
                  fontSize:12, fontWeight:600,
                  boxShadow: tab===t.key ? '0 2px 8px rgba(76,175,80,0.3)' : 'none',
                  display:'flex', alignItems:'center', gap:5,
                }}>
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>

          {/* Recherche */}
          <div style={{ flex:1, position:'relative' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#CCC" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }}>
              <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" stroke="#CCC" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher..."
              style={{ width:'100%', background:'white', border:'1px solid #E8EDE8', borderRadius:12, padding:'9px 14px 9px 34px', fontSize:12, fontFamily:'inherit', color:'#333', outline:'none' }}
            />
          </div>

          {/* Filtre statut (réclamations seulement) */}
          {tab === 'reclamations' && (
            <select value={filterStatut} onChange={e => setFilterStatut(e.target.value)}
              style={{ background:'white', border:'1px solid #E8EDE8', borderRadius:12, padding:'9px 12px', fontSize:12, fontFamily:'inherit', color:'#666', outline:'none', cursor:'pointer' }}>
              <option value="">Tous statuts</option>
              <option value="ouvert">Ouverte</option>
              <option value="en_cours">En cours</option>
              <option value="resolu">Résolue</option>
              <option value="ferme">Fermée</option>
            </select>
          )}

          {/* Bouton export */}
          <button style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 14px', background:'white', border:'1px solid #E8EDE8', borderRadius:12, fontSize:12, fontWeight:600, color:'#666', cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#4CAF50'; e.currentTarget.style.color='#4CAF50'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#E8EDE8'; e.currentTarget.style.color='#666'; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            Exporter
          </button>
        </div>

        {/* Contenu principal */}
        <div style={{ flex:1, overflowY:'auto', animation:'slideIn 0.3s both' }}>
          {loading ? (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:200, flexDirection:'column', gap:12 }}>
              <div style={{ fontSize:32 }}>⏳</div>
              <div style={{ fontSize:13, color:'#999' }}>Chargement...</div>
            </div>
          ) : tab === 'reclamations' ? (
            /* Réclamations */
            filteredRecla.length === 0 ? (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:200, flexDirection:'column', gap:12 }}>
                <div style={{ fontSize:48 }}>📭</div>
                <div style={{ fontSize:13, color:'#AAA' }}>Aucune réclamation trouvée</div>
              </div>
            ) : (
              Object.entries(reclaGroups).map(([mois, items]) => (
                <div key={mois} style={{ marginBottom:24 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:1 }}>{mois}</div>
                    <div style={{ flex:1, height:1, background:'#E8EDE8' }}/>
                    <div style={{ fontSize:11, color:'#CCC' }}>{items.length} réclamation{items.length>1?'s':''}</div>
                  </div>
                  <div style={{ background:'white', borderRadius:16, border:'1px solid #E8EDE8', overflow:'hidden' }}>
                    {items.map((r, idx) => {
                      const s = statutColor[r.statut] || statutColor.ouvert;
                      const t = typeIcon[r.type_probleme] || typeIcon.autre;
                      return (
                        <div key={r.id} className="row-hover" style={{
                          display:'flex', alignItems:'center', gap:14, padding:'14px 18px',
                          borderBottom: idx < items.length-1 ? '1px solid #F5F5F5' : 'none',
                        }}>
                          <div style={{ width:40, height:40, borderRadius:12, background:`${t.color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                            {t.icon}
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:13, fontWeight:600, color:'#1a1a1a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                              {r.titre}
                            </div>
                            <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:3 }}>
                              <span style={{ fontSize:10, color:'#999', textTransform:'capitalize' }}>{r.type_probleme}</span>
                              {r.region && <><span style={{ fontSize:10, color:'#DDD' }}>·</span><span style={{ fontSize:10, color:'#999' }}>📍 {r.region}</span></>}
                            </div>
                          </div>
                          <div style={{ textAlign:'right', flexShrink:0 }}>
                            <div style={{ fontSize:12, fontWeight:500, color:'#666' }}>{formatDateShort(r.created_at)}</div>
                            <div style={{ fontSize:10, color:'#BBB', marginTop:1 }}>{formatTime(r.created_at)}</div>
                          </div>
                          <div style={{ flexShrink:0 }}>
                            <span style={{ fontSize:10, fontWeight:700, padding:'4px 10px', borderRadius:20, background:s.bg, color:s.color, border:`1px solid ${s.color}25` }}>
                              {s.label}
                            </span>
                          </div>
                          <div style={{ fontSize:9, color:'#CCC', flexShrink:0, fontFamily:'monospace' }}>
                            #{r.id?.slice(0,8)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )
          ) : (
            /* Activité */
            filteredActivite.length === 0 ? (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:200, flexDirection:'column', gap:12 }}>
                <div style={{ fontSize:48 }}>⚡</div>
                <div style={{ fontSize:13, color:'#AAA' }}>Aucune activité</div>
              </div>
            ) : (
              Object.entries(activGroups).map(([mois, items]) => (
                <div key={mois} style={{ marginBottom:24 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:1 }}>{mois}</div>
                    <div style={{ flex:1, height:1, background:'#E8EDE8' }}/>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:0, position:'relative' }}>
                    <div style={{ position:'absolute', left:19, top:20, bottom:20, width:2, background:'#E8EDE8', borderRadius:1 }}/>
                    {items.map((evt, idx) => (
                      <div key={evt.id} style={{ display:'flex', gap:14, alignItems:'flex-start', marginBottom:idx < items.length-1 ? 12 : 0 }}>
                        <div style={{ 
                          width:40, 
                          height:40, 
                          borderRadius:'50%', 
                          background: 'white',
                          border: `2px solid ${evt.color}40`, 
                          display:'flex', 
                          alignItems:'center', 
                          justifyContent:'center', 
                          fontSize:16, 
                          flexShrink:0, 
                          zIndex:1 
                        }}>
                          {evt.icon}
                        </div>
                        <div style={{ background:'white', borderRadius:14, padding:'12px 16px', flex:1, border:'1px solid #E8EDE8' }}>
                          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                            <div>
                              <div style={{ fontSize:13, fontWeight:600, color:'#1a1a1a' }}>{evt.titre}</div>
                              <div style={{ fontSize:11, color:'#888', marginTop:3 }}>{evt.desc}</div>
                            </div>
                            <div style={{ textAlign:'right', flexShrink:0, marginLeft:12 }}>
                              <div style={{ fontSize:11, color:'#666' }}>{formatDateShort(evt.date)}</div>
                              <div style={{ fontSize:10, color:'#BBB', marginTop:1 }}>{formatTime(evt.date)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
}