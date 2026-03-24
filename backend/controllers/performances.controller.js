import { supabaseAdmin } from '../config/supabase.js';

// GET /api/performances/agents
export const getPerformancesAgents = async (req, res) => {
  const { data: agents } = await supabaseAdmin.from('utilisateurs').select('id, nom, prenom, email').eq('role', 'agent').eq('actif', true);

  const performances = await Promise.all((agents || []).map(async (agent) => {
    const { data: reclamations } = await supabaseAdmin.from('reclamations').select('statut, created_at, resolu_at').eq('agent_id', agent.id);
    const total = reclamations?.length || 0;
    const resolues = reclamations?.filter(r => r.statut === 'resolu' || r.statut === 'ferme').length || 0;
    const taux = total > 0 ? Math.round((resolues / total) * 100) : 0;

    const tempsMoyen = reclamations?.filter(r => r.resolu_at).reduce((acc, r) => {
      return acc + (new Date(r.resolu_at) - new Date(r.created_at)) / 3600000;
    }, 0) / (resolues || 1);

    const score = Math.min(100, Math.round(taux * 0.6 + (resolues * 2) + Math.max(0, 20 - tempsMoyen)));

    return { agent, total_reclamations: total, reclamations_resolues: resolues, taux_resolution: taux, temps_moyen_heures: Math.round(tempsMoyen * 10) / 10, score_performance: score, niveau: score >= 80 ? 'Excellent' : score >= 60 ? 'Bon' : score >= 40 ? 'Moyen' : 'À améliorer' };
  }));

  res.json(performances.sort((a, b) => b.score_performance - a.score_performance));
};

// GET /api/performances/techniciens
export const getPerformancesTechniciens = async (req, res) => {
  const { data: techniciens } = await supabaseAdmin.from('techniciens').select('id, nom, prenom, email, specialite, zone_intervention');

  const performances = await Promise.all((techniciens || []).map(async (tech) => {
    const { data: interventions } = await supabaseAdmin.from('interventions').select('statut, created_at, date_debut, date_fin').eq('technicien_id', tech.id);
    const total = interventions?.length || 0;
    const terminees = interventions?.filter(i => i.statut === 'termine').length || 0;
    const taux = total > 0 ? Math.round((terminees / total) * 100) : 0;

    const dureeMoyenne = interventions?.filter(i => i.date_debut && i.date_fin).reduce((acc, i) => {
      return acc + (new Date(i.date_fin) - new Date(i.date_debut)) / 60000;
    }, 0) / (terminees || 1);

    const tempsMoyenReponse = interventions?.filter(i => i.date_debut).reduce((acc, i) => {
      return acc + (new Date(i.date_debut) - new Date(i.created_at)) / 60000;
    }, 0) / (total || 1);

    const score = Math.min(100, Math.round(taux * 0.5 + Math.max(0, 30 - tempsMoyenReponse / 60) + terminees * 1.5));

    return { technicien: tech, total_interventions: total, interventions_terminees: terminees, taux_resolution: taux, duree_moyenne_minutes: Math.round(dureeMoyenne), temps_moyen_reponse_minutes: Math.round(tempsMoyenReponse), score_performance: score, niveau: score >= 80 ? 'Excellent' : score >= 60 ? 'Bon' : score >= 40 ? 'Moyen' : 'À améliorer' };
  }));

  res.json(performances.sort((a, b) => b.score_performance - a.score_performance));
};

// GET /api/performances/techniciens/:id
export const getPerformanceTechnicien = async (req, res) => {
  const { data: tech } = await supabaseAdmin.from('techniciens').select('*').eq('id', req.params.id).single();
  if (!tech) return res.status(404).json({ error: 'Technicien non trouvé' });

  const { data: interventions } = await supabaseAdmin.from('interventions').select('*').eq('technicien_id', req.params.id).order('created_at', { ascending: false });

  const total = interventions?.length || 0;
  const terminees = interventions?.filter(i => i.statut === 'termine').length || 0;
  const enCours = interventions?.filter(i => i.statut === 'en_cours' || i.statut === 'en_route').length || 0;

  res.json({ technicien: tech, total, terminees, en_cours: enCours, taux_resolution: total > 0 ? Math.round(terminees / total * 100) : 0, interventions_recentes: interventions?.slice(0, 5) });
};