import { Router } from 'express';
import adminElectionsRouter from './admin/elections';
import adminUsersRouter from './admin/users';
import adminCandidatesRouter from './admin/candidates';
import adminStatsRouter from './admin/stats';
import adminConfigRouter from './admin/config';
import voterElectionsRouter from './voter/elections';
import authRouter from './auth';
import electionsRouter from './elections';
import candidatesRouter from './candidates';
import votesRouter from './votes';

// Initialize the main router
const router = Router();

// API version
const API_VERSION = 'v1';

// Admin routes
router.use(`/${API_VERSION}/admin/elections`, adminElectionsRouter);
router.use(`/${API_VERSION}/admin/users`, adminUsersRouter);
router.use(`/${API_VERSION}/admin/elections`, adminCandidatesRouter);
router.use(`/${API_VERSION}/admin/stats`, adminStatsRouter);
router.use(`/${API_VERSION}/admin/config`, adminConfigRouter);

// Voter routes
router.use(`/${API_VERSION}/voter/elections`, voterElectionsRouter);

// Auth routes
router.use(`/${API_VERSION}/auth`, authRouter);

// Election routes
router.use(`/${API_VERSION}/elections`, electionsRouter);

// Candidate routes
router.use(`/${API_VERSION}/candidates`, candidatesRouter);

// Vote routes
router.use(`/${API_VERSION}/votes`, votesRouter);

// Public API routes
router.get(`/${API_VERSION}/healthcheck`, (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString() 
  });
});

// Handle 404 for API routes
router.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
    status: 404
  });
});

export default router; 