"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const api_gateway_1 = require("../../libs/api-gateway");
const services_1 = require("../../services");
const handler = async (event) => {
    var _a, _b, _c, _d;
    const latitude = parseFloat((_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.latitude);
    const longitude = parseFloat((_b = event.queryStringParameters) === null || _b === void 0 ? void 0 : _b.longitude);
    const radius = parseFloat((_c = event.queryStringParameters) === null || _c === void 0 ? void 0 : _c.radius);
    const category = (_d = event.queryStringParameters) === null || _d === void 0 ? void 0 : _d.category;
    if (!latitude || !longitude || !radius) {
        return (0, api_gateway_1.formatJSONResponse)(400, { message: "latitude, longitude and radius are required!" });
    }
    try {
        const shops = await services_1.shopService.getShopsNearLocation(latitude, longitude, radius, category);
        return (0, api_gateway_1.formatJSONResponse)(200, shops);
    }
    catch (error) {
        console.log(error);
        return (0, api_gateway_1.formatJSONResponse)(500, { "message": "Something went wrong!" });
    }
};
exports.handler = handler;
//# sourceMappingURL=queryShopsByRadius.js.map