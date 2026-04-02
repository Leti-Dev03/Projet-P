/**
 * Template email reset mot de passe (déclenché par l'admin)
 * @param {object} params
 * @param {string} params.prenom
 * @param {string} params.nom
 * @param {string} params.email
 * @param {string} params.password - nouveau mot de passe temporaire en clair
 * @param {string} params.adminNom - nom de l'admin qui a fait le reset
 * @returns {object} { subject, html }
 */
export const resetPasswordEmail = ({ prenom, nom, email, password, adminNom }) => {
  const subject = 'Réinitialisation de votre mot de passe — CRM Algérie Télécom';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <div style="background-color: #006837; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Algérie Télécom — CRM Interne</h1>
      </div>

      <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">

        <p style="font-size: 16px;">Bonjour <strong>${prenom} ${nom}</strong>,</p>

        <p>Votre mot de passe a été réinitialisé par l'administrateur <strong>${adminNom}</strong>.</p>

        <div style="background-color: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Vos nouveaux identifiants :</strong></p>
          <p style="margin: 5px 0;">📧 Email : <strong>${email}</strong></p>
          <p style="margin: 5px 0;">🔑 Nouveau mot de passe temporaire : <strong style="font-size: 18px; color: #006837; letter-spacing: 2px;">${password}</strong></p>
        </div>

        <div style="background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #856404;">⚠️ Connectez-vous et changez immédiatement ce mot de passe temporaire.</p>
        </div>

        <a href="${process.env.CRM_URL || 'http://crm.interne.com'}" 
           style="display: inline-block; background-color: #006837; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
          Accéder au CRM
        </a>

        <p style="margin-top: 30px; font-size: 12px; color: #999;">
          Si vous n'avez pas demandé cette réinitialisation, contactez immédiatement votre administrateur.
        </p>

      </div>
    </div>
  `;

  return { subject, html };
};