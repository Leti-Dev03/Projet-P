import supabase from '../../config/supabase.js';
import { hashPassword } from '../../utils/crm/hashPassword.js';
import { generatePassword } from '../../utils/crm/generatePassword.js';
import { sendEmail } from '../../utils/crm/sendEmail.js';
import { welcomeEmail } from '../../utils/crm/welcome.email.js';
import { resetPasswordEmail } from '../../utils/crm/resetPassword.email.js';

export const getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('utilisateurs_internes')
      .select(`
        id, nom, prenom, email, telephone, statut,
        date_creation, dernier_login, est_superadmin,
        utilisateur_roles ( roles ( id, nom ) )
      `)
      .order('date_creation', { ascending: false });

    if (error) throw error;
    const users = data.map((u) => ({
      ...u,
      roles: u.utilisateur_roles.map((ur) => ur.roles),
      utilisateur_roles: undefined,
    }));
    return res.status(200).json(users);
  } catch (error) {
    console.error('getAllUsers:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('utilisateurs_internes')
      .select(`
        id, nom, prenom, email, telephone, statut,
        date_creation, dernier_login, est_superadmin,
        utilisateur_roles ( roles ( id, nom, description ) )
      `)
      .eq('id', id).single();

    if (error || !data) return res.status(404).json({ message: 'Utilisateur introuvable' });
    const user = { ...data, roles: data.utilisateur_roles.map((ur) => ur.roles), utilisateur_roles: undefined };
    return res.status(200).json(user);
  } catch (error) {
    console.error('getUserById:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { nom, prenom, email, telephone, role_id, specialite, zone_intervention, wilaya } = req.body;

    if (!nom || !prenom || !email || !role_id)
      return res.status(400).json({ message: 'nom, prenom, email et role_id sont requis' });

    const { data: existant } = await supabase
      .from('utilisateurs_internes').select('id')
      .eq('email', email.toLowerCase().trim()).single();
    if (existant) return res.status(409).json({ message: 'Cet email est déjà utilisé' });

    const { data: role } = await supabase.from('roles').select('nom').eq('id', role_id).single();
    if (!role) return res.status(404).json({ message: 'Rôle introuvable' });

    const passwordTemporaire = generatePassword();
    const passwordHash = await hashPassword(passwordTemporaire);

    const { data: nouvelUser, error: createError } = await supabase
      .from('utilisateurs_internes')
      .insert({
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email.toLowerCase().trim(),
        telephone,
        password_hash: passwordHash,
        statut: 'actif',
        est_superadmin: false,
        // premiere_connexion retiré — colonne pas encore en BDD
      })
      .select().single();

    if (createError) throw createError;

    await supabase.from('utilisateur_roles').insert({ utilisateur_id: nouvelUser.id, role_id });

    if (role.nom.toLowerCase() === 'technicien') {
      await supabase.from('techniciens').insert({
        utilisateur_id: nouvelUser.id,
        nom: nouvelUser.nom, prenom: nouvelUser.prenom,
        email: nouvelUser.email, telephone,
        specialite, zone_intervention, wilaya,
      });
    }

    const { subject, html } = welcomeEmail({
      prenom: nouvelUser.prenom, nom: nouvelUser.nom,
      email: nouvelUser.email, password: passwordTemporaire, role: role.nom,
    });
    await sendEmail({ to: nouvelUser.email, subject, html });

    await supabase.from('logs_activite').insert({
      utilisateur_id: req.user.id, action: 'CREATE',
      ressource: 'utilisateurs_internes', ressource_id: nouvelUser.id,
      details: { email: nouvelUser.email, role: role.nom }, ip_address: req.ip,
    });

    const { password_hash, ...userSansMotDePasse } = nouvelUser;
    return res.status(201).json({ message: 'Compte créé et email envoyé', utilisateur: userSansMotDePasse });

  } catch (error) {
    console.error('createUser:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, telephone } = req.body;
    const { data, error } = await supabase
      .from('utilisateurs_internes').update({ nom, prenom, telephone })
      .eq('id', id).select('id, nom, prenom, email, telephone, statut').single();
    if (error || !data) return res.status(404).json({ message: 'Utilisateur introuvable' });
    await supabase.from('logs_activite').insert({
      utilisateur_id: req.user.id, action: 'UPDATE',
      ressource: 'utilisateurs_internes', ressource_id: id,
      details: { nom, prenom, telephone }, ip_address: req.ip,
    });
    return res.status(200).json(data);
  } catch (error) {
    console.error('updateUser:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const toggleStatut = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;
    const statutsValides = ['actif', 'inactif', 'suspendu', 'bloque'];
    if (!statutsValides.includes(statut)) return res.status(400).json({ message: 'Statut invalide' });
    if (id === req.user.id) return res.status(400).json({ message: 'Vous ne pouvez pas modifier votre propre statut' });

    const { data, error } = await supabase
      .from('utilisateurs_internes').update({ statut })
      .eq('id', id).select('id, nom, prenom, email, statut').single();
    if (error || !data) return res.status(404).json({ message: 'Utilisateur introuvable' });

    if (statut !== 'actif') await supabase.from('sessions_internes').delete().eq('utilisateur_id', id);

    await supabase.from('logs_activite').insert({
      utilisateur_id: req.user.id, action: 'UPDATE',
      ressource: 'utilisateurs_internes', ressource_id: id,
      details: { statut }, ip_address: req.ip,
    });
    return res.status(200).json({ message: `Compte ${statut}`, utilisateur: data });
  } catch (error) {
    console.error('toggleStatut:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const assignRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_id } = req.body;
    if (!role_id) return res.status(400).json({ message: 'role_id requis' });
    await supabase.from('utilisateur_roles').delete().eq('utilisateur_id', id);
    const { error } = await supabase.from('utilisateur_roles').insert({ utilisateur_id: id, role_id });
    if (error) throw error;
    await supabase.from('logs_activite').insert({
      utilisateur_id: req.user.id, action: 'UPDATE',
      ressource: 'utilisateur_roles', ressource_id: id,
      details: { nouveau_role_id: role_id }, ip_address: req.ip,
    });
    return res.status(200).json({ message: 'Rôle mis à jour' });
  } catch (error) {
    console.error('assignRole:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: utilisateur, error } = await supabase
      .from('utilisateurs_internes').select('id, nom, prenom, email').eq('id', id).single();
    if (error || !utilisateur) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const nouveauPassword = generatePassword();
    const passwordHash = await hashPassword(nouveauPassword);

    await supabase.from('utilisateurs_internes')
      .update({ password_hash: passwordHash })  // premiere_connexion retiré
      .eq('id', id);

    await supabase.from('sessions_internes').delete().eq('utilisateur_id', id);

    const adminNom = `${req.user.prenom} ${req.user.nom}`;
    const { subject, html } = resetPasswordEmail({
      prenom: utilisateur.prenom, nom: utilisateur.nom,
      email: utilisateur.email, password: nouveauPassword, adminNom,
    });
    await sendEmail({ to: utilisateur.email, subject, html });

    await supabase.from('logs_activite').insert({
      utilisateur_id: req.user.id, action: 'RESET_PASSWORD',
      ressource: 'utilisateurs_internes', ressource_id: id,
      details: { reset_par: req.user.email }, ip_address: req.ip,
    });
    return res.status(200).json({ message: 'Mot de passe réinitialisé et email envoyé' });
  } catch (error) {
    console.error('resetPassword:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};