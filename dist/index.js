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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./config/config");
const db_1 = require("./config/db");
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./utils/logger");
const products_1 = __importDefault(require("./routes/products"));
const enquiries_1 = __importDefault(require("./routes/enquiries"));
const jobs_1 = __importDefault(require("./routes/jobs"));
const users_1 = __importDefault(require("./routes/users"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
// Middleware
app.use((0, cors_1.default)({
    origin: "*"
}));
app.use(express_1.default.json());
// Serve uploaded files
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Routes
app.use('/api/products', products_1.default);
app.use('/api/enquiries', enquiries_1.default);
app.use('/api/jobs', jobs_1.default);
app.use('/api/auth', users_1.default);
// Error handling
app.use(errorHandler_1.errorHandler);
// Start server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.connectDB)();
        app.listen(config_1.config.port, () => {
            logger_1.logger.info(`Server running in ${config_1.config.nodeEnv} mode on port ${config_1.config.port}`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
});
startServer();
