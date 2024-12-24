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
exports.uploadToStorage = uploadToStorage;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const UPLOAD_DIR = path_1.default.join(__dirname, '../../uploads');
// Ensure upload directory exists
fs_1.promises.mkdir(UPLOAD_DIR, { recursive: true }).catch(console.error);
function uploadToStorage(file) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!file) {
            throw new Error('No file provided');
        }
        const fileName = `${(0, uuid_1.v4)()}-${file.originalname}`;
        const filePath = path_1.default.join(UPLOAD_DIR, fileName);
        try {
            yield fs_1.promises.writeFile(filePath, file.buffer);
            return `/uploads/${fileName}`;
        }
        catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    });
}
