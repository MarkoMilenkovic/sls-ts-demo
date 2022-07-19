"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const api_gateway_1 = require("../../libs/api-gateway");
const services_1 = require("../../services");
const handler = async (event) => {
    try {
        const services = await services_1.primoServices.getServices();
        return (0, api_gateway_1.formatJSONResponse)(200, services);
    }
    catch (error) {
        console.log(error);
        return (0, api_gateway_1.formatJSONResponse)(500, { "message": "Something went wrong!" });
    }
};
exports.handler = handler;
//# sourceMappingURL=getServices.js.map