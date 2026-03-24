import { supabaseAdmin } from '../config/supabase.js';

// Vérifie le token et récupère le rôle
export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant' });

  // Chercher dans clients
  const { data: client } = await supabaseAdmin
    .from('clients').select('id, nom, prenom, email, statut_compte')
    .eq('id', token).maybeSingle();

  if (client) {
    if (client.statut_compte !== 'actif')
      return res.status(403).json({ error: 'Compte suspendu' });
    req.user = { ...client, role: 'client' };
    return next();
  }

  // Chercher dans utilisateurs
  const { data: utilisateur } = await supabaseAdmin
    .from('utilisateurs').select('id, nom, prenom, email, role, actif')
    .eq('id', token).maybeSingle();

  if (utilisateur) {
    if (!utilisateur.actif)
      return res.status(403).json({ error: 'Compte désactivé' });
    req.user = utilisateur;
    return next();
  }

  return res.status(401).json({ error: 'Token invalide' });
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role))
    return res.status(403).json({ error: `Accès refusé. Rôle requis : ${roles.join(' ou ')}` });
  next();
};