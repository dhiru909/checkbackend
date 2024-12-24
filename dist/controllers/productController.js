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
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProducts = void 0;
const Product_1 = require("../models/Product");
const asyncHandler_1 = require("../utils/asyncHandler");
const errorHandler_1 = require("../middleware/errorHandler");
exports.getProducts = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Product_1.Product.find();
    res.json(products);
}));
exports.createProduct = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = new Product_1.Product(req.body);
    const newProduct = yield product.save();
    res.status(201).json(newProduct);
}));
exports.updateProduct = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product_1.Product.findById(req.params.id);
    if (!product) {
        throw new errorHandler_1.AppError(404, 'Product not found');
    }
    Object.assign(product, req.body);
    const updatedProduct = yield product.save();
    res.json(updatedProduct);
}));
exports.deleteProduct = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product_1.Product.findById(req.params.id);
    if (!product) {
        throw new errorHandler_1.AppError(404, 'Product not found');
    }
    yield product.deleteOne();
    res.json({ message: 'Product deleted' });
}));
