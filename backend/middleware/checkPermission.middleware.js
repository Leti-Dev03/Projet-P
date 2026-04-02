/**
 * Middleware RBAC dynamique
 * Vérifie si l'utilisateur connecté a le droit d'effectuer une action sur une ressource
 *
 * Usage dans les routes :
 * router.get('/clients', authCRM, checkPermission('clients', 'read'), controller)
 *
 * @param {string} ressource - nom de la ressource (ex: 'clients', 'factures')
 * @param {string} action - action demandée : 'create' | 'read' | 'update' | 'delete'
 */
export const checkPermission = (ressource, action) => {
  return (req, res, next) => {
    try {
      // 1. Vérifier que authCRM a bien été appelé avant
      if (!req.user) {
        return res.status(401).json({ message: 'Non authentifié' });
      }

      // 2. Superadmin → accès total, bypass
      if (req.user.est_superadmin) {
        return next();
      }

      // 3. Vérifier les permissions chargées par authCRM
      const permissions = req.permissions;

      if (!permissions) {
        return res.status(403).json({ message: 'Aucune permission définie' });
      }

      // 4. Vérifier si la ressource existe dans ses permissions
      const actionsAutorisees = permissions[ressource];

      if (!actionsAutorisees || !actionsAutorisees.includes(action)) {
        return res.status(403).json({
          message: `Accès refusé : vous n'avez pas le droit "${action}" sur "${ressource}"`,
        });
      }

      // 5. Permission accordée
      next();

    } catch (error) {
      console.error('Erreur checkPermission:', error);
      return res.status(500).json({ message: 'Erreur serveur dans la vérification des permissions' });
    }
  };
};