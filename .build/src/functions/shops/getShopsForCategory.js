"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const api_gateway_1 = require("../../libs/api-gateway");
const services_1 = require("../../services");
const handler = async (event) => {
    const category = event.pathParameters.category;
    try {
        const shops = await services_1.shopService.getShopsForCategory(category);
        return (0, api_gateway_1.formatJSONResponse)(200, shops);
    }
    catch (error) {
        console.log(error);
        return (0, api_gateway_1.formatJSONResponse)(500, { "message": "Something went wrong!" });
    }
};
exports.handler = handler;
//# sourceMappingURL=getShopsForCategory.js.map