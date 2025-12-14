import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
    port: number;
    nodeEnv: string;
    privateKey: string;
    rpcUrl: string;
    chainId: number;
    contractAddress: string;
}

/**
 * Normalize and validate private key format
 */
const normalizePrivateKey = (key: string): string => {
    // Trim whitespace
    let normalized = key.trim();

    // Add 0x prefix if missing
    if (!normalized.startsWith('0x')) {
        normalized = `0x${normalized}`;
    }

    // Validate format
    if (!/^0x[0-9a-fA-F]{64}$/.test(normalized)) {
        throw new Error(
            'Invalid PRIVATE_KEY format. Private key must be:\n' +
            '  - A 64-character hexadecimal string (32 bytes)\n' +
            '  - Prefixed with "0x" (or it will be added automatically)\n' +
            '  - Example: 0x1234567890abcdef...(64 hex characters total)\n' +
            `  - Current length: ${normalized.length - 2} hex characters (expected: 64)`
        );
    }

    return normalized;
};

const config: Config = {
    port: parseInt(process.env.PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    privateKey: process.env.PRIVATE_KEY || '',
    rpcUrl: process.env.RPC_URL || 'https://sepolia.base.org',
    chainId: parseInt(process.env.CHAIN_ID || '84532', 10),
    contractAddress: process.env.CONTRACT_ADDRESS || '0x4e4f92818c5372db76da26ce2508b78300f385c5',
};

// Validate required environment variables
if (!config.privateKey) {
    throw new Error(
        'PRIVATE_KEY is required in environment variables.\n' +
        'Please add your private key to the .env file:\n' +
        '  PRIVATE_KEY=0x1234567890abcdef...(64 hex characters)\n' +
        'See .env.example for more details.'
    );
}

// Normalize and validate private key
config.privateKey = normalizePrivateKey(config.privateKey);

if (!config.contractAddress) {
    throw new Error('CONTRACT_ADDRESS is required in environment variables');
}

export default config;
