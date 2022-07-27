"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const api_gateway_1 = require("../../libs/api-gateway");
const services_1 = require("../../services");
const handler = async (event) => {
    const categories = JSON.parse(event.body);
    try {
        const createdCategories = await services_1.categoryService.createCategories(categories);
        return (0, api_gateway_1.formatJSONResponse)(200, createdCategories);
    }
    catch (error) {
        return (0, api_gateway_1.handleError)(error);
    }
};
exports.handler = handler;
//# sourceMappingURL=addCategory.js.map