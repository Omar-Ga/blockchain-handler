import { Request, Response } from 'express';
import { generateSignature } from '../config/utils';

/**
 * Signature Controller
 */
class SignatureController {
    /**
     * Generate a cryptographically signed signature using EIP-191
     */
    async generateSignature(req: Request, res: Response) {
        try {
            const { courseName, studentName, instructorName } = req.body;

            // Auto-generate timestamp at the moment of signature creation
            const timestamp = Date.now();

            const signature = await generateSignature(
                courseName,
                studentName,
                instructorName,
                timestamp
            );

            return res.json({
                success: true,
                data: {
                    signature,
                    courseName,
                    studentName,
                    instructorName
                },
            });
        } catch (error: any) {
            throw error;
        }
    }
}

export default new SignatureController();
