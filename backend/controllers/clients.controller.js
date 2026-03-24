import { supabaseAdmin } from '../config/supabase.js';

// GET /api/clients
export const getClients = async (req, res) => {
  const { search, profil, wilaya, statut_compte, page = 1, limit = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let query = supabaseAdmin.from('clients')
    .select('id, nom, prenom, email, telephone, ville, wilaya, profil, categorie, statut_compte, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + Number(limit) - 1);

  if (profil)        query = query.eq('profil', profil);
  if (wilaya)        query = query.eq('wilaya', wilaya);
  if (statut_compte) query = query.eq('statut_compte', statut_compte);
  if (search)        query = query.or(`nom.ilike.%${search}%,prenom.ilike.%${search}%,email.ilike.%${search}%,telephone.ilike.%${search}%,cin_numero.ilike.%${search}%`);

  const { data, error, count } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data, total: count, page: Number(page), limit: Number(limit) });
};

// GET /api/clients/:id
export const getClientById = async (req, res) => {
  const { data, error } = await supabaseAdmin.from('clients').select('*').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Client non trouvé' });

  // Historique réclamations
  const { data: reclamations } = await supabaseAdmin.from('reclamations')
    .select('id, titre, statut, priorite, type_probleme, created_at')
    .eq('client_id', req.params.id).order('created_at', { ascending: false });

  // Abonnement actif
  const { data: abonnement } = await supabaseAdmin.from('abonnements')
    .select('*, offres(nom, prix, type)').eq('client_id', req.params.id).eq('statut', 'actif').maybeSingle();

  // Factures
  const { data: factures } = await supabaseAdmin.from('factures')
    .select('id, numero_facture, montant_ttc, statut, date_echeance, date_paiement')
    .eq('client_id', req.params.id).order('created_at', { ascending: false }).limit(5);

  // Stats historique
  const total = reclamations?.length || 0;
  const traitees = reclamations?.filter(r => r.statut === 'resolu' || r.statut === 'ferme').length || 0;

  res.json({ client: data, abonnement, factures, historique: { total_reclamations: total, reclamations_traitees: traitees, reclamations_en_cours: total - traitees }, reclamations });
};

// PUT /api/clients/:id
export const updateClient = async (req, res) => {
  const CHAMPS = ['nom', 'prenom', 'email', 'telephone', 'adresse', 'ville', 'wilaya', 'code_postal', 'date_naissance', 'statut_compte', 'categorie'];
  const updates = {};
  CHAMPS.forEach(c => { if (req.body[c] !== undefined) updates[c] = req.body[c]; });

  if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'Aucun champ valide fourni' });

  const { data, error } = await supabaseAdmin.from('clients').update(updates).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// DELETE /api/clients/:id
export const deleteClient = async (req, res) => {
  const { error } = await supabaseAdmin.from('clients').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Client supprimé' });
};

// GET /api/clients/:id/offres — offres recommandées pour ce client
export const getOffresClient = async (req, res) => {
  const { data: client } = await supabaseAdmin.from('clients').select('profil, budget_mensuel').eq('id', req.params.id).single();
  if (!client) return res.status(404).json({ error: 'Client non trouvé' });

  let query = supabaseAdmin.from('offres').select('*').eq('actif', true)
    .or(`cible.eq.${client.profil},cible.eq.tous`).order('prix', { ascending: true });
  if (client.budget_mensuel) query = query.lte('prix', client.budget_mensuel);

  const { data } = await query;
  res.json({ profil: client.profil, offres_recommandees: data || [] });
};