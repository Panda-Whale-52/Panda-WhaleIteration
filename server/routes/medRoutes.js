import express from 'express';
import medController from '../controllers/medController.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.get('/', authenticate, medController.getAllMeds);
router.post('/', authenticate, medController.createMed);
router.put('/:id', authenticate, medController.updateMed);
router.delete('/:id', authenticate, medController.deleteMed);

export default router;
