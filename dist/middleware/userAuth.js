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
exports.userAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("./errorHandler");
const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new errorHandler_1.AppError(401, 'Authentication required');
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // const user = await User.findById(decoded.userId).select('-password');
        if (!decoded.sub.userId) {
            throw new errorHandler_1.AppError(401, 'User not found');
        }
        req.userId = decoded.sub.userId;
        req.role = decoded.sub.role;
        next();
    }
    catch (err) {
        next(new errorHandler_1.AppError(401, 'Invalid token'));
    }
});
exports.userAuth = userAuth;
