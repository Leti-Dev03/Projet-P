import { Router } from 'express';
import { getClients, getClientById, updateClient, deleteClient, getOffresClient } from '../controllers/clients.controller.js';

const router = Router();

router.get('/',           getClients);
router.get('/:id',        getClientById);
router.put('/:id',        updateClient);
router.delete('/:id',     deleteClient);
router.get('/:id/offres', getOffresClient);

export default router;