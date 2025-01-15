import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import exerciseController from '../controllers/exerciseController.js';

const router = express.Router();

router.get('/', authenticate, exerciseController.getLatestExerciseForAllTypes);
router.get(
  '/details/:type',
  authenticate,
  exerciseController.getAllExercisesByType
);

router.post('/', authenticate, exerciseController.createExercise);
router.put('/:id', exerciseController.updateExercise);
router.delete('/:id', exerciseController.deleteExercise);

export default router;
