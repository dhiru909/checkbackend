"use strict";
// This file contains the controller functions for user operations like creating a new user and logging in an existing user.
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
exports.refreshToken = exports.logout = exports.getUserDetails = exports.loginUser = exports.createUser = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config/config");
const errorHandler_1 = require("../middleware/errorHandler");
const asyncHandler_1 = require("../utils/asyncHandler");
const generateToken = (userId) => {
    return (0, jsonwebtoken_1.sign)({ userId }, config_1.config.jwtSecret, {
        expiresIn: '7d',
    });
};
const setTokenCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};
// This function is responsible for creating a new user in the database.
const createUser = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate the request body and files
    const { email, name, password } = req.body;
    if (!email || !password || !name) {
        throw new errorHandler_1.AppError(400, 'All fields are required');
    }
    try {
        const user = yield User_1.default.findOne({ email: email });
        console.log(user);
        // Check if a user with the same email already exists in the database
        // If a user with the same email exists, delete the uploaded file and return a 400 error response
        if (user) {
            const error = (0, http_errors_1.default)(400, 'User Already Exist with this email');
            return next(error);
        }
    }
    catch (error) {
        return next((0, http_errors_1.default)(500, 'Error while getting user'));
    }
    try {
        // Hash the user's password using bcrypt
        let newUser;
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        try {
            // Create a new user in the database
            const newUser = yield User_1.default.create({
                name,
                email,
                password: hashedPassword,
            });
            // Generate a JWT token for the user
            const token = (0, jsonwebtoken_1.sign)({ sub: { userId: newUser._id, role: newUser.role } }, config_1.config.jwtSecret, {
                algorithm: 'HS256',
            });
            // Return the JWT token as the response
            setTokenCookie(res, token);
            res.status(201).json({
                name: newUser.name,
                email: newUser.email,
            });
            return;
        }
        catch (error) {
            return next((0, http_errors_1.default)(500, 'Error while creating user'));
        }
    }
    catch (error) {
        console.log('error', error);
        return next((0, http_errors_1.default)(500, 'Failed while creating user'));
    }
}));
exports.createUser = createUser;
// This function is responsible for logging in an existing user.
const loginUser = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Check if all the required fields are present in the request body
    // If any field is missing, throw a 400 error response
    if (!email || !password) {
        throw (0, http_errors_1.default)(400, 'All field are required');
    }
    try {
        const user = yield User_1.default.findOne({ email });
        // Check if a user with the same email exists in the database
        // If no user exists, throw a 404 error response
        if (!user) {
            return next((0, http_errors_1.default)(404, 'User not found!'));
        }
        // Compare the provided password with the hashed password stored in the database
        // If the passwords match, generate a JWT token for the user
        // If the passwords do not match, throw a 400 error response
        const isMatch = yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
        if (!isMatch) {
            return next((0, http_errors_1.default)(400, 'Password incorrect!!'));
        }
        const token = (0, jsonwebtoken_1.sign)({ sub: { userId: user._id, role: user.role } }, config_1.config.jwtSecret, {
            algorithm: 'HS256',
        });
        // Return the JWT token as the response
        setTokenCookie(res, token);
        // res.cookie("userData",newUser.toString(),{maxAge:604800,path:'/'});
        // Set the access token cookie with the JWT token
        // The maxAge specifies the duration of the cookie in milliseconds
        // The sameSite attribute is set to "lax" to ensure the cookie is sent
        // with both GET and POST requests initiated from the same origin.
        // The cookie is marked as HTTP only to prevent client-side JavaScript from accessing it.
        // The cookie is also marked as secure to ensure it is only sent over HTTPS.
        // res.cookie("accessToken", token, {
        //     maxAge: 604800000, // 7 days in milliseconds
        //     sameSite: "lax", // Allow the cookie to be sent with both GET and POST requests
        //     httpOnly: false, // Prevent client-side JavaScript from accessing the cookie
        //     // secure: true // Only send the cookie over HTTPS
        // });
        res.status(200).json({
            name: user.name,
            email: user.email,
        });
    }
    catch (error) {
        return next((0, http_errors_1.default)(500, 'Error while getting user'));
    }
}));
exports.loginUser = loginUser;
const getUserDetails = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default
            .findById(req.params.userId)
            .select('-password');
        if (!user) {
            return next((0, http_errors_1.default)(404, 'User not found'));
        }
        res.status(200).json(user);
    }
    catch (error) {
        return next((0, http_errors_1.default)(500, 'Error while finding user'));
    }
}));
exports.getUserDetails = getUserDetails;
// Export the createUser and loginUser functions
const logout = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('token');
    res.json({});
}));
exports.logout = logout;
const refreshToken = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    if (!token) {
        throw new errorHandler_1.AppError(401, 'No token provided');
    }
    const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
    const user = yield User_1.default.findById(decoded.userId).select('-password');
    if (!user) {
        throw new errorHandler_1.AppError(401, 'User not found');
    }
    const newToken = generateToken(user._id);
    setTokenCookie(res, newToken);
    res.json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
    });
}));
exports.refreshToken = refreshToken;
