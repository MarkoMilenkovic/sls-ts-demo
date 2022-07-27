"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const array_helper_1 = __importDefault(require("../libs/array-helper"));
const category_1 = require("../models/category");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const client_s3_1 = require("@aws-sdk/client-s3");
const config_json_1 = __importDefault(require("../../config.json"));
const photoBucket = config_json_1.default.PHOTOS_S3_BUCKET;
class CategoryService {
    constructor(mapper, s3Client) {
        this.mapper = mapper;
        this.s3Client = s3Client;
    }
    async createCategories(categories) {
        if (!categories || categories.length === 0) {
            throw {
                code: "ClientError",
                message: "Missing required parameters!"
            };
        }
        const categoriesToSave = categories.map(category => {
            const c = new category_1.Category();
            c.name = category.name;
            c.description = category.description;
            return c;
        });
        return await (0, array_helper_1.default)(this.mapper.batchPut(categoriesToSave));
    }
    async getCategories() {
        const categories = await (0, array_helper_1.default)(this.mapper.scan(category_1.Category));
        await this.addPhotoUrls(categories);
        return categories;
    }
    async addPhotoUrls(categories) {
        for (const category of categories) {
            if (category.hasImage) {
                const photoUrl = await this.generateUrl(category.name);
                category.photoUrl = photoUrl;
            }
        }
    }
    async getCategoriesByNames(categories) {
        const categoriesToGet = categories.map(category => {
            const c = new category_1.Category();
            c.name = category;
            return c;
        });
        const categoriesFromDb = await (0, array_helper_1.default)(this.mapper.batchGet(categoriesToGet));
        await this.addPhotoUrls(categoriesFromDb);
        return categoriesFromDb;
    }
    async generateUrl(s3PhotoKey) {
        const getObjectParams = { Bucket: photoBucket, Key: s3PhotoKey };
        const command = new client_s3_1.GetObjectCommand(getObjectParams);
        const url = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn: 3600 });
        return url;
    }
    async generatePresignedUrlForUpload(categoryName) {
        const category = new category_1.Category();
        category.name = categoryName;
        try {
            await this.mapper.get(category);
        }
        catch (error) {
            throw {
                code: "ClientError",
                message: "Unknown category provided!"
            };
        }
        const bucketParams = {
            Bucket: photoBucket,
            Key: categoryName
        };
        const command = new client_s3_1.PutObjectCommand(bucketParams);
        const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, {
            expiresIn: 3600,
        });
        return signedUrl;
    }
    async addImage(categoryName) {
        const category = new category_1.Category();
        category.name = categoryName;
        category.hasImage = true;
        await this.mapper.update(category);
    }
}
exports.default = CategoryService;
//# sourceMappingURL=category-service.js.map