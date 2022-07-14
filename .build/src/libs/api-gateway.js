"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatJSONResponse = void 0;
const formatJSONResponse = (statusCode, response) => {
    return {
        statusCode: statusCode,
        body: JSON.stringify(response)
    };
};
exports.formatJSONResponse = formatJSONResponse;
//# sourceMappingURL=api-gateway.js.map