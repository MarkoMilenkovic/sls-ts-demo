"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const api_gateway_1 = require("../../libs/api-gateway");
const services_1 = require("../../services");
const services_2 = require("../../services");
const handler = async (event) => {
    var _a, _b;
    const employeeId = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.employeeId;
    const date = (_b = event.pathParameters) === null || _b === void 0 ? void 0 : _b.date;
    try {
        const employeeWorkHours = await services_1.employeeWorkHoursService.getWorkHoursForEmployeeAndDate(employeeId, date);
        const scheduledAppointments = await services_2.appointmentService.getScheduledAppointments(employeeId, date);
        return (0, api_gateway_1.formatJSONResponse)(200, { employeeWorkHours, scheduledAppointments });
    }
    catch (error) {
        return (0, api_gateway_1.handleError)(error);
    }
};
exports.handler = handler;
//# sourceMappingURL=getWorkHoursForEmployee.js.map