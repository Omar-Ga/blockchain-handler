import { Request, Response } from 'express';
import contractService from '../services/contract.service';

/**
 * Admin Controller
 */
class AdminController {
    /**
     * Pause contract
     */
    async pauseContract(_req: Request, res: Response) {
        try {
            const result = await contractService.pause();

            return res.json({
                success: true,
                message: 'Contract paused successfully',
                data: {
                    transactionHash: result.hash,
                    blockNumber: result.receipt.blockNumber.toString(),
                },
            });
        } catch (error: any) {
            throw error;
        }
    }

    /**
     * Unpause contract
     */
    async unpauseContract(_req: Request, res: Response) {
        try {
            const result = await contractService.unpause();

            return res.json({
                success: true,
                message: 'Contract unpaused successfully',
                data: {
                    transactionHash: result.hash,
                    blockNumber: result.receipt.blockNumber.toString(),
                },
            });
        } catch (error: any) {
            throw error;
        }
    }

    /**
     * Add issuer
     */
    async addIssuer(req: Request, res: Response) {
        try {
            const { address } = req.body;

            // Check if already an issuer
            const isIssuer = await contractService.isIssuer(address);
            if (isIssuer) {
                return res.status(400).json({
                    success: false,
                    error: 'Address is already an issuer',
                });
            }

            const result = await contractService.addIssuer(address);

            return res.json({
                success: true,
                message: 'Issuer added successfully',
                data: {
                    transactionHash: result.hash,
                    blockNumber: result.receipt.blockNumber.toString(),
                    issuerAddress: address,
                },
            });
        } catch (error: any) {
            throw error;
        }
    }

    /**
     * Remove issuer
     */
    async removeIssuer(req: Request, res: Response) {
        try {
            const { address } = req.body;

            // Check if is an issuer
            const isIssuer = await contractService.isIssuer(address);
            if (!isIssuer) {
                return res.status(400).json({
                    success: false,
                    error: 'Address is not an issuer',
                });
            }

            const result = await contractService.removeIssuer(address);

            return res.json({
                success: true,
                message: 'Issuer removed successfully',
                data: {
                    transactionHash: result.hash,
                    blockNumber: result.receipt.blockNumber.toString(),
                    issuerAddress: address,
                },
            });
        } catch (error: any) {
            throw error;
        }
    }

    /**
     * Check if address is issuer
     */
    async checkIssuer(req: Request, res: Response) {
        try {
            const { address } = req.params;

            const isIssuer = await contractService.isIssuer(address);

            return res.json({
                success: true,
                data: {
                    address,
                    isIssuer,
                },
            });
        } catch (error: any) {
            throw error;
        }
    }
}

export default new AdminController();
