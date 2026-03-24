import { Resend } from 'resend';
import 'dotenv/config';

const resend = new Resend(process.env.RESEND_API_KEY);

export const envoyerOTP = async (email, otp) => {
  const { error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Votre code de vérification — CRM AT',
    html: `
      <div style="font-family:Arial;max-width:480px;margin:auto;padding:24px;border:1px solid #eee;border-radius:8px">
        <h2 style="color:#006837">Algérie Télécom</h2>
        <p>Votre code de vérification :</p>
        <div style="font-size:40px;font-weight:bold;letter-spacing:10px;color:#006837;text-align:center;padding:16px 0">${otp}</div>
        <p style="color:#666;font-size:13px">Ce code expire dans <strong>10 minutes</strong>.</p>
      </div>`
  });
  if (error) throw new Error('Erreur envoi email : ' + error.message);
};

export const envoyerConfirmationClient = async (email, nom) => {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Bienvenue chez Algérie Télécom',
    html: `<div style="font-family:Arial;padding:24px"><h2 style="color:#006837">Bienvenue ${nom} !</h2><p>Votre compte a été créé avec succès.</p></div>`
  });
};

export const envoyerDecisionInscription = async (email, nom, role, decision, motif) => {
  const valide = decision === 'valide';
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: valide ? 'Inscription validée' : 'Inscription refusée',
    html: `<div style="font-family:Arial;padding:24px"><h2 style="color:${valide?'#006837':'#cc0000'}">${valide?`Bienvenue ${nom} !`:'Inscription refusée'}</h2>${valide?`<p>Votre compte <strong>${role}</strong> a été validé.</p>`:`<p>Motif : ${motif||'Dossier non conforme'}</p>`}</div>`
  });
};

export const envoyerNotification = async (email, titre, message) => {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: titre,
    html: `<div style="font-family:Arial;padding:24px"><h2 style="color:#006837">${titre}</h2><p>${message}</p></div>`
  });
};