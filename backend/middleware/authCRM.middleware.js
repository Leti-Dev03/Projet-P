import { verifyToken } from '../utils/crm/generateToken.js';
import { compareToken } from '../utils/crm/hashToken.js';
import supabase from '../config/supabase.js';

export const authCRM = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    const token = authHeader.split(' ')[1];

    // Vérifier et décoder le JWT
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return res.status(401).json({ message: 'Token expiré ou invalide' });
    }

    // Récupérer la session depuis la BDD
    const { data: session } = await supabase
      .from('sessions_internes')
      .select('token_hash')
      .eq('utilisateur_id', decoded.id)
      .gt('date_expiration', new Date().toISOString())
      .single();

    // SHA-256 — compareToken est synchrone maintenant
    if (!session || !compareToken(token, session.token_hash)) {
      return res.status(401).json({ message: 'Session invalide ou expirée' });
    }

    // Charger l'utilisateur
    const { data: utilisateur } = await supabase
      .from('utilisateurs_internes')
      .select('*')
      .eq('id', decoded.id)
      .single();

    if (!utilisateur || utilisateur.statut !== 'actif') {
      return res.status(403).json({ message: 'Compte inactif' });
    }

    // Superadmin → bypass total
    if (utilisateur.est_superadmin) {
      req.user = utilisateur;
      req.userRoles = [];
      req.permissions = null; // null = accès total
      return next();
    }

    // Charger les rôles
    const { data: userRolesData } = await supabase
      .from('utilisateur_roles')
      .select('roles(id, nom, description)')
      .eq('utilisateur_id', utilisateur.id);

    const roles = userRolesData?.map(ur => ur.roles) || [];
    const roleIds = roles.map(r => r.id);

    // Charger les permissions
    let permissions = {};
    if (roleIds.length > 0) {
      const { data: rpData } = await supabase
        .from('roles_permissions')
        .select('permissions(action, ressources(nom))')
        .in('role_id', roleIds);

      rpData?.forEach(item => {
        const ressource = item.permissions?.ressources?.nom;
        const action = item.permissions?.action;
        if (ressource && action) {
          if (!permissions[ressource]) permissions[ressource] = [];
          if (!permissions[ressource].includes(action)) permissions[ressource].push(action);
        }
      });
    }

    req.user = utilisateur;
    req.userRoles = roles;
    req.permissions = permissions;
    next();

  } catch (error) {
    console.error('Erreur authCRM:', error);
    return res.status(401).json({ message: 'Authentification échouée' });
  }
};