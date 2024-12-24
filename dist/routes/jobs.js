"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const jobController_1 = require("../controllers/jobController");
const router = (0, express_1.Router)();
// Configure multer for file uploads
const upload = (0, multer_1.default)({
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' ||
            file.mimetype === 'application/msword' ||
            file.mimetype ===
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only PDF and DOC files are allowed.'));
        }
    },
});
// Job routes
router.get('/', jobController_1.getJobs);
router.post('/', jobController_1.createJob);
router.put('/:id', jobController_1.updateJob);
router.delete('/:id', jobController_1.deleteJob);
// Application route
router.post('/apply', upload.single('resume'), jobController_1.submitApplication);
// Application management routes
router.get('/applications', jobController_1.getApplications);
router.patch('/applications/:_id/status', jobController_1.updateApplicationStatus);
exports.default = router;
