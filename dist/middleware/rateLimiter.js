"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const arcjet_1 = require("./arcjet");
/**
 * Middleware function to authenticate the user by checking the authorization token in the request header.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 */
const rateLimiter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract the authorization token from the request header
    //   var ip = req.headers['x-real-ip'] || req.socket.remoteAddress;
    // console.log(ip)
    try {
        const result = yield arcjet_1.aj.protect(req, {
            requested: 5
        });
        // console.log(result);
        if (result.isDenied()) {
            return next((0, http_errors_1.default)(429, "Please wait"));
        }
        else {
            next();
        }
    }
    catch (error) {
        // If the token is expired, return a 401 Unauthorized error
        return next((0, http_errors_1.default)(429, "Please wait"));
    }
});
exports.default = rateLimiter;
