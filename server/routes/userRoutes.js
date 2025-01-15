import express from 'express';
import userController from '../controllers/userController.js';
import authenticate from '../middlewares/authenticate.js';
const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
// router.get('/me', authenticate, userController.getUserProfile);
// router.put('/me', authenticate, userController.updateUserProfile);
router.get('/me', authenticate, userController.getUserInfo);

export default router;
