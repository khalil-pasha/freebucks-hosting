"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const globalErrorHandler = (err, req, res, next) => {
    console.error('[Global Error]', err);
    // Never expose stack traces to users in production
    res.status(err.status || 500).json({
        error: err.isOperational ? err.message : 'Internal Server Error'
    });
};
exports.globalErrorHandler = globalErrorHandler;
