import express from 'express';
import { getDashboardStats } from '../controllers/statsController';
import { authenticatePolice } from '../middleware/auth';

const router = express.Router();

// All stats routes require police authentication
router.use(authenticatePolice);

router.get('/', getDashboardStats);

export default router;