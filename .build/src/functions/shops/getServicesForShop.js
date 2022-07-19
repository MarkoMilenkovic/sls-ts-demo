"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const api_gateway_1 = require("../../libs/api-gateway");
const services_1 = require("../../services");
const handler = async (event) => {
    var _a;
    const shopId = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.shopId;
    try {
        const shop = await services_1.primoServices.getServicesForShop(shopId);
        return (0, api_gateway_1.formatJSONResponse)(200, shop);
    }
    catch (error) {
        console.log(error);
        return (0, api_gateway_1.formatJSONResponse)(500, { "message": "Something went wrong!" });
    }
};
exports.handler = handler;
//# sourceMappingURL=getServicesForShop.js.map