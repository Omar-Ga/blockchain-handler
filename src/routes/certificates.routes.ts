import { Router, Request, Response, NextFunction } from 'express';
import certificateController from '../controllers/certificates.controller';
import {
    validateIssueCertificate,
    validateRevokeCertificate,
    validateSignatureParam,
    validateCreateCertificate,
} from '../middleware/validation.middleware';

const router = Router();

/**
 * @route   POST /api/certificates/create
 * @desc    Create a new certificate (Sign + Issue)
 * @access  Public (requires ISSUER_ROLE on contract)
 */
router.post(
    '/create',
    validateCreateCertificate,
    (req: Request, res: Response, next: NextFunction) => certificateController.createCertificate(req, res).catch(next)
);

/**
 * @route   POST /api/certificates/issue
 * @desc    Issue a new certificate
 * @access  Public (requires ISSUER_ROLE on contract)
 */
router.post(
    '/issue',
    validateIssueCertificate,
    (req: Request, res: Response, next: NextFunction) => certificateController.issueCertificate(req, res).catch(next)
);

/**
 * @route   GET /api/certificates/verify/:signature
 * @desc    Verify a certificate
 * @access  Public
 */
router.get(
    '/verify/:signature',
    validateSignatureParam,
    (req: Request, res: Response, next: NextFunction) => certificateController.verifyCertificate(req, res).catch(next)
);

/**
 * @route   GET /api/certificates/:signature
 * @desc    Get certificate details
 * @access  Public
 */
router.get(
    '/:signature',
    validateSignatureParam,
    (req: Request, res: Response, next: NextFunction) => certificateController.getCertificate(req, res).catch(next)
);

/**
 * @route   POST /api/certificates/revoke
 * @desc    Revoke a certificate
 * @access  Public (requires ISSUER_ROLE on contract)
 */
router.post(
    '/revoke',
    validateRevokeCertificate,
    (req: Request, res: Response, next: NextFunction) => certificateController.revokeCertificate(req, res).catch(next)
);

/**
 * @route   GET /api/certificates/exists/:signature
 * @desc    Check if certificate exists
 * @access  Public
 */
router.get(
    '/exists/:signature',
    validateSignatureParam,
    (req: Request, res: Response, next: NextFunction) => certificateController.checkExists(req, res).catch(next)
);

export default router;
