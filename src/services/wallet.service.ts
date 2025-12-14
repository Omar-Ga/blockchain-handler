import { createWalletClient, createPublicClient, http, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import config from '../config';

/**
 * Initialize account from private key
 */
export const account = privateKeyToAccount(config.privateKey as `0x${string}`);

/**
 * Initialize public client for reading blockchain data
 */
export const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(config.rpcUrl),
});

/**
 * Initialize wallet client for sending transactions
 */
export const walletClient = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(config.rpcUrl),
});

/**
 * Get wallet address
 */
export const getWalletAddress = (): string => {
    return account.address;
};

/**
 * Get wallet balance
 */
export const getWalletBalance = async (): Promise<string> => {
    const balance = await publicClient.getBalance({ address: account.address });
    return formatEther(balance);
};

console.log(`Wallet initialized: ${account.address}`);
