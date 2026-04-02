import nodemailer from 'nodemailer';

// Configuration du transporteur Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const FROM_EMAIL = process.env.FROM_EMAIL || 'algtc2026@gmail.com';

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log(`📧 Tentative envoi email à : ${to}`);
    console.log(`📧 FROM_EMAIL : ${FROM_EMAIL}`);
    console.log(`📧 EMAIL_USER configuré : ${!!process.env.EMAIL_USER}`);
    console.log(`📧 EMAIL_PASS configuré : ${!!process.env.EMAIL_PASS}`);

    const mailOptions = {
      from: `Algérie Télécom CRM <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email envoyé à ${to} | ID: ${info.messageId}`);
    return { success: true, id: info.messageId };
  } catch (error) {
    console.error(`❌ Erreur envoi email à ${to}:`);
    console.error(`   Message: ${error.message}`);
    console.error(`   Détails:`, error);
    return { success: false, error: error.message };
  }
};