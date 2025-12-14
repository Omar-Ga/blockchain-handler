import { Router, Request, Response, NextFunction } from 'express';
import statsController from '../controllers/stats.controller';

const router = Router();

/**
 * @route   GET /api/stats
 * @desc    Get all contract statistics
 * @access  Public
 */
router.get(
    '/',
    (req: Request, res: Response, next: NextFunction) => statsController.getStats(req, res).catch(next)
);

/**
 * @route   GET /api/stats/total
 * @desc    Get total certificates issued
 * @access  Public
 */
router.get(
    '/total',
    (req: Request, res: Response, next: NextFunction) => statsController.getTotalCertificates(req, res).catch(next)
);

/**
 * @route   GET /api/stats/paused
 * @desc    Get contract paused status
 * @access  Public
 */
router.get(
    '/paused',
    (req: Request, res: Response, next: NextFunction) => statsController.getPausedStatus(req, res).catch(next)
);

export default router;
