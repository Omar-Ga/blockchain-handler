import { Router, Request, Response, NextFunction } from 'express';
import signatureController from '../controllers/signature.controller';
import { validateGenerateSignature } from '../middleware/validation.middleware';

const router = Router();

/**
 * @route   POST /api/signature/generate
 * @desc    Generate a unique signature from certificate data
 * @access  Public
 */
router.post(
    '/generate',
    validateGenerateSignature,
    (req: Request, res: Response, next: NextFunction) => signatureController.generateSignature(req, res).catch(next)
);

export default router;
