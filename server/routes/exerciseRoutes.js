import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import exerciseController from '../controllers/exerciseController.js';

const router = express.Router();

router.get('/', authenticate, exerciseController.getUserExercise);  // -> Authenticate brings the userId when the tokens ("keys") matches
router.post('/', authenticate, exerciseController.createExercise); // -> Authenticate brings the userId when the tokens ("keys") matches

// router.put('/:id', exerciseController.updateExercise);
// router.delete('/:id', exerciseController.deleteExercise);

export default router;
