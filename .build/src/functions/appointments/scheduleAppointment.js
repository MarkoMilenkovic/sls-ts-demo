"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const api_gateway_1 = require("../../libs/api-gateway");
const services_1 = require("../../services");
const handler = async (event) => {
    const body = JSON.parse(event.body);
    const { employeeId, appointmentStartTime, userId, serviceId } = body;
    let statusCode;
    let response;
    try {
        const appointment = await services_1.appointmentService.scheduleAppointment(employeeId, appointmentStartTime, userId, serviceId);
        response = appointment;
        statusCode = 200;
    }
    catch (error) {
        if (error.code === 'ConditionalCheckFailedException' || error.code === 'TransactionCanceledException') {
            response = { "message": "Appointment not available!" };
            statusCode = 400;
        }
        else {
            console.log(error);
            response = { "message": "Something went wrong!" };
            statusCode = 500;
        }
    }
    return (0, api_gateway_1.formatJSONResponse)(statusCode, response);
};
exports.handler = handler;
//# sourceMappingURL=scheduleAppointment.js.map