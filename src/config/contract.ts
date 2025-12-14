/**
 * Contract ABI for Certificate Management System
 * Full ABI from deployed contract
 */

export const CONTRACT_ABI = [
    {
        "inputs": [{ "internalType": "address", "name": "admin", "type": "address" }],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    { "inputs": [], "name": "AccessControlBadConfirmation", "type": "error" },
    {
        "inputs": [
            { "internalType": "address", "name": "account", "type": "address" },
            { "internalType": "bytes32", "name": "neededRole", "type": "bytes32" }
        ],
        "name": "AccessControlUnauthorizedAccount",
        "type": "error"
    },
    { "inputs": [], "name": "EnforcedPause", "type": "error" },
    { "inputs": [], "name": "ExpectedPause", "type": "error" },
    { "inputs": [], "name": "ReentrancyGuardReentrantCall", "type": "error" },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "bytes32", "name": "signature", "type": "bytes32" },
            { "indexed": false, "internalType": "string", "name": "courseName", "type": "string" },
            { "indexed": false, "internalType": "string", "name": "studentName", "type": "string" },
            { "indexed": false, "internalType": "string", "name": "instructorName", "type": "string" },
            { "indexed": false, "internalType": "uint40", "name": "timestamp", "type": "uint40" }
        ],
        "name": "CertificateIssued",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "bytes32", "name": "signature", "type": "bytes32" },
            { "indexed": false, "internalType": "uint40", "name": "revokeTimestamp", "type": "uint40" },
            { "indexed": false, "internalType": "string", "name": "reason", "type": "string" }
        ],
        "name": "CertificateRevoked",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }],
        "name": "Paused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" },
            { "indexed": true, "internalType": "bytes32", "name": "previousAdminRole", "type": "bytes32" },
            { "indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32" }
        ],
        "name": "RoleAdminChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" },
            { "indexed": true, "internalType": "address", "name": "account", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }
        ],
        "name": "RoleGranted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" },
            { "indexed": true, "internalType": "address", "name": "account", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }
        ],
        "name": "RoleRevoked",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }],
        "name": "Unpaused",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "DEFAULT_ADMIN_ROLE",
        "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "ISSUER_ROLE",
        "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "issuer", "type": "address" }],
        "name": "addIssuer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "bytes32", "name": "signature", "type": "bytes32" }],
        "name": "doesCertificateExist",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "bytes32", "name": "signature", "type": "bytes32" }],
        "name": "getCertificate",
        "outputs": [
            { "internalType": "string", "name": "courseName", "type": "string" },
            { "internalType": "string", "name": "studentName", "type": "string" },
            { "internalType": "string", "name": "instructorName", "type": "string" },
            { "internalType": "uint40", "name": "issueTimestamp", "type": "uint40" },
            { "internalType": "bool", "name": "isRevoked", "type": "bool" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }],
        "name": "getRoleAdmin",
        "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "bytes32", "name": "role", "type": "bytes32" },
            { "internalType": "address", "name": "account", "type": "address" }
        ],
        "name": "grantRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "bytes32", "name": "role", "type": "bytes32" },
            { "internalType": "address", "name": "account", "type": "address" }
        ],
        "name": "hasRole",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
        "name": "isIssuer",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "bytes32", "name": "signature", "type": "bytes32" },
            { "internalType": "string", "name": "courseName", "type": "string" },
            { "internalType": "string", "name": "studentName", "type": "string" },
            { "internalType": "string", "name": "instructorName", "type": "string" }
        ],
        "name": "issueCertificate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paused",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "issuer", "type": "address" }],
        "name": "removeIssuer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "bytes32", "name": "role", "type": "bytes32" },
            { "internalType": "address", "name": "callerConfirmation", "type": "address" }
        ],
        "name": "renounceRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "bytes32", "name": "signature", "type": "bytes32" },
            { "internalType": "string", "name": "reason", "type": "string" }
        ],
        "name": "revokeCertificate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "bytes32", "name": "role", "type": "bytes32" },
            { "internalType": "address", "name": "account", "type": "address" }
        ],
        "name": "revokeRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }],
        "name": "supportsInterface",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalCertificatesIssued",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "bytes32", "name": "signature", "type": "bytes32" }],
        "name": "verifyCertificate",
        "outputs": [
            { "internalType": "bool", "name": "exists", "type": "bool" },
            { "internalType": "bool", "name": "isValid", "type": "bool" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
] as const;

/**
 * Type for certificate data
 */
export interface CertificateData {
    courseName: string;
    studentName: string;
    instructorName: string;
    issueTimestamp: bigint;
    isRevoked: boolean;
}
