import { getContract } from 'viem';
import { publicClient, walletClient } from './wallet.service';
import { CONTRACT_ABI, CertificateData } from '../config/contract';
import config from '../config';
import { stringToBytes32 } from '../config/utils';

/**
 * Initialize contract instance
 */
const contract = getContract({
    address: config.contractAddress as `0x${string}`,
    abi: CONTRACT_ABI,
    client: { public: publicClient, wallet: walletClient },
});

/**
 * Contract Service - All blockchain interactions
 */
class ContractService {
    /**
     * Get total certificates issued
     */
    async getTotalCertificates(): Promise<string> {
        const total = await contract.read.totalCertificatesIssued();
        return total.toString();
    }

    /**
     * Check if contract is paused
     */
    async isPaused(): Promise<boolean> {
        return await contract.read.paused();
    }

    /**
     * Check if address is an issuer
     */
    async isIssuer(address: string): Promise<boolean> {
        return await contract.read.isIssuer([address as `0x${string}`]);
    }

    /**
     * Check if address has admin role
     */
    async isAdmin(address: string): Promise<boolean> {
        const adminRole = await contract.read.DEFAULT_ADMIN_ROLE();
        return await contract.read.hasRole([adminRole, address as `0x${string}`]);
    }

    /**
     * Verify certificate
     */
    async verifyCertificate(signature: string): Promise<{ exists: boolean; isValid: boolean }> {
        const sigBytes32 = stringToBytes32(signature);
        const result = await contract.read.verifyCertificate([sigBytes32]);
        return {
            exists: result[0],
            isValid: result[1],
        };
    }

    /**
     * Get certificate details
     */
    async getCertificate(signature: string): Promise<CertificateData | null> {
        const sigBytes32 = stringToBytes32(signature);

        // First check if certificate exists
        const exists = await contract.read.doesCertificateExist([sigBytes32]);
        if (!exists) {
            return null;
        }

        const result = await contract.read.getCertificate([sigBytes32]);
        return {
            courseName: result[0],
            studentName: result[1],
            instructorName: result[2],
            issueTimestamp: BigInt(result[3]),
            isRevoked: result[4],
        };
    }

    /**
     * Check if certificate exists
     */
    async doesCertificateExist(signature: string): Promise<boolean> {
        const sigBytes32 = stringToBytes32(signature);
        return await contract.read.doesCertificateExist([sigBytes32]);
    }

    /**
     * Issue a new certificate
     */
    async issueCertificate(
        signature: string,
        courseName: string,
        studentName: string,
        instructorName: string
    ): Promise<{ hash: string; receipt: any }> {
        const sigBytes32 = stringToBytes32(signature);

        const hash = await contract.write.issueCertificate([
            sigBytes32,
            courseName,
            studentName,
            instructorName,
        ]);

        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        return {
            hash,
            receipt,
        };
    }

    /**
     * Revoke a certificate
     */
    async revokeCertificate(
        signature: string,
        reason: string
    ): Promise<{ hash: string; receipt: any }> {
        const sigBytes32 = stringToBytes32(signature);

        const hash = await contract.write.revokeCertificate([sigBytes32, reason]);
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        return {
            hash,
            receipt,
        };
    }

    /**
     * Pause contract
     */
    async pause(): Promise<{ hash: string; receipt: any }> {
        const hash = await contract.write.pause();
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        return {
            hash,
            receipt,
        };
    }

    /**
     * Unpause contract
     */
    async unpause(): Promise<{ hash: string; receipt: any }> {
        const hash = await contract.write.unpause();
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        return {
            hash,
            receipt,
        };
    }

    /**
     * Add issuer
     */
    async addIssuer(issuerAddress: string): Promise<{ hash: string; receipt: any }> {
        const hash = await contract.write.addIssuer([issuerAddress as `0x${string}`]);
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        return {
            hash,
            receipt,
        };
    }

    /**
     * Remove issuer
     */
    async removeIssuer(issuerAddress: string): Promise<{ hash: string; receipt: any }> {
        const hash = await contract.write.removeIssuer([issuerAddress as `0x${string}`]);
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        return {
            hash,
            receipt,
        };
    }
}

export default new ContractService();
