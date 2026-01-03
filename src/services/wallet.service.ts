import { createWalletClient, createPublicClient, http, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { getChain, getNetworkDisplayName } from '../config/chains';
import config from '../config';

/**
 * Initialize account from private key
 */
export const account = privateKeyToAccount(config.privateKey as `0x${string}`);

/**
 * Get the configured chain (Polygon Mainnet)
 */
const chain = getChain();

/**
 * Initialize public client for reading blockchain data
 */
export const publicClient = createPublicClient({
    chain,
    transport: http(config.rpcUrl),
});

/**
 * Initialize wallet client for sending transactions
 */
export const walletClient = createWalletClient({
    account,
    chain,
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

/**
 * Get current network name for display
 */
export const getNetworkName = (): string => {
    return getNetworkDisplayName();
};

console.log(`Wallet initialized: ${account.address} on ${getNetworkDisplayName()}`);
