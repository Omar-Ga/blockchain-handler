import { isAddress, stringToHex, hexToString, keccak256, pad } from 'viem';

/**
 * Convert a string to bytes32 format
 * Handles regular strings and bytes32 hashes
 */
export function stringToBytes32(text: string): `0x${string}` {
    // Check if input is already a 32-byte hex string (66 characters: '0x' + 64 hex chars)
    if (text.startsWith('0x') && text.length === 66) {
        // Validate it's a valid hex string
        if (/^0x[0-9a-fA-F]{64}$/.test(text)) {
            // Already in bytes32 format, return as-is
            return text as `0x${string}`;
        }
    }

    // Not a hash, convert string to hex and pad to 32 bytes
    const hex = stringToHex(text);
    return pad(hex, { size: 32 });
}

/**
 * Convert bytes32 to string
 */
export function bytes32ToString(bytes: `0x${string}`): string {
    return hexToString(bytes, { size: 32 });
}

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
    return isAddress(address);
}

/**
 * Generate a cryptographically secure bytes32 signature
 * Process:
 * 1. Create message with course data + timestamp + random nonce
 * 2. Sign message with wallet (EIP-191)
 * 3. Hash the signature to bytes32 for contract storage
 * 
 * Security: Uses cryptographically secure random nonce making signatures
 * unpredictable and impossible to guess or brute-force
 */
export async function generateSignature(
    courseName: string,
    studentName: string,
    instructorName: string,
    timestamp?: number
): Promise<`0x${string}`> {
    const { walletClient } = await import('../services/wallet.service');
    const { randomBytes } = await import('crypto');

    const ts = timestamp || Date.now();

    // Generate cryptographically secure random nonce (32 bytes)
    // This ensures each signature is unique and unpredictable
    const nonce = randomBytes(32).toString('hex');

    // Create message with all data + nonce for maximum security
    const message = `${courseName}-${studentName}-${instructorName}-${ts}-${nonce}`;

    // Sign the message using EIP-191 format (wallet signature)
    const eip191Signature = await walletClient.signMessage({
        message,
    });

    // Hash the EIP-191 signature (132 chars) to bytes32 (66 chars)
    // This makes it compatible with smart contract bytes32 parameters
    const bytes32Signature = keccak256(eip191Signature);

    return bytes32Signature;
}
