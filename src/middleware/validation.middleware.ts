import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { isValidAddress } from '../config/utils';

/**
 * Validate request and return errors if any
 */
export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array(),
        });
    }
    return next();
};

/**
 * Validation rules for issuing certificate
 */
export const validateIssueCertificate = [
    body('signature').notEmpty().withMessage('Signature is required'),
    body('courseName').notEmpty().withMessage('Course name is required'),
    body('studentName').notEmpty().withMessage('Student name is required'),
    body('instructorName').notEmpty().withMessage('Instructor name is required'),
    validate,
];

/**
 * Validation rules for revoking certificate
 */
export const validateRevokeCertificate = [
    body('signature').notEmpty().withMessage('Signature is required'),
    body('reason').notEmpty().withMessage('Reason is required'),
    validate,
];

/**
 * Validation rules for signature parameter
 */
export const validateSignatureParam = [
    param('signature').notEmpty().withMessage('Signature is required'),
    validate,
];

/**
 * Validation rules for Ethereum address
 */
export const validateAddress = [
    body('address')
        .notEmpty()
        .withMessage('Address is required')
        .custom((value) => {
            if (!isValidAddress(value)) {
                throw new Error('Invalid Ethereum address');
            }
            return true;
        }),
    validate,
];

/**
 * Validation rules for address parameter
 */
export const validateAddressParam = [
    param('address')
        .notEmpty()
        .withMessage('Address is required')
        .custom((value) => {
            if (!isValidAddress(value)) {
                throw new Error('Invalid Ethereum address');
            }
            return true;
        }),
    validate,
];

/**
 * Validation rules for signature generation
 */
export const validateGenerateSignature = [
    body('courseName').notEmpty().withMessage('Course name is required'),
    body('studentName').notEmpty().withMessage('Student name is required'),
    body('instructorName').notEmpty().withMessage('Instructor name is required'),
    // Timestamp is optional - will be auto-generated if not provided
    validate,
];

/**
 * Validation rules for creating certificate (combined signature + issuance)
 */
export const validateCreateCertificate = validateGenerateSignature;

