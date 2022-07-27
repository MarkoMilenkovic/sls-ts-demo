"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const api_gateway_1 = require("../../libs/api-gateway");
const services_1 = require("../../services");
const handler = async (event) => {
    try {
        const categories = await services_1.categoryService.getCategories();
        return (0, api_gateway_1.formatJSONResponse)(200, categories);
    }
    catch (error) {
        return (0, api_gateway_1.handleError)(error);
    }
};
exports.handler = handler;
//# sourceMappingURL=getCategories.js.map