"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const api_gateway_1 = require("../../libs/api-gateway");
const services_1 = require("../../services");
const handler = async (event) => {
    var _a;
    const employeeId = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.employeeId;
    const body = JSON.parse(event.body);
    const { startDate, endDate, dailyHours } = body;
    try {
        const employeeWorkHours = await services_1.employeeWorkHoursService.addWorkHoursForEmployee(employeeId, startDate, endDate, dailyHours);
        return (0, api_gateway_1.formatJSONResponse)(200, employeeWorkHours);
    }
    catch (error) {
        if (error.code === 'InvalidParameters') {
            return (0, api_gateway_1.formatJSONResponse)(400, { "message": "Invalid input parameters!" });
        }
        console.log(error);
        return (0, api_gateway_1.formatJSONResponse)(500, { "message": "Something went wrong!" });
    }
};
exports.handler = handler;
//# sourceMappingURL=addWorkHoursForEmployee.js.map