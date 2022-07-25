"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const api_gateway_1 = require("../../libs/api-gateway");
const services_1 = require("../../services");
const handler = async (event) => {
    var _a;
    const category = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.category;
    try {
        const categories = await services_1.categoryService.uploadPhoto(category);
        return (0, api_gateway_1.formatJSONResponse)(200, categories);
    }
    catch (error) {
        console.log(error);
        return (0, api_gateway_1.formatJSONResponse)(500, { "message": "Something went wrong!" });
    }
};
exports.handler = handler;
//# sourceMappingURL=uploadCategoryPhoto.js.map