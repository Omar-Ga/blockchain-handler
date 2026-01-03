import dotenv from 'dotenv';
import path from 'path';
import { cleanEnv, str, num, port } from 'envalid';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * Validate and clean environment variables
 */
const env = cleanEnv(process.env, {
    PORT: port({ default: 3000 }),
    NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'production' }),
    PRIVATE_KEY: str({
        desc: 'Private key for signing transactions (must be 32 bytes hex)',
        example: '0x...',
    }),
    RPC_URL: str({ default: 'https://polygon-rpc.com/' }),
    CHAIN_ID: num({ default: 137 }),
    CONTRACT_ADDRESS: str({
        desc: 'Address of the deployed smart contract',
        default: '0x0814De30895Fd7ad02A037C20Eb9A9388E6D71e3',
    }),
});

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
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    privateKey: normalizePrivateKey(env.PRIVATE_KEY),
    rpcUrl: env.RPC_URL,
    chainId: env.CHAIN_ID,
    contractAddress: env.CONTRACT_ADDRESS,
};

export default config;

