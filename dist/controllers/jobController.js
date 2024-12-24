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
exports.updateApplicationStatus = exports.getApplications = exports.submitApplication = exports.deleteJob = exports.updateJob = exports.createJob = exports.getJobs = void 0;
const Job_1 = require("../models/Job");
const JobApplication_1 = require("../models/JobApplication");
const asyncHandler_1 = require("../utils/asyncHandler");
const errorHandler_1 = require("../middleware/errorHandler");
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = require("../config/config");
const uuid_1 = require("uuid");
const s3 = new client_s3_1.S3Client({
    region: config_1.config.s3Region,
    credentials: {
        accessKeyId: config_1.config.s3AccessKey,
        secretAccessKey: config_1.config.s3SecretAccessKey,
    },
});
// Get all jobs
exports.getJobs = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jobs = yield Job_1.Job.find({ active: true }).sort('-postedDate');
    res.json(jobs);
}));
// Create job
exports.createJob = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const job = new Job_1.Job(req.body);
    const newJob = yield job.save();
    res.status(201).json(newJob);
}));
// Update job
exports.updateJob = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield Job_1.Job.findById(req.params.id);
    if (!job) {
        throw new errorHandler_1.AppError(404, 'Job not found');
    }
    Object.assign(job, req.body);
    const updatedJob = yield job.save();
    res.json(updatedJob);
}));
// Delete job
exports.deleteJob = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield Job_1.Job.findById(req.params.id);
    if (!job) {
        throw new errorHandler_1.AppError(404, 'Job not found');
    }
    // Soft delete by setting active to false
    job.active = false;
    yield job.save();
    res.json({ message: 'Job deleted successfully' });
}));
// Submit job application
exports.submitApplication = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobId, name, email, phone, coverLetter } = req.body;
    const resumeFile = req.file;
    if (!resumeFile) {
        throw new errorHandler_1.AppError(400, 'Resume file is required');
    }
    // Check if job exists and is active
    const job = yield Job_1.Job.findOne({ _id: jobId, active: true });
    if (!job) {
        throw new errorHandler_1.AppError(404, 'Job not found or no longer active');
    }
    // Upload resume to storage
    // const resumeUrl = await uploadToStorage(resumeFile);
    console.log(resumeFile.originalname);
    const fileName = `${(0, uuid_1.v4)()}-${resumeFile.originalname}`;
    const uploadParams = {
        Bucket: config_1.config.s3bucket, // The name of your S3 bucket
        Key: 'resume/' + fileName, // The key (path in S3)
        Body: resumeFile.buffer, // The file content
    };
    const putObjectCommand = new client_s3_1.PutObjectCommand(uploadParams);
    const response = yield s3.send(putObjectCommand);
    console.dir(response, { depth: null });
    const application = new JobApplication_1.JobApplication({
        jobId,
        name,
        email,
        phone,
        coverLetter,
        resumeUrl: `https://tapesh.s3.ap-south-1.amazonaws.com/resume/${fileName}`,
    });
    yield application.save();
    res.status(201).json(application);
}));
// Get all job applications
exports.getApplications = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const applications = yield JobApplication_1.JobApplication.find()
        .sort('-appliedDate')
        .populate('jobId', 'title');
    res.json(applications);
}));
// Update application status
exports.updateApplicationStatus = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    const { status } = req.body;
    const application = yield JobApplication_1.JobApplication.findById(_id);
    if (!application) {
        throw new errorHandler_1.AppError(404, 'Application not found');
    }
    application.status = status;
    const updatedApplication = yield application.save();
    res.json(updatedApplication);
}));
