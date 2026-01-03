# EGYROBO Certificate API

Production-ready blockchain certificate management API for the Versailles platform.

## Features

- **Certificate Management**: Create, verify, revoke certificates on blockchain
- **Event Extraction**: Returns full `CertificateIssued` and `CertificateRevoked` events
- **Multi-Network**: Supports Base Sepolia, Base Mainnet, Ethereum, Sepolia
- **Security**: Helmet, rate limiting, input validation, EIP-191 signatures

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file:

```env
PORT=3001
NODE_ENV=development
NETWORK_NAME=base-sepolia
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_64_HEX_CHARS
RPC_URL=https://sepolia.base.org
CHAIN_ID=84532
CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS
```

### 3. Run the Server

**Development (with hot-reload):**

```bash
npm run dev
```

**Production:**

```bash
npm run build
npm start
```

## API Endpoints

### Health Check

```
GET /health
```

### Certificates

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/certificates/create` | Create certificate (auto-sign + issue) |
| POST | `/api/certificates/issue` | Issue with pre-generated signature |
| GET | `/api/certificates/verify/:signature` | Verify certificate |
| GET | `/api/certificates/:signature` | Get certificate details |
| POST | `/api/certificates/revoke` | Revoke certificate |
| GET | `/api/certificates/exists/:signature` | Check existence |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/pause` | Pause contract |
| POST | `/api/admin/unpause` | Unpause contract |
| POST | `/api/admin/issuer/add` | Add issuer |
| POST | `/api/admin/issuer/remove` | Remove issuer |
| GET | `/api/admin/issuer/check/:address` | Check if issuer |

### Stats & Utilities

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | Contract statistics |
| POST | `/api/signature/generate` | Generate signature |

---

## Testing with Postman

### Setup

1. Create a new Collection: **"EGYROBO API"**
2. Create Environment with variable: `baseUrl` = `http://localhost:3001`

### Test Flow

#### Step 1: Health Check

```
GET {{baseUrl}}/health
```

#### Step 2: Get Stats

```
GET {{baseUrl}}/api/stats
```

#### Step 3: Create Certificate

```
POST {{baseUrl}}/api/certificates/create
Content-Type: application/json

{
    "courseName": "Blockchain Development",
    "studentName": "John Doe",
    "instructorName": "Dr. Smith"
}
```

**Response:**

```json
{
    "success": true,
    "message": "Certificate created successfully",
    "data": {
        "transactionHash": "0x...",
        "blockNumber": "12345678",
        "signature": "0x...",
        "event": {
            "signature": "0x...",
            "courseName": "Blockchain Development",
            "studentName": "John Doe",
            "instructorName": "Dr. Smith",
            "timestamp": "1734034670"
        }
    }
}
```

#### Step 4: Verify Certificate

```
GET {{baseUrl}}/api/certificates/verify/<signature>
```

#### Step 5: Get Certificate Details

```
GET {{baseUrl}}/api/certificates/<signature>
```

#### Step 6: Revoke Certificate

```
POST {{baseUrl}}/api/certificates/revoke
Content-Type: application/json

{
    "signature": "0x...",
    "reason": "Test revocation"
}
```

### Import Collection

Import `postman_collection.json` from the project root for pre-configured requests.

---

## Automated Testing

Run the full test suite:

```bash
# Start server first
npm run dev

# In another terminal, run tests
npx ts-node scripts/full_cycle_test.ts
```

**Tests include:**

- Health check
- System stats
- Signature generation
- Certificate creation with event extraction
- Certificate verification
- Certificate details retrieval
- Certificate revocation
- Issuer role verification
- Duplicate prevention
- Input validation

---

## Network Configuration

| Network | NETWORK_NAME | CHAIN_ID | RPC_URL |
|---------|--------------|----------|---------|
| Base Sepolia | `base-sepolia` | 84532 | <https://sepolia.base.org> |
| Base Mainnet | `base` | 8453 | <https://mainnet.base.org> |
| Ethereum | `ethereum` | 1 | <https://eth.llamarpc.com> |
| Sepolia | `sepolia` | 11155111 | <https://sepolia.drpc.org> |

---

## Project Structure

```
src/
├── config/          # Configuration & contract ABI
├── controllers/     # Request handlers
├── middleware/      # Validation & error handling
├── routes/          # API routes
├── services/        # Blockchain interactions
└── utils/           # Logger
```

## License

MIT
