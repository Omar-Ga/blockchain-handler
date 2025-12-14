import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler middleware
 */
export const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error('Error:', err);

    // Handle viem errors
    if (err.name === 'ContractFunctionExecutionError' || err.name === 'TransactionExecutionError') {
        return res.status(400).json({
            success: false,
            error: err.shortMessage || err.message || 'Contract execution failed',
            details: err.details,
        });
    }

    // Handle viem RPC errors
    if (err.name === 'RpcError' || err.name === 'HttpRequestError') {
        return res.status(500).json({
            success: false,
            error: 'Network error - unable to connect to blockchain',
            details: err.message,
        });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: err.details || err.message,
        });
    }

    // Default error response
    return res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal server error',
    });
};

/**
 * 404 handler
 */
export const notFoundHandler = (_req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
};
