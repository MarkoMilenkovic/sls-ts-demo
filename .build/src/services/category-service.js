"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const array_helper_1 = __importDefault(require("../libs/array-helper"));
const category_1 = require("../models/category");
class CategoryService {
    constructor(mapper) {
        this.mapper = mapper;
    }
    async createCategories(categories) {
        const categoriesToSave = categories.map(category => {
            const c = new category_1.Category();
            c.name = category.name;
            c.description = category.description;
            return c;
        });
        return await (0, array_helper_1.default)(this.mapper.batchPut(categoriesToSave));
    }
    async getCategories() {
        return await (0, array_helper_1.default)(this.mapper.scan(category_1.Category));
    }
    async getCategoriesByNames(categories) {
        const categoriesToGet = categories.map(category => {
            const c = new category_1.Category();
            c.name = category;
            return c;
        });
        return await (0, array_helper_1.default)(this.mapper.batchGet(categoriesToGet));
    }
}
exports.default = CategoryService;
//# sourceMappingURL=category-service.js.map