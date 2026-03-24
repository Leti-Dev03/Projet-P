import { supabaseAdmin } from '../config/supabase.js';

// POST /api/reclamations
export const createReclamation = async (req, res) => {
  const { client_id, titre, description, type_probleme, priorite, adresse_probleme, region } = req.body;

  if (!client_id || !titre || !description)
    return res.status(400).json({ error: 'client_id, titre et description sont obligatoires' });

  const { data: client } = await supabaseAdmin.from('clients').select('id, nom, prenom, wilaya').eq('id', client_id).single();
  if (!client) return res.status(404).json({ error: 'Client non trouvé' });

  const { data, error } = await supabaseAdmin.from('reclamations').insert({
    client_id, titre, description,
    type_probleme: type_probleme || 'autre',
    priorite: priorite || 'normale',
    statut: 'ouvert',
    adresse_probleme,
    region: region || client.wilaya
  }).select().single();

  if (error) return res.status(400).json({ error: error.message });

  // Notification temps réel
  const io = req.app.get('io');
  io.emit('nouvelle_reclamation', { reclamation: data, client });

  // Notifier tous les agents
  const { data: agents } = await supabaseAdmin.from('utilisateurs').select('id').eq('role', 'agent').eq('actif', true);
  if (agents?.length) {
    await supabaseAdmin.from('notifications').insert(
      agents.map(a => ({
        destinataire_id: a.id,
        destinataire_type: 'agent',
        titre: 'Nouvelle réclamation',
        message: `${client.nom} ${client.prenom} : ${titre}`,
        type: 'reclamation',
        lien: `/reclamations/${data.id}`
      }))
    );
  }

  res.status(201).json({ message: 'Réclamation créée', reclamation: data });
};

// GET /api/reclamations
export const getReclamations = async (req, res) => {
  const { statut, priorite, client_id, type_probleme, agent_id, region, page = 1, limit = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let query = supabaseAdmin.from('reclamations')
    .select('*, clients(nom, prenom, email, telephone, wilaya), utilisateurs(nom, prenom)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + Number(limit) - 1);

  if (statut)        query = query.eq('statut', statut);
  if (priorite)      query = query.eq('priorite', priorite);
  if (client_id)     query = query.eq('client_id', client_id);
  if (type_probleme) query = query.eq('type_probleme', type_probleme);
  if (agent_id)      query = query.eq('agent_id', agent_id);
  if (region)        query = query.eq('region', region);

  const { data, error, count } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data, total: count, page: Number(page), limit: Number(limit) });
};

// GET /api/reclamations/:id
export const getReclamationById = async (req, res) => {
  const { data, error } = await supabaseAdmin.from('reclamations')
    .select('*, clients(nom, prenom, email, telephone, adresse, wilaya), utilisateurs(nom, prenom)')
    .eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Réclamation non trouvée' });

  const { data: intervention } = await supabaseAdmin.from('interventions')
    .select('*, techniciens(nom, prenom, telephone)').eq('reclamation_id', req.params.id).maybeSingle();

  res.json({ ...data, intervention });
};

// PUT /api/reclamations/:id
export const updateReclamation = async (req, res) => {
  const { titre, description, type_probleme, priorite, statut, agent_id } = req.body;

  const STATUTS = ['ouvert', 'en_cours', 'en_attente', 'resolu', 'ferme'];
  if (statut && !STATUTS.includes(statut))
    return res.status(400).json({ error: `Statut invalide. Valeurs : ${STATUTS.join(', ')}` });

  const updates = {};
  if (titre)         updates.titre = titre;
  if (description)   updates.description = description;
  if (type_probleme) updates.type_probleme = type_probleme;
  if (priorite)      updates.priorite = priorite;
  if (statut)        updates.statut = statut;
  if (agent_id)      updates.agent_id = agent_id;
  if (statut === 'resolu') updates.resolu_at = new Date();

  const { data, error } = await supabaseAdmin.from('reclamations').update(updates).eq('id', req.params.id).select('*, clients(nom, prenom, email)').single();
  if (error) return res.status(400).json({ error: error.message });

  // Notifier le client si statut change
  if (statut && data.clients) {
    const msgs = { en_cours: 'Votre réclamation est en cours de traitement', resolu: 'Votre réclamation a été résolue', ferme: 'Votre réclamation a été fermée' };
    if (msgs[statut]) {
      await supabaseAdmin.from('notifications').insert({
        destinataire_id: data.client_id,
        destinataire_type: 'client',
        titre: 'Mise à jour de votre réclamation',
        message: msgs[statut],
        type: 'reclamation',
        lien: `/reclamations/${data.id}`
      });
    }
  }

  const io = req.app.get('io');
  io.emit('reclamation_updated', data);

  res.json(data);
};

// DELETE /api/reclamations/:id
export const deleteReclamation = async (req, res) => {
  const { error } = await supabaseAdmin.from('reclamations').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Réclamation supprimée' });
};