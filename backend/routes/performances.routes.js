import { Router } from 'express';
import { getPerformancesAgents, getPerformancesTechniciens, getPerformanceTechnicien } from '../controllers/performances.controller.js';

const router = Router();

router.get('/agents',          getPerformancesAgents);
router.get('/techniciens',     getPerformancesTechniciens);
router.get('/techniciens/:id', getPerformanceTechnicien);

export default router;