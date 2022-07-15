"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const api_gateway_1 = require("../libs/api-gateway");
const services_1 = require("../services");
const handler = async (event) => {
    var _a, _b;
    const employeeId = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.employeeId;
    const date = (_b = event.pathParameters) === null || _b === void 0 ? void 0 : _b.date;
    let statusCode;
    let response;
    try {
        const appointments = await services_1.appointmentService.getAvailableAppointments(employeeId, date);
        response = appointments;
        statusCode = 200;
    }
    catch (error) {
        console.log(error);
        response = { "message": "Something went wrong!" };
        statusCode = 500;
    }
    return (0, api_gateway_1.formatJSONResponse)(statusCode, response);
};
exports.handler = handler;
//# sourceMappingURL=getAvailableAppointments.js.map