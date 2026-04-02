import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import supabase from '../config/supabase.js';
import { hashPassword } from '../utils/crm/hashPassword.js';

// Configuration pour les chemins
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, '../.env') });

const seed = async () => {
  console.log('🌱 Démarrage du seed...');

  // ─────────────────────────────────────────
  // 1. RESSOURCES
  // ─────────────────────────────────────────
  const ressources = [
    { nom: 'clients',              description: 'Gestion des clients' },
    { nom: 'factures',             description: 'Gestion des factures' },
    { nom: 'reclamations',         description: 'Gestion des réclamations' },
    { nom: 'interventions',        description: 'Gestion des interventions' },
    { nom: 'offres',               description: 'Gestion des offres' },
    { nom: 'demandes_service',     description: 'Gestion des demandes de service' },
    { nom: 'rapports',             description: 'Génération de rapports' },
    { nom: 'utilisateurs',         description: 'Gestion des utilisateurs internes' },
    { nom: 'roles',                description: 'Gestion des rôles et permissions' },
    { nom: 'techniciens',          description: 'Gestion des techniciens' },
    { nom: 'logs',                 description: 'Consultation des logs' },
    { nom: 'performances',         description: 'Suivi des performances' },
  ];

  const { data: ressourcesData, error: resError } = await supabase
    .from('ressources')
    .upsert(ressources, { onConflict: 'nom' })
    .select();

  if (resError) { console.error('❌ Ressources:', resError); return; }
  console.log(`✅ ${ressourcesData.length} ressources créées`);

  // ─────────────────────────────────────────
  // 2. PERMISSIONS (create, read, update, delete pour chaque ressource)
  // ─────────────────────────────────────────
  const actions = ['create', 'read', 'update', 'delete'];
  const permissions = [];

  for (const ressource of ressourcesData) {
    for (const action of actions) {
      permissions.push({
        ressource_id: ressource.id,
        action,
        description: `${action} sur ${ressource.nom}`,
      });
    }
  }

  const { data: permissionsData, error: permError } = await supabase
    .from('permissions')
    .upsert(permissions, { onConflict: 'ressource_id, action' })
    .select();

  if (permError) { console.error('❌ Permissions:', permError); return; }
  console.log(`✅ ${permissionsData.length} permissions créées`);

  // ─────────────────────────────────────────
  // 3. RÔLE ADMIN
  // ─────────────────────────────────────────
  const { data: roleAdmin, error: roleError } = await supabase
    .from('roles')
    .upsert({ nom: 'admin', description: 'Accès total au CRM' }, { onConflict: 'nom' })
    .select()
    .single();

  if (roleError) { console.error('❌ Rôle admin:', roleError); return; }
  console.log(`✅ Rôle admin créé : ${roleAdmin.id}`);

  // ─────────────────────────────────────────
  // 4. ASSIGNER TOUTES LES PERMISSIONS AU RÔLE ADMIN
  // ─────────────────────────────────────────
  const rolesPermissions = permissionsData.map((p) => ({
    role_id: roleAdmin.id,
    permission_id: p.id,
  }));

  const { error: rpError } = await supabase
    .from('roles_permissions')
    .upsert(rolesPermissions, { onConflict: 'role_id, permission_id' });

  if (rpError) { console.error('❌ roles_permissions:', rpError); return; }
  console.log(`✅ ${rolesPermissions.length} permissions assignées au rôle admin`);

  // ─────────────────────────────────────────
  // 5. CRÉER LE COMPTE ADMIN
  // ─────────────────────────────────────────
  const adminEmail = 'admin@algerie-telecom.dz';
  const adminPassword = 'Admin@2024!'; // À changer immédiatement après le seed

  const passwordHash = await hashPassword(adminPassword);

  const { data: adminUser, error: adminError } = await supabase
    .from('utilisateurs_internes')
    .upsert({
      nom: 'Admin',
      prenom: 'Système',
      email: adminEmail,
      password_hash: passwordHash,
      statut: 'actif',
      est_superadmin: true,
    }, { onConflict: 'email' })
    .select()
    .single();

  if (adminError) { console.error('❌ Admin user:', adminError); return; }
  console.log(`✅ Compte admin créé : ${adminUser.email}`);

  // Assigner le rôle admin
  await supabase
    .from('utilisateur_roles')
    .upsert({ utilisateur_id: adminUser.id, role_id: roleAdmin.id }, { onConflict: 'utilisateur_id, role_id' });

  console.log('\n🎉 Seed terminé avec succès !');
  console.log('─────────────────────────────');
  console.log(`📧 Email admin    : ${adminEmail}`);
  console.log(`🔑 Mot de passe   : ${adminPassword}`);
  console.log('─────────────────────────────');
};

seed().catch(console.error);