"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const logLevels = ['info', 'warn', 'error', 'debug'];
class Logger {
    log(level, message, ...args) {
        const timestamp = new Date().toISOString();
        console[level](`[${timestamp}] ${level.toUpperCase()}: ${message}`, ...args);
    }
    info(message, ...args) {
        this.log('info', message, ...args);
    }
    warn(message, ...args) {
        this.log('warn', message, ...args);
    }
    error(message, ...args) {
        this.log('error', message, ...args);
    }
    debug(message, ...args) {
        if (process.env.NODE_ENV !== 'production') {
            this.log('debug', message, ...args);
        }
    }
}
exports.logger = new Logger();
