"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
/**
 * A higher-order function that wraps an Express.js request handler
 * and turns it into an async request handler.
 *
 * If the wrapped request handler throws an error, or returns a Promise
 * that rejects with an error, the returned async request handler will
 * call the `next` function with the error.
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
