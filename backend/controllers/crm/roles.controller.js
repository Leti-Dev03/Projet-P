import supabase from '../../config/supabase.js';

// ─────────────────────────────────────────
// GET /api/crm/roles
// ─────────────────────────────────────────
export const getAllRoles = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('nom');

    if (error) throw error;
    return res.status(200).json(data);
  } catch (error) {
    console.error('getAllRoles:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─────────────────────────────────────────
// POST /api/crm/roles
// ─────────────────────────────────────────
export const createRole = async (req, res) => {
  try {
    const { nom, description } = req.body;

    if (!nom) return res.status(400).json({ message: 'Nom du rôle requis' });

    const { data, error } = await supabase
      .from('roles')
      .insert({ nom: nom.trim(), description })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') return res.status(409).json({ message: 'Ce rôle existe déjà' });
      throw error;
    }

    await supabase.from('logs_activite').insert({
      utilisateur_id: req.user.id,
      action: 'CREATE',
      ressource: 'roles',
      ressource_id: data.id,
      details: { nom },
      ip_address: req.ip,
    });

    return res.status(201).json(data);
  } catch (error) {
    console.error('createRole:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─────────────────────────────────────────
// PUT /api/crm/roles/:id
// ─────────────────────────────────────────
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description } = req.body;

    const { data, error } = await supabase
      .from('roles')
      .update({ nom, description })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Rôle introuvable' });

    await supabase.from('logs_activite').insert({
      utilisateur_id: req.user.id,
      action: 'UPDATE',
      ressource: 'roles',
      ressource_id: id,
      details: { nom, description },
      ip_address: req.ip,
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error('updateRole:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─────────────────────────────────────────
// DELETE /api/crm/roles/:id
// ─────────────────────────────────────────
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier qu'aucun utilisateur n'utilise ce rôle
    const { data: utilisateurs } = await supabase
      .from('utilisateur_roles')
      .select('utilisateur_id')
      .eq('role_id', id);

    if (utilisateurs && utilisateurs.length > 0) {
      return res.status(409).json({
        message: `Impossible de supprimer : ${utilisateurs.length} utilisateur(s) ont ce rôle`,
      });
    }

    // Supprimer les permissions liées
    await supabase.from('roles_permissions').delete().eq('role_id', id);

    // Supprimer le rôle
    const { error } = await supabase.from('roles').delete().eq('id', id);
    if (error) throw error;

    await supabase.from('logs_activite').insert({
      utilisateur_id: req.user.id,
      action: 'DELETE',
      ressource: 'roles',
      ressource_id: id,
      ip_address: req.ip,
    });

    return res.status(200).json({ message: 'Rôle supprimé' });
  } catch (error) {
    console.error('deleteRole:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─────────────────────────────────────────
// GET /api/crm/roles/:id/permissions
// ─────────────────────────────────────────
export const getRolePermissions = async (req, res) => {
  try {
    const { id } = req.params;

    // Toutes les ressources + permissions disponibles
    const { data: ressources, error: resError } = await supabase
      .from('ressources')
      .select(`
        id,
        nom,
        description,
        permissions (id, action)
      `)
      .order('nom');

    if (resError) throw resError;

    // Permissions déjà assignées à ce rôle
    const { data: assignees, error: assignError } = await supabase
      .from('roles_permissions')
      .select('permission_id')
      .eq('role_id', id);

    if (assignError) throw assignError;

    const permissionsAssignees = assignees.map((a) => a.permission_id);

    // Construire la matrice
    const matrice = ressources.map((ressource) => ({
      ressource_id: ressource.id,
      ressource_nom: ressource.nom,
      permissions: ressource.permissions.map((perm) => ({
        permission_id: perm.id,
        action: perm.action,
        active: permissionsAssignees.includes(perm.id),
      })),
    }));

    return res.status(200).json(matrice);
  } catch (error) {
    console.error('getRolePermissions:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─────────────────────────────────────────
// PUT /api/crm/roles/:id/permissions
// Met à jour toute la matrice d'un rôle en une fois
// Body: { permission_ids: [uuid, uuid, ...] }
// ─────────────────────────────────────────
export const updateRolePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permission_ids } = req.body;

    if (!Array.isArray(permission_ids)) {
      return res.status(400).json({ message: 'permission_ids doit être un tableau' });
    }

    // Supprimer toutes les permissions actuelles du rôle
    await supabase.from('roles_permissions').delete().eq('role_id', id);

    // Réinsérer les nouvelles permissions
    if (permission_ids.length > 0) {
      const nouvelles = permission_ids.map((permission_id) => ({
        role_id: id,
        permission_id,
      }));

      const { error } = await supabase.from('roles_permissions').insert(nouvelles);
      if (error) throw error;
    }

    await supabase.from('logs_activite').insert({
      utilisateur_id: req.user.id,
      action: 'UPDATE',
      ressource: 'roles_permissions',
      ressource_id: id,
      details: { nb_permissions: permission_ids.length },
      ip_address: req.ip,
    });

    return res.status(200).json({ message: 'Permissions mises à jour' });
  } catch (error) {
    console.error('updateRolePermissions:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─────────────────────────────────────────
// GET /api/crm/roles/ressources
// Liste toutes les ressources et leurs permissions
// ─────────────────────────────────────────
export const getAllRessources = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ressources')
      .select(`
        id,
        nom,
        description,
        permissions (id, action, description)
      `)
      .order('nom');

    if (error) throw error;
    return res.status(200).json(data);
  } catch (error) {
    console.error('getAllRessources:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};