"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const api_gateway_1 = require("../../libs/api-gateway");
const services_1 = require("../../services");
const handler = async (event) => {
    const key = event.Records[0].s3.object.key;
    try {
        const presignedUrlForUpload = await services_1.categoryService.addImage(key);
        return (0, api_gateway_1.formatJSONResponse)(200, { url: presignedUrlForUpload });
    }
    catch (error) {
        return (0, api_gateway_1.handleError)(error);
    }
};
exports.handler = handler;
//# sourceMappingURL=addImage.js.map