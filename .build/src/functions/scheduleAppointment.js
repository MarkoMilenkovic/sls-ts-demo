"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const api_gateway_1 = require("../libs/api-gateway");
const services_1 = __importDefault(require("../services"));
const handler = async (event) => {
    const body = JSON.parse(event.body);
    const { employeeId, appointmentStartTime, userId } = body;
    let statusCode;
    let response;
    try {
        const appointment = await services_1.default.scheduleAppointment(employeeId, appointmentStartTime, userId);
        response = appointment;
        statusCode = 200;
    }
    catch (error) {
        if (error.code === 'ConditionalCheckFailedException') {
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