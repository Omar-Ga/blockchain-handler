# EGYROBO Certificate Management Backend API

A Node.js/Express.js backend API for managing certificates on the blockchain using the EGYROBO Certificate Management smart contract deployed on Base Sepolia.

## Features

- 🔐 **Certificate Management**: Issue, verify, revoke, and retrieve certificates
- �️ **Triple-Layer Security**: 
  - **EIP-191 Cryptographic Signatures**: Secure wallet signing
  - **Random Nonce**: 256-bit entropy for unique, unpredictable signatures
  - **Keccak256 Hashing**: Signatures stored as hashes for privacy
- �👨‍💼 **Admin Controls**: Pause/unpause contract, manage issuer addresses
- 📊 **Statistics**: Get contract statistics and wallet information
- 🔑 **Signature Utilities**: Generate secure, unique signatures automatically
- ⛓️ **Blockchain Integration**: Direct interaction with Base Sepolia smart contract using viem
- 🛡️ **Security**: Helmet.js for security headers, CORS enabled
- ✅ **Validation**: Request validation using express-validator
- 🚀 **TypeScript**: Full TypeScript support with strict type checking

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A private key with ISSUER_ROLE or ADMIN_ROLE on the contract
- Base Sepolia ETH for gas fees

## Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file with your configuration:**
   ```env
   PORT=3001
   NODE_ENV=development
   PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
   RPC_URL=https://sepolia.base.org
   CHAIN_ID=84532
   CONTRACT_ADDRESS=0x4e4f92818c5372db76da26ce2508b78300f385c5
   ```

   > ⚠️ **Important Private Key Format**:
   > - Must be 64 hexadecimal characters (32 bytes)
   > - Should start with `0x` (will be added automatically if missing)
   > - Example: `0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`
   > - **Never commit your `.env` file or expose your private key!**

## Running the Server

### Development Mode
```bash
npm run dev
```
The server will start with hot-reload enabled using nodemon.

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- **GET** `/health` - Check if API is running

### Certificate Management

- **POST** `/api/certificates/issue`
  - Issue a new certificate
  - Body: `{ signature, courseName, studentName, instructorName }`
  - **Note**: Use the signature generated from `/api/signature/generate`

- **GET** `/api/certificates/verify/:signature`
  - Verify if a certificate is valid

- **GET** `/api/certificates/:signature`
  - Get certificate details

- **POST** `/api/certificates/revoke`
  - Revoke a certificate
  - Body: `{ signature, reason }`

- **GET** `/api/certificates/exists/:signature`
  - Check if certificate exists

### Admin Functions

- **POST** `/api/admin/pause`
  - Pause the contract (Admin only)

- **POST** `/api/admin/unpause`
  - Unpause the contract (Admin only)

- **POST** `/api/admin/issuer/add`
  - Add an issuer address
  - Body: `{ address }`

- **POST** `/api/admin/issuer/remove`
  - Remove an issuer address
  - Body: `{ address }`

- **GET** `/api/admin/issuer/check/:address`
  - Check if address is an issuer

### Statistics

- **GET** `/api/stats`
  - Get all contract statistics

- **GET** `/api/stats/total`
  - Get total certificates issued

- **GET** `/api/stats/paused`
  - Get contract paused status

### Signature Utilities

- **POST** `/api/signature/generate`
  - Generate a secure, unique signature
  - Body: `{ courseName, studentName, instructorName }`
  - **Note**: Timestamp and random nonce are auto-generated for security

## Example Usage

### 1. Generate a Secure Signature
```bash
curl -X POST http://localhost:3001/api/signature/generate \
  -H "Content-Type: application/json" \
  -d '{
    "courseName": "Blockchain Development",
    "studentName": "John Doe",
    "instructorName": "Jane Smith"
  }'
```
**Response**:
```json
{
  "success": true,
  "data": {
    "signature": "0x3f2a1b...", // 32-byte hash of EIP-191 signature
    "timestamp": 1733230968123
  }
}
```

### 2. Issue a Certificate
Use the signature from step 1:
```bash
curl -X POST http://localhost:3001/api/certificates/issue \
  -H "Content-Type: application/json" \
  -d '{
    "signature": "0x3f2a1b...",
    "courseName": "Blockchain Development",
    "studentName": "John Doe",
    "instructorName": "Jane Smith"
  }'
```

### 3. Verify a Certificate
```bash
curl http://localhost:3001/api/certificates/verify/0x3f2a1b...
```

## Security Architecture

This project implements a **Triple-Layer Security Model**:

1. **ECDSA Cryptography**: Uses EIP-191 standard for cryptographic signing. It is mathematically impossible to derive the private key from the signature.
2. **Random Nonce**: A cryptographically secure 32-byte random nonce is added to every signature. This ensures that every signature is unique and unpredictable, even for identical data.
3. **Keccak256 Hashing**: The EIP-191 signature is hashed to `bytes32` before being stored on the blockchain. The public ledger only contains the hash, adding another layer of privacy.

## Troubleshooting

### "EADDRINUSE" Error
This means the port 3001 is already in use.
**Fix**: You likely have multiple terminals running the server. Close all other terminals running `npm run dev`.

### "Invalid PRIVATE_KEY format" Error
Your private key must be exactly 64 hexadecimal characters.
**Fix**: Check your `.env` file. Ensure no spaces and correct length.

### "Certificate with this signature already exists"
You are trying to issue a certificate with a signature that has already been used.
**Fix**: Generate a new signature. The random nonce ensures it will be unique every time.

## License

MIT
