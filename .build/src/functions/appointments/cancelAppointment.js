"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const api_gateway_1 = require("../../libs/api-gateway");
const services_1 = require("../../services");
const handler = async (event) => {
    //todo: move reading of initiator from token?
    const body = JSON.parse(event.body);
    const { employeeId, appointmentStartTime, initiator } = body;
    try {
        const appointments = await services_1.appointmentService.cancelAppointment(employeeId, appointmentStartTime, initiator);
        return (0, api_gateway_1.formatJSONResponse)(200, appointments);
    }
    catch (error) {
        return (0, api_gateway_1.handleError)(error);
    }
};
exports.handler = handler;
//# sourceMappingURL=cancelAppointment.js.map