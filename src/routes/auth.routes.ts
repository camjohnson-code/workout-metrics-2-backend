import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const router = Router();

router.get('/callback', authController.handleCallback);
router.get('/downloading-activities', authController.handleDownloadingActivities);
router.get('/verify-session', authController.verifySession);

export default router;
