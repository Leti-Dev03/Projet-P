import supabase from '../../config/supabase.js';
import { comparePassword } from '../../utils/crm/hashPassword.js';
import { generateToken } from '../../utils/crm/generateToken.js';
import { hashToken } from '../../utils/crm/hashToken.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' });

    const { data: utilisateur, error } = await supabase
      .from('utilisateurs_internes')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !utilisateur) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    if (utilisateur.statut !== 'actif') return res.status(403).json({ message: 'Compte désactivé ou suspendu' });

    const passwordValide = await comparePassword(password, utilisateur.password_hash);
    if (!passwordValide) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

    const token = generateToken({
      id: utilisateur.id,
      email: utilisateur.email,
      est_superadmin: utilisateur.est_superadmin || false,
    });

    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);

    // SHA-256 — synchrone, pas besoin de await
    const tokenHash = hashToken(token);

    await supabase.from('sessions_internes').insert({
      utilisateur_id: utilisateur.id,
      token_hash: tokenHash,
      ip_address: req.ip || req.headers['x-forwarded-for'],
      user_agent: req.headers['user-agent'],
      date_expiration: expiresAt.toISOString(),
    });

    await supabase.from('utilisateurs_internes')
      .update({ dernier_login: new Date().toISOString() })
      .eq('id', utilisateur.id);

    await supabase.from('logs_activite').insert({
      utilisateur_id: utilisateur.id,
      action: 'LOGIN',
      ressource: 'auth',
      details: { email: utilisateur.email },
    });

    const { password_hash, ...userSafe } = utilisateur;
    return res.status(200).json({ message: 'Connexion réussie', token, utilisateur: userSafe });

  } catch (error) {
    console.error('Erreur login:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const logout = async (req, res) => {
  try {
    await supabase.from('sessions_internes').delete().eq('utilisateur_id', req.user.id);
    await supabase.from('logs_activite').insert({
      utilisateur_id: req.user.id,
      action: 'LOGOUT',
      ressource: 'auth',
    });
    return res.status(200).json({ message: 'Déconnexion réussie' });
  } catch (error) {
    console.error('Erreur logout:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const me = async (req, res) => {
  try {
    const { password_hash, ...userSafe } = req.user;
    return res.status(200).json({
      utilisateur: userSafe,
      roles: req.userRoles || [],
      permissions: req.permissions || null,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};