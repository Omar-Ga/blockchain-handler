# EGYROBO Backend API Documentation

Base URL: `http://localhost:3001`

## Table of Contents

- [System Status](#system-status)
- [Certificates](#certificates)
  - [Create Certificate](#create-certificate)
  - [Issue Certificate](#issue-certificate)
  - [Verify Certificate](#verify-certificate)
  - [Get Certificate Details](#get-certificate-details)
  - [Revoke Certificate](#revoke-certificate)
  - [Check Existence](#check-existence)
- [Admin](#admin)
  - [Pause Contract](#pause-contract)
  - [Unpause Contract](#unpause-contract)
  - [Add Issuer](#add-issuer)
  - [Remove Issuer](#remove-issuer)
  - [Check Issuer Role](#check-issuer-role)
- [Statistics](#statistics)
  - [Get All Stats](#get-all-stats)
  - [Get Total Certificates](#get-total-certificates)
  - [Get Paused Status](#get-paused-status)
- [Signatures](#signatures)
  - [Generate Signature](#generate-signature)
- [Postman Guide](#postman-guide)

---

## System Status

### Health Check

Check if the API server is running.

- **URL:** `/health`
- **Method:** `GET`
- **Access:** Public
- **Response:**

  ```json
  {
      "success": true,
      "message": "EGYROBO Backend API is running",
      "timestamp": "2023-10-27T10:00:00.000Z"
  }
  ```

---

## Certificates

### Create Certificate

Generates a secure signature and issues the certificate in one step.
**Note:** This is the recommended endpoint for issuing new certificates.

- **URL:** `/api/certificates/create`
- **Method:** `POST`
- **Access:** Public (Requires `ISSUER_ROLE` on contract)
- **Body:**

  ```json
  {
      "courseName": "Blockchain Development",
      "studentName": "John Doe",
      "instructorName": "Dr. Smith"
  }
  ```

- **Response:**

  ```json
  {
      "success": true,
      "message": "Certificate created successfully",
      "data": {
          "transactionHash": "0x...",
          "blockNumber": "123456",
          "signature": "0x...",
          "courseName": "Blockchain Development",
          "studentName": "John Doe",
          "instructorName": "Dr. Smith",
          "timestamp": 1698393600000
      }
  }
  ```

### Issue Certificate

Issues a certificate using a pre-generated signature.

- **URL:** `/api/certificates/issue`
- **Method:** `POST`
- **Access:** Public (Requires `ISSUER_ROLE` on contract)
- **Body:**

  ```json
  {
      "signature": "0x...",
      "courseName": "Blockchain Development",
      "studentName": "John Doe",
      "instructorName": "Dr. Smith"
  }
  ```

- **Response:**

  ```json
  {
      "success": true,
      "message": "Certificate issued successfully",
      "data": {
          "transactionHash": "0x...",
          "blockNumber": "123456",
          "signature": "0x..."
      }
  }
  ```

### Verify Certificate

Verifies if a certificate with the given signature is valid and exists on the blockchain.

- **URL:** `/api/certificates/verify/:signature`
- **Method:** `GET`
- **Access:** Public
- **Response:**

  ```json
  {
      "success": true,
      "data": {
          "signature": "0x...",
          "exists": true,
          "isValid": true
      }
  }
  ```

### Get Certificate Details

Retrieves full details of a certificate from the blockchain.

- **URL:** `/api/certificates/:signature`
- **Method:** `GET`
- **Access:** Public
- **Response:**

  ```json
  {
      "success": true,
      "data": {
          "signature": "0x...",
          "courseName": "...",
          "studentName": "...",
          "instructorName": "...",
          "issueTimestamp": "1698393600",
          "issuer": "0x...",
          "isValid": true
      }
  }
  ```

### Revoke Certificate

Revokes a previously issued certificate.

- **URL:** `/api/certificates/revoke`
- **Method:** `POST`
- **Access:** Public (Requires `ISSUER_ROLE` on contract)
- **Body:**

  ```json
  {
      "signature": "0x...",
      "reason": "Plagiarism detected"
  }
  ```

- **Response:**

  ```json
  {
      "success": true,
      "message": "Certificate revoked successfully",
      "data": {
          "transactionHash": "0x...",
          "blockNumber": "123456",
          "signature": "0x...",
          "reason": "Plagiarism detected"
      }
  }
  ```

### Check Existence

Checks if a certificate signature exists on the blockchain (revoked or valid).

- **URL:** `/api/certificates/exists/:signature`
- **Method:** `GET`
- **Access:** Public
- **Response:**

  ```json
  {
      "success": true,
      "data": {
          "signature": "0x...",
          "exists": true
      }
  }
  ```

---

## Admin

### Pause Contract

Pauses all state-changing operations on the contract.

- **URL:** `/api/admin/pause`
- **Method:** `POST`
- **Access:** Admin only (Requires `DEFAULT_ADMIN_ROLE`)
- **Response:**

  ```json
  {
      "success": true,
      "message": "Contract paused successfully",
      "data": {
          "transactionHash": "0x...",
          "blockNumber": "123456"
      }
  }
  ```

### Unpause Contract

Resumes operations on the contract.

- **URL:** `/api/admin/unpause`
- **Method:** `POST`
- **Access:** Admin only
- **Response:**

  ```json
  {
      "success": true,
      "message": "Contract unpaused successfully",
      "data": {
          "transactionHash": "0x...",
          "blockNumber": "123456"
      }
  }
  ```

### Add Issuer

Grants `ISSUER_ROLE` to an address.

- **URL:** `/api/admin/issuer/add`
- **Method:** `POST`
- **Access:** Admin only
- **Body:**

  ```json
  {
      "address": "0x..."
  }
  ```

- **Response:**

  ```json
  {
      "success": true,
      "message": "Issuer added successfully",
      "data": {
          "transactionHash": "0x...",
          "issuerAddress": "0x..."
      }
  }
  ```

### Remove Issuer

Revokes `ISSUER_ROLE` from an address.

- **URL:** `/api/admin/issuer/remove`
- **Method:** `POST`
- **Access:** Admin only
- **Body:**

  ```json
  {
      "address": "0x..."
  }
  ```

- **Response:**

  ```json
  {
      "success": true,
      "message": "Issuer removed successfully",
      "data": {
          "transactionHash": "0x...",
          "issuerAddress": "0x..."
      }
  }
  ```

### Check Issuer Role

Checks if an address has the `ISSUER_ROLE`.

- **URL:** `/api/admin/issuer/check/:address`
- **Method:** `GET`
- **Access:** Public
- **Response:**

  ```json
  {
      "success": true,
      "data": {
          "address": "0x...",
          "isIssuer": true
      }
  }
  ```

---

## Statistics

### Get All Stats

Returns general contract statistics and wallet info.

- **URL:** `/api/stats`
- **Method:** `GET`
- **Access:** Public
- **Response:**

  ```json
  {
      "success": true,
      "data": {
          "totalCertificates": "10",
          "isPaused": false,
          "walletAddress": "0x...",
          "walletBalance": "0.5 ETH"
      }
  }
  ```

### Get Total Certificates

- **URL:** `/api/stats/total`
- **Method:** `GET`
- **Access:** Public
- **Response:**

  ```json
  {
      "success": true,
      "data": { "totalCertificates": "10" }
  }
  ```

### Get Paused Status

- **URL:** `/api/stats/paused`
- **Method:** `GET`
- **Access:** Public
- **Response:**

  ```json
  {
      "success": true,
      "data": { "isPaused": false }
  }
  ```

---

## Signatures

### Generate Signature

Generates a cryptographic signature EIP-191 with a unique nonce and timestamp details. Useful for manual issuance or verification testing.

- **URL:** `/api/signature/generate`
- **Method:** `POST`
- **Access:** Public
- **Body:**

  ```json
  {
      "courseName": "Blockchain Development",
      "studentName": "John Doe",
      "instructorName": "Dr. Smith"
  }
  ```

- **Response:**

  ```json
  {
      "success": true,
      "data": {
          "signature": "0x...",
          "courseName": "Blockchain Development",
          "studentName": "John Doe",
          "instructorName": "Dr. Smith"
      }
  }
  ```

---

## Postman Guide

You can test all these endpoints using Postman.

### Option 1: Manual Setup

1. **Create a Collection**: Name it "EGYROBO API".
2. **Create Environment**:
    - Variable: `baseUrl`
    - Initial Value: `http://localhost:3001`
    - Current Value: `http://localhost:3001`
3. **Add Requests**:
    - Create requests for each endpoint listed above.
    - Use `{{baseUrl}}` in the URL (e.g., `{{baseUrl}}/api/stats`).
    - Set the request method (GET, POST).
    - For POST requests, go to **Body** -> **raw** -> **JSON** and paste the example JSON payload.

### Option 2: Import Collection

1. Save the JSON below as `egyrobo_postman_collection.json`.
2. Open Postman.
3. Click **Import** (top left).
4. Drag and drop the file.
5. Enjoy testing!

*See `postman_collection.json` in the root directory for the import file.*
