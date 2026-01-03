import { getContract, decodeEventLog, type Log } from 'viem';
import { publicClient, walletClient } from './wallet.service';
import { CONTRACT_ABI, CertificateData } from '../config/contract';
import config from '../config';
import { stringToBytes32 } from '../config/utils';

/**
 * CertificateIssued event structure matching the smart contract
 */
export interface CertificateIssuedEvent {
    signature: `0x${string}`;
    courseName: string;
    studentName: string;
    instructorName: string;
    timestamp: string;
}

/**
 * CertificateRevoked event structure matching the smart contract
 */
export interface CertificateRevokedEvent {
    signature: `0x${string}`;
    revokeTimestamp: string;
    reason: string;
}

/**
 * Transaction result with event data
 */
export interface IssueCertificateResult {
    transactionHash: string;
    blockNumber: string;
    signature: string;
    event: CertificateIssuedEvent | null;
}

export interface RevokeCertificateResult {
    transactionHash: string;
    blockNumber: string;
    signature: string;
    event: CertificateRevokedEvent | null;
}

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
     * Returns full transaction data including parsed CertificateIssued event
     */
    async issueCertificate(
        signature: string,
        courseName: string,
        studentName: string,
        instructorName: string
    ): Promise<IssueCertificateResult> {
        const sigBytes32 = stringToBytes32(signature);

        const hash = await contract.write.issueCertificate([
            sigBytes32,
            courseName,
            studentName,
            instructorName,
        ]);

        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        // Parse CertificateIssued event from transaction logs
        const event = this.parseCertificateIssuedEvent(receipt.logs);

        // Use the signature from the blockchain event if available (the actual on-chain bytes32 value)
        // Otherwise fall back to the input signature
        const blockchainSignature = event?.signature ?? signature;

        return {
            transactionHash: hash,
            blockNumber: receipt.blockNumber.toString(),
            signature: blockchainSignature,
            event,
        };
    }

    /**
     * Revoke a certificate
     * Returns full transaction data including parsed CertificateRevoked event
     */
    async revokeCertificate(
        signature: string,
        reason: string
    ): Promise<RevokeCertificateResult> {
        const sigBytes32 = stringToBytes32(signature);

        const hash = await contract.write.revokeCertificate([sigBytes32, reason]);
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        // Parse CertificateRevoked event from transaction logs
        const event = this.parseCertificateRevokedEvent(receipt.logs);

        // Use the signature from the blockchain event if available (the actual on-chain bytes32 value)
        // Otherwise fall back to the input signature
        const blockchainSignature = event?.signature ?? signature;

        return {
            transactionHash: hash,
            blockNumber: receipt.blockNumber.toString(),
            signature: blockchainSignature,
            event,
        };
    }

    /**
     * Parse CertificateIssued event from transaction logs
     * Event: CertificateIssued(bytes32 indexed signature, string courseName, string studentName, string instructorName, uint40 timestamp)
     */
    private parseCertificateIssuedEvent(logs: Log[]): CertificateIssuedEvent | null {
        for (const log of logs) {
            try {
                const decoded = decodeEventLog({
                    abi: CONTRACT_ABI,
                    data: log.data,
                    topics: log.topics,
                });

                if (decoded.eventName === 'CertificateIssued') {
                    const args = decoded.args as unknown as {
                        signature: `0x${string}`;
                        courseName: string;
                        studentName: string;
                        instructorName: string;
                        timestamp: bigint | number;
                    };

                    return {
                        signature: args.signature,
                        courseName: args.courseName,
                        studentName: args.studentName,
                        instructorName: args.instructorName,
                        timestamp: String(args.timestamp),
                    };
                }
            } catch {
                // Not a CertificateIssued event, continue to next log
                continue;
            }
        }
        return null;
    }

    /**
     * Parse CertificateRevoked event from transaction logs
     * Event: CertificateRevoked(bytes32 indexed signature, uint40 revokeTimestamp, string reason)
     */
    private parseCertificateRevokedEvent(logs: Log[]): CertificateRevokedEvent | null {
        for (const log of logs) {
            try {
                const decoded = decodeEventLog({
                    abi: CONTRACT_ABI,
                    data: log.data,
                    topics: log.topics,
                });

                if (decoded.eventName === 'CertificateRevoked') {
                    const args = decoded.args as unknown as {
                        signature: `0x${string}`;
                        revokeTimestamp: bigint | number;
                        reason: string;
                    };

                    return {
                        signature: args.signature,
                        revokeTimestamp: String(args.revokeTimestamp),
                        reason: args.reason,
                    };
                }
            } catch {
                // Not a CertificateRevoked event, continue to next log
                continue;
            }
        }
        return null;
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

