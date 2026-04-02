import supabase from '../../config/supabase.js';

// ─────────────────────────────────────────
// GET /api/crm/notifications
// Notifications de l'utilisateur connecté
// ─────────────────────────────────────────
export const getMyNotifications = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('destinataire_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return res.status(200).json(data);
  } catch (error) {
    console.error('getMyNotifications:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─────────────────────────────────────────
// PUT /api/crm/notifications/:id/read
// ─────────────────────────────────────────
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('notifications')
      .update({ lue: true })
      .eq('id', id)
      .eq('destinataire_id', req.user.id);

    if (error) throw error;
    return res.status(200).json({ message: 'Notification marquée comme lue' });
  } catch (error) {
    console.error('markAsRead:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─────────────────────────────────────────
// PUT /api/crm/notifications/read-all
// ─────────────────────────────────────────
export const markAllAsRead = async (req, res) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ lue: true })
      .eq('destinataire_id', req.user.id)
      .eq('lue', false);

    if (error) throw error;
    return res.status(200).json({ message: 'Toutes les notifications marquées comme lues' });
  } catch (error) {
    console.error('markAllAsRead:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};