import supabase from '../../config/supabase.js';

// ─────────────────────────────────────────
// GET /api/crm/logs
// ─────────────────────────────────────────
export const getLogs = async (req, res) => {
  try {
    const { utilisateur_id, action, ressource, date_debut, date_fin, page = 1, limit = 50 } = req.query;

    let query = supabase
      .from('logs_activite')
      .select(`
        id, action, ressource, ressource_id, details,
        ip_address, date_action,
        utilisateurs_internes ( id, nom, prenom, email )
      `, { count: 'exact' })
      .order('date_action', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (utilisateur_id) query = query.eq('utilisateur_id', utilisateur_id);
    if (action) query = query.eq('action', action);
    if (ressource) query = query.eq('ressource', ressource);
    if (date_debut) query = query.gte('date_action', date_debut);
    if (date_fin) query = query.lte('date_action', date_fin);

    const { data, error, count } = await query;
    if (error) throw error;

    return res.status(200).json({ data, total: count, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error('getLogs:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─────────────────────────────────────────
// GET /api/crm/logs/user/:id
// ─────────────────────────────────────────
export const getLogsByUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('logs_activite')
      .select('*')
      .eq('utilisateur_id', id)
      .order('date_action', { ascending: false })
      .limit(100);

    if (error) throw error;
    return res.status(200).json(data);
  } catch (error) {
    console.error('getLogsByUser:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};