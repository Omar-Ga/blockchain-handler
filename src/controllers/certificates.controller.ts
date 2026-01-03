import { Request, Response } from "express";
import contractService from "../services/contract.service";

/**
 * Certificate Controller
 */
class CertificateController {
  /**
   * Issue a new certificate
   * Returns full transaction data including CertificateIssued event
   */
  async issueCertificate(req: Request, res: Response) {
    try {
      const { signature, courseName, studentName, instructorName } = req.body;

            // Check if certificate already exists
            const exists = await contractService.doesCertificateExist(signature);
            if (exists) {
                // RECOVERY MODE:
                // If the certificate exists on the blockchain, we return SUCCESS.
                // This allows the WordPress plugin to save the deterministic signature to its database
                // even if the original API call failed to save it previously.
                return res.json({
                    success: true,
                    message: 'Certificate already issued. Retrieving existing record.',
                    data: {
                        signature: signature,
                        transactionHash: 'already-on-chain'
                    },
                });
            }

            const result = await contractService.issueCertificate(
        signature,
        courseName,
        studentName,
        instructorName,
      );

      return res.json({
        success: true,
        message: "Certificate issued successfully",
        data: {
          transactionHash: result.transactionHash,
          blockNumber: result.blockNumber,
          signature: result.signature,
          event: result.event,
        },
      });
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Create a new certificate (Generate Signature + Issue on Blockchain)
   * Returns full transaction data including CertificateIssued event
   */
  async createCertificate(req: Request, res: Response) {
    try {
      const { courseName, studentName, instructorName } = req.body;
      const { generateSignature } = await import("../config/utils");

      // 1. Generate Signature
      const timestamp = Date.now();
      const signature = await generateSignature(
        courseName,
        studentName,
        instructorName,
        timestamp,
      );

      // 2. Check if certificate already exists (safety check)
      const exists = await contractService.doesCertificateExist(signature);
      if (exists) {
        return res.status(400).json({
          success: false,
          error: "Certificate with this signature already exists",
        });
      }

      // 3. Issue Certificate on Blockchain
      const result = await contractService.issueCertificate(
        signature,
        courseName,
        studentName,
        instructorName,
      );

      return res.json({
        success: true,
        message: "Certificate created successfully",
        data: {
          transactionHash: result.transactionHash,
          blockNumber: result.blockNumber,
          signature: result.signature,
          event: result.event,
        },
      });
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Verify a certificate
   */
  async verifyCertificate(req: Request, res: Response) {
    try {
      const { signature } = req.params;

      const result = await contractService.verifyCertificate(signature);

      res.json({
        success: true,
        data: {
          signature,
          exists: result.exists,
          isValid: result.isValid,
        },
      });
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Get certificate details
   */
  async getCertificate(req: Request, res: Response) {
    try {
      const { signature } = req.params;

      const certificate = await contractService.getCertificate(signature);

      if (!certificate) {
        return res.status(404).json({
          success: false,
          error: "Certificate not found",
        });
      }

      return res.json({
        success: true,
        data: {
          signature,
          courseName: certificate.courseName,
          studentName: certificate.studentName,
          instructorName: certificate.instructorName,
          issueTimestamp: certificate.issueTimestamp.toString(),
          isRevoked: certificate.isRevoked,
        },
      });
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Revoke a certificate
   * Returns full transaction data including CertificateRevoked event
   */
  async revokeCertificate(req: Request, res: Response) {
    try {
      const { signature, reason } = req.body;

      // Check if certificate exists
      const exists = await contractService.doesCertificateExist(signature);
      if (!exists) {
        return res.status(404).json({
          success: false,
          error: "Certificate not found",
        });
      }

      const result = await contractService.revokeCertificate(signature, reason);

      return res.json({
        success: true,
        message: "Certificate revoked successfully",
        data: {
          transactionHash: result.transactionHash,
          blockNumber: result.blockNumber,
          signature: result.signature,
          event: result.event,
        },
      });
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Check if certificate exists
   */
  async checkExists(req: Request, res: Response) {
    try {
      const { signature } = req.params;

      const exists = await contractService.doesCertificateExist(signature);

      res.json({
        success: true,
        data: {
          signature,
          exists,
        },
      });
    } catch (error: any) {
      throw error;
    }
  }
}

export default new CertificateController();
