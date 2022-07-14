"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const dynamoDb_1 = require("../libs/dynamoDb");
const appointment_1 = require("../models/appointment");
const handler = async (event) => {
    const newAppointment = new appointment_1.Appointment();
    newAppointment.employeeId = "lemi";
    newAppointment.userId = "joca";
    newAppointment.appointmentStartTime = new Date().toISOString();
    const res = await dynamoDb_1.mapper.put(newAppointment);
    console.log(res);
    return {
        statusCode: 200,
        body: JSON.stringify(res),
    };
};
exports.handler = handler;
//# sourceMappingURL=handler.js.map