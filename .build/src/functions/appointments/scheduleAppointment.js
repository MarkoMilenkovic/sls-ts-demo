"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const api_gateway_1 = require("../../libs/api-gateway");
const services_1 = require("../../services");
const handler = async (event) => {
    const body = JSON.parse(event.body);
    const { employeeId, appointmentStartTime, userId, serviceId } = body;
    try {
        const appointment = await services_1.appointmentService.scheduleAppointment(employeeId, appointmentStartTime, userId, serviceId);
        return (0, api_gateway_1.formatJSONResponse)(200, appointment);
    }
    catch (error) {
        return (0, api_gateway_1.handleScheduleAppointmentError)(error);
    }
};
exports.handler = handler;
//# sourceMappingURL=scheduleAppointment.js.map