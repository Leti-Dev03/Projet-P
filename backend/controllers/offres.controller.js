import { supabaseAdmin } from '../config/supabase.js';

export const getOffres = async (req, res) => {
  const { cible, type, budget, actif = 'true' } = req.query;
  let query = supabaseAdmin.from('offres').select('*').eq('actif', actif === 'true').order('prix', { ascending: true });
  if (type)   query = query.eq('type', type);
  if (budget) query = query.lte('prix', Number(budget));
  if (cible)  query = query.or(`cible.eq.${cible},cible.eq.tous`);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const getOffreById = async (req, res) => {
  const { data, error } = await supabaseAdmin.from('offres').select('*').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Offre non trouvée' });
  res.json(data);
};

export const createOffre = async (req, res) => {
  const { nom, description, prix, debit_download, debit_upload, quota_data, type, cible } = req.body;
  if (!nom || !prix || !type) return res.status(400).json({ error: 'nom, prix et type sont obligatoires' });

  const TYPES = ['fibre', 'adsl', 'mobile', '4g', '5g'];
  if (!TYPES.includes(type)) return res.status(400).json({ error: `type invalide. Valeurs : ${TYPES.join(', ')}` });

  if (cible && cible !== 'tous') {
    const { data: profilExistant } = await supabaseAdmin.from('profils').select('nom').eq('nom', cible).maybeSingle();
    if (!profilExistant) {
      const { data: profils } = await supabaseAdmin.from('profils').select('nom');
      return res.status(400).json({ error: `Profil "${cible}" inexistant.`, profils_disponibles: profils?.map(p => p.nom) });
    }
  }

  const { data, error } = await supabaseAdmin.from('offres').insert({ nom, description, prix, debit_download, debit_upload, quota_data, type, cible: cible || 'tous', actif: true }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

export const updateOffre = async (req, res) => {
  const CHAMPS = ['nom', 'description', 'prix', 'debit_download', 'debit_upload', 'quota_data', 'type', 'cible', 'actif'];
  const updates = {};
  CHAMPS.forEach(c => { if (req.body[c] !== undefined) updates[c] = req.body[c]; });
  if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'Aucun champ valide fourni' });
  const { data, error } = await supabaseAdmin.from('offres').update(updates).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

export const deleteOffre = async (req, res) => {
  const { cible } = req.query;
  if (cible) {
    const { data, error } = await supabaseAdmin.from('offres').delete().eq('cible', cible).select();
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ message: `${data.length} offre(s) supprimée(s)`, supprimees: data });
  }
  const { error } = await supabaseAdmin.from('offres').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Offre supprimée' });
};