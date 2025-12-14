import { Request, Response } from 'express';
import contractService from '../services/contract.service';
import { getWalletAddress, getWalletBalance } from '../services/wallet.service';

/**
 * Stats Controller
 */
class StatsController {
    /**
     * Get all contract statistics
     */
    async getStats(_req: Request, res: Response) {
        try {
            const [totalCertificates, isPaused, walletBalance] = await Promise.all([
                contractService.getTotalCertificates(),
                contractService.isPaused(),
                getWalletBalance(),
            ]);

            return res.json({
                success: true,
                data: {
                    totalCertificates,
                    isPaused,
                    walletAddress: getWalletAddress(),
                    walletBalance: `${walletBalance} ETH`,
                },
            });
        } catch (error: any) {
            throw error;
        }
    }

    /**
     * Get total certificates issued
     */
    async getTotalCertificates(_req: Request, res: Response) {
        try {
            const total = await contractService.getTotalCertificates();

            return res.json({
                success: true,
                data: {
                    totalCertificates: total,
                },
            });
        } catch (error: any) {
            throw error;
        }
    }

    /**
     * Get contract paused status
     */
    async getPausedStatus(_req: Request, res: Response) {
        try {
            const isPaused = await contractService.isPaused();

            return res.json({
                success: true,
                data: {
                    isPaused,
                },
            });
        } catch (error: any) {
            throw error;
        }
    }
}

export default new StatsController();
