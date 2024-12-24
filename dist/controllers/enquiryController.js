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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEnquiry = exports.updateEnquiryStatus = exports.createEnquiry = exports.getEnquiries = void 0;
const Enquiry_1 = require("../models/Enquiry");
const asyncHandler_1 = require("../utils/asyncHandler");
const errorHandler_1 = require("../middleware/errorHandler");
// Get all enquiries
exports.getEnquiries = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const enquiries = yield Enquiry_1.Enquiry.find({
        status: { $in: req.query.status }
    }).populate("productId", "name").sort({ createdAt: -1 });
    res.json(enquiries);
}));
// Create new enquiry
exports.createEnquiry = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const enquiry = new Enquiry_1.Enquiry(req.body);
    const newEnquiry = yield enquiry.save();
    res.status(201).json(newEnquiry);
}));
// Update enquiry status
exports.updateEnquiryStatus = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const enquiry = yield Enquiry_1.Enquiry.findById(req.params.id);
    if (!enquiry) {
        throw new errorHandler_1.AppError(404, 'Enquiry not found');
    }
    enquiry.status = req.body.status;
    const updatedEnquiry = yield enquiry.save();
    res.json(updatedEnquiry);
}));
// Delete enquiry
exports.deleteEnquiry = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const enquiry = yield Enquiry_1.Enquiry.findById(req.params.id);
    if (!enquiry) {
        throw new errorHandler_1.AppError(404, 'Enquiry not found');
    }
    yield enquiry.deleteOne();
    res.json({ message: 'Enquiry deleted' });
}));
