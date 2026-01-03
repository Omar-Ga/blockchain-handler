/**
 * Polygon Mainnet Chain Configuration
 */

import { polygon } from 'viem/chains';
import type { Chain } from 'viem';

export const CHAIN: Chain = polygon;

export function getChain(): Chain {
    return CHAIN;
}

export function getNetworkDisplayName(): string {
    return 'Polygon Mainnet';
}
