"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enquiry = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enquirySchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    productId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    phone: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied'],
        default: 'new'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
// postSchema.pre('remove', async function(next) {
//     const user = await User.findById(this.author);
//     if (user) {
//       await Post.deleteMany({ author: user._id }); // Delete all posts related to the user
//     }
//     next();
//   });
exports.Enquiry = mongoose_1.default.model('Enquiry', enquirySchema);
