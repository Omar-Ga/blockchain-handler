import { Request, Response } from 'express';
import contractService from '../services/contract.service';

/**
 * Certificate Controller
 */
class CertificateController {
    /**
     * Issue a new certificate
     */
    async issueCertificate(req: Request, res: Response) {
        try {
            const { signature, courseName, studentName, instructorName } = req.body;

            // Check if certificate already exists
            const exists = await contractService.doesCertificateExist(signature);
            if (exists) {
                return res.status(400).json({
                    success: false,
                    error: 'Certificate with this signature already exists',
                });
            }

            const result = await contractService.issueCertificate(
                signature,
                courseName,
                studentName,
                instructorName
            );

            return res.json({
                success: true,
                message: 'Certificate issued successfully',
                data: {
                    transactionHash: result.hash,
                    blockNumber: result.receipt ? result.receipt.blockNumber.toString() : 'pending',
                    signature,
                },
            });
        } catch (error: any) {
            throw error;
        }
    }

    /**
     * Verify a certificate
     */
    async verifyCertificate(req: Request, res: Response) {
        try {
            const { signature } = req.params;

            const result = await contractService.verifyCertificate(signature);

            res.json({
                success: true,
                data: {
                    signature,
                    exists: result.exists,
                    isValid: result.isValid,
                },
            });
        } catch (error: any) {
            throw error;
        }
    }

    /**
     * Get certificate details
     */
    async getCertificate(req: Request, res: Response) {
        try {
            const { signature } = req.params;

            const certificate = await contractService.getCertificate(signature);

            if (!certificate) {
                return res.status(404).json({
                    success: false,
                    error: 'Certificate not found',
                });
            }

            return res.json({
                success: true,
                data: {
                    signature,
                    ...certificate,
                    issueTimestamp: certificate.issueTimestamp.toString(),
                },
            });
        } catch (error: any) {
            throw error;
        }
    }

    /**
     * Revoke a certificate
     */
    async revokeCertificate(req: Request, res: Response) {
        try {
            const { signature, reason } = req.body;

            // Check if certificate exists
            const exists = await contractService.doesCertificateExist(signature);
            if (!exists) {
                return res.status(404).json({
                    success: false,
                    error: 'Certificate not found',
                });
            }

            const result = await contractService.revokeCertificate(signature, reason);

            return res.json({
                success: true,
                message: 'Certificate revoked successfully',
                data: {
                    transactionHash: result.hash,
                    blockNumber: result.receipt ? result.receipt.blockNumber.toString() : 'pending',
                    signature,
                    reason,
                },
            });
        } catch (error: any) {
            throw error;
        }
    }

    /**
     * Check if certificate exists
     */
    async checkExists(req: Request, res: Response) {
        try {
            const { signature } = req.params;

            const exists = await contractService.doesCertificateExist(signature);

            res.json({
                success: true,
                data: {
                    signature,
                    exists,
                },
            });
        } catch (error: any) {
            throw error;
        }
    }
}

export default new CertificateController();
