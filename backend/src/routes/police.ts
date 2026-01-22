import express from 'express';
import { login, getProfile } from '../controllers/policeController';
import { getReports, getReport, updateReportStatus } from '../controllers/reportController';
import { authenticatePolice } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes (require authentication)
router.use(authenticatePolice);

router.get('/profile', getProfile);
router.get('/reports', getReports);
router.get('/reports/:id', getReport);
router.put('/reports/:id/status', updateReportStatus);

export default router;