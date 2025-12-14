# EGYROBO Backend API Documentation

## Base URL
```
http://localhost:3001
```

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Optional success message",
  "data": { /* Response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": [ /* Optional validation errors */ ]
}
```

---

## Certificate Endpoints

### Issue Certificate

**POST** `/api/certificates/issue`

Issue a new certificate on the blockchain.

**Request Body:**
```json
{
  "signature": "string (required) - Unique identifier for the certificate",
  "courseName": "string (required) - Name of the course",
  "studentName": "string (required) - Name of the student",
  "instructorName": "string (required) - Name of the instructor"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Certificate issued successfully",
  "data": {
    "transactionHash": "0x...",
    "blockNumber": 12345,
    "signature": "blockchain-cert-001"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/certificates/issue \
  -H "Content-Type: application/json" \
  -d '{
    "signature": "blockchain-cert-001",
    "courseName": "Blockchain Development",
    "studentName": "John Doe",
    "instructorName": "Jane Smith"
  }'
```

---

### Verify Certificate

**GET** `/api/certificates/verify/:signature`

Verify if a certificate exists and is valid.

**Parameters:**
- `signature` (path) - Certificate signature to verify

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "signature": "blockchain-cert-001",
    "exists": true,
    "isValid": true
  }
}
```

**Example:**
```bash
curl http://localhost:3001/api/certificates/verify/blockchain-cert-001
```

---

### Get Certificate Details

**GET** `/api/certificates/:signature`

Get detailed information about a certificate.

**Parameters:**
- `signature` (path) - Certificate signature

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "signature": "blockchain-cert-001",
    "courseName": "Blockchain Development",
    "studentName": "John Doe",
    "instructorName": "Jane Smith",
    "issueTimestamp": "1701234567",
    "isRevoked": false
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Certificate not found"
}
```

**Example:**
```bash
curl http://localhost:3001/api/certificates/blockchain-cert-001
```

---

### Revoke Certificate

**POST** `/api/certificates/revoke`

Revoke an existing certificate.

**Request Body:**
```json
{
  "signature": "string (required) - Certificate signature to revoke",
  "reason": "string (required) - Reason for revocation"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Certificate revoked successfully",
  "data": {
    "transactionHash": "0x...",
    "blockNumber": 12346,
    "signature": "blockchain-cert-001",
    "reason": "Student withdrew from course"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/certificates/revoke \
  -H "Content-Type: application/json" \
  -d '{
    "signature": "blockchain-cert-001",
    "reason": "Student withdrew from course"
  }'
```

---

### Check Certificate Exists

**GET** `/api/certificates/exists/:signature`

Check if a certificate exists (without full details).

**Parameters:**
- `signature` (path) - Certificate signature

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "signature": "blockchain-cert-001",
    "exists": true
  }
}
```

**Example:**
```bash
curl http://localhost:3001/api/certificates/exists/blockchain-cert-001
```

---

## Admin Endpoints

### Pause Contract

**POST** `/api/admin/pause`

Pause the smart contract (requires ADMIN_ROLE).

**Success Response (200):**
```json
{
  "success": true,
  "message": "Contract paused successfully",
  "data": {
    "transactionHash": "0x...",
    "blockNumber": 12347
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/admin/pause
```

---

### Unpause Contract

**POST** `/api/admin/unpause`

Unpause the smart contract (requires ADMIN_ROLE).

**Success Response (200):**
```json
{
  "success": true,
  "message": "Contract unpaused successfully",
  "data": {
    "transactionHash": "0x...",
    "blockNumber": 12348
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/admin/unpause
```

---

### Add Issuer

**POST** `/api/admin/issuer/add`

Add an address as an issuer (requires ADMIN_ROLE).

**Request Body:**
```json
{
  "address": "string (required) - Ethereum address to add as issuer"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Issuer added successfully",
  "data": {
    "transactionHash": "0x...",
    "blockNumber": 12349,
    "issuerAddress": "0x..."
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/admin/issuer/add \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x1234567890123456789012345678901234567890"
  }'
```

---

### Remove Issuer

**POST** `/api/admin/issuer/remove`

Remove an address from issuers (requires ADMIN_ROLE).

**Request Body:**
```json
{
  "address": "string (required) - Ethereum address to remove from issuers"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Issuer removed successfully",
  "data": {
    "transactionHash": "0x...",
    "blockNumber": 12350,
    "issuerAddress": "0x..."
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/admin/issuer/remove \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x1234567890123456789012345678901234567890"
  }'
```

---

### Check Issuer

**GET** `/api/admin/issuer/check/:address`

Check if an address is an issuer.

**Parameters:**
- `address` (path) - Ethereum address to check

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "address": "0x...",
    "isIssuer": true
  }
}
```

**Example:**
```bash
curl http://localhost:3001/api/admin/issuer/check/0x1234567890123456789012345678901234567890
```

---

## Statistics Endpoints

### Get All Statistics

**GET** `/api/stats`

Get all contract statistics including wallet information.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalCertificates": "42",
    "isPaused": false,
    "walletAddress": "0x...",
    "walletBalance": "0.5 ETH"
  }
}
```

**Example:**
```bash
curl http://localhost:3001/api/stats
```

---

### Get Total Certificates

**GET** `/api/stats/total`

Get the total number of certificates issued.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalCertificates": "42"
  }
}
```

**Example:**
```bash
curl http://localhost:3001/api/stats/total
```

---

### Get Paused Status

**GET** `/api/stats/paused`

Get the contract's paused status.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "isPaused": false
  }
}
```

**Example:**
```bash
curl http://localhost:3001/api/stats/paused
```

---

## Signature Endpoints

### Generate Signature

**POST** `/api/signature/generate`

Generate a unique signature from certificate data.

**Request Body:**
```json
{
  "courseName": "string (required)",
  "studentName": "string (required)",
  "instructorName": "string (required)",
  "timestamp": "number (optional) - Unix timestamp"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "signature": "0x...",
    "courseName": "Blockchain Development",
    "studentName": "John Doe",
    "instructorName": "Jane Smith",
    "timestamp": 1701234567
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/signature/generate \
  -H "Content-Type: application/json" \
  -d '{
    "courseName": "Blockchain Development",
    "studentName": "John Doe",
    "instructorName": "Jane Smith"
  }'
```

---

### Convert to Bytes32

**POST** `/api/signature/convert`

Convert a string to bytes32 format.

**Request Body:**
```json
{
  "text": "string (required) - Text to convert"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "original": "blockchain-cert-001",
    "bytes32": "0x626c6f636b636861696e2d636572742d303031000000000000000000000000"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/signature/convert \
  -H "Content-Type: application/json" \
  -d '{
    "text": "blockchain-cert-001"
  }'
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `INSUFFICIENT_FUNDS` | Wallet has insufficient ETH for gas |
| `CALL_EXCEPTION` | Contract call reverted (check permissions) |
| `NETWORK_ERROR` | Network connection error |
| `NONCE_EXPIRED` | Transaction nonce expired |
| `UNPREDICTABLE_GAS_LIMIT` | Cannot estimate gas limit |

---

## Rate Limiting

Currently, no rate limiting is implemented. For production use, consider adding rate limiting middleware.

## Authentication

Currently, no authentication is required. The wallet's private key is used for signing transactions. For production, consider adding API key authentication or JWT tokens.
