"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const multer_1 = __importDefault(require("multer"));
const node_path_1 = __importDefault(require("node:path"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, node_path_1.default.resolve(__dirname, '../../public/data/uploads'));
    },
    // This function is a function that is used by multer to determine the name of the file
    // that is to be saved on the server. It is called by multer when it is saving a file.
    // Multer calls this function with three arguments:
    //   - req: this is the request object that multer is currently handling
    //   - file: this is the file that multer is currently handling
    //   - cb: this is a function that multer calls with two arguments: an error (or null) and
    //         the name of the file that multer should save the file as.
    filename: function (req, file, cb) {
        // The name of the file that the user uploaded is stored in the 'originalname' property of the file object.
        // We want to remove the extension from the file name and add a unique suffix to the file name to prevent
        // files with the same name from overwriting each other. We also want to keep the original extension of the file.
        // To do this, we use the 'replace' method to replace the extension of the file name with a unique suffix
        // followed by the original extension of the file.
        // We generate the unique suffix by calling the 'Date.now' function to get the current time in milliseconds
        // since the Unix epoch and then adding a random number to it.
        // We then call the 'cb' function with two arguments: an error (or null) and the name of the file that multer
        // should save the file as.
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.originalname.replace(/\.[^/.]+$/, '') + // Remove the extension of the file name
            '-' +
            uniqueSuffix + // Add the unique suffix to the file name
            '.' +
            file.mimetype.split('/').at(-1) // Add the original extension of the file to the file name
        );
    },
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, //10mb
    },
    //This function is a filter function for multer, which is used to filter
    //out unwanted files based on their mimetype
    fileFilter: (req, file, callback) => {
        //If the file's mimetype is not one of the following
        //jpg, jpeg, png, bmp
        if (!file.originalname.match(/\.(jpg|jpeg|png|bmp|JPEG)$/)) {
            //Then return a new error and stop the upload process
            return callback(new Error('Please upload a valid image file'));
        }
        else {
            //If the file's mimetype is one of the above, then continue
            //with the upload process
            callback(null, true);
        }
    },
});
// Create a new router instance for handling user-related routes
const userRouter = express_1.default.Router();
// Define a route for handling user registration requests
// This route expects a POST request with a request body containing a field named "dp"
// that contains a single file
// The file should be an image file (jpg, jpeg, png, bmp)
// The file should not exceed 10MB in size
// The file should be uploaded with the name "dp" in the request body
// The file should be saved to the "data/uploads" directory in the project's public directory
// The file should have a unique name generated by appending a unique suffix to the original file name
// The file should have the same extension as the original file
// Example request body: { dp: <file> }
userRouter.post('/register', userController_1.createUser // Define the handler function for the route
);
userRouter.post('/login', userController_1.loginUser);
userRouter.get('/:userId', userController_1.getUserDetails);
userRouter.post('/logout', userController_1.logout);
userRouter.post('/refresh', userController_1.refreshToken);
exports.default = userRouter;