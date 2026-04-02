require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PORT } = require('/env');

const app = express();

// ─────────────────────────────────────────
// Middlewares globaux
// ─────────────────────────────────────────
app.use(cors({
  origin: process.env.CRM_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────
// Routes CRM
// ─────────────────────────────────────────
app.use('/api/crm/auth', require('./routes/crm/auth.routes'));
app.use('/api/crm/users', require('./routes/crm/users.routes'));
app.use('/api/crm/roles', require('./routes/crm/roles.routes'));
app.use('/api/crm/techniciens', require('./routes/crm/techniciens.routes'));
app.use('/api/crm/interventions', require('./routes/crm/interventions.routes'));
app.use('/api/crm/logs', require('./routes/crm/logs.routes'));
app.use('/api/crm/notifications', require('./routes/crm/notifications.routes'));

// ─────────────────────────────────────────
// Route de santé
// ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'CRM API is running' });
});

// ─────────────────────────────────────────
// Middleware gestion d'erreurs global
// ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Erreur globale:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Erreur serveur interne',
  });
});

// ─────────────────────────────────────────
// Démarrage serveur
// ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ CRM API démarrée sur le port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;