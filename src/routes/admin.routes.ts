import { Router, Request, Response, NextFunction } from 'express';
import adminController from '../controllers/admin.controller';
import { validateAddress, validateAddressParam } from '../middleware/validation.middleware';

const router = Router();

/**
 * @route   POST /api/admin/pause
 * @desc    Pause the contract
 * @access  Admin only (requires DEFAULT_ADMIN_ROLE on contract)
 */
router.post(
    '/pause',
    (req: Request, res: Response, next: NextFunction) => adminController.pauseContract(req, res).catch(next)
);

/**
 * @route   POST /api/admin/unpause
 * @desc    Unpause the contract
 * @access  Admin only (requires DEFAULT_ADMIN_ROLE on contract)
 */
router.post(
    '/unpause',
    (req: Request, res: Response, next: NextFunction) => adminController.unpauseContract(req, res).catch(next)
);

/**
 * @route   POST /api/admin/issuer/add
 * @desc    Add an issuer
 * @access  Admin only (requires DEFAULT_ADMIN_ROLE on contract)
 */
router.post(
    '/issuer/add',
    validateAddress,
    (req: Request, res: Response, next: NextFunction) => adminController.addIssuer(req, res).catch(next)
);

/**
 * @route   POST /api/admin/issuer/remove
 * @desc    Remove an issuer
 * @access  Admin only (requires DEFAULT_ADMIN_ROLE on contract)
 */
router.post(
    '/issuer/remove',
    validateAddress,
    (req: Request, res: Response, next: NextFunction) => adminController.removeIssuer(req, res).catch(next)
);

/**
 * @route   GET /api/admin/issuer/check/:address
 * @desc    Check if address is an issuer
 * @access  Public
 */
router.get(
    '/issuer/check/:address',
    validateAddressParam,
    (req: Request, res: Response, next: NextFunction) => adminController.checkIssuer(req, res).catch(next)
);

export default router;
