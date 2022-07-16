"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hanler = void 0;
const api_gateway_1 = require("../../libs/api-gateway");
const services_1 = require("../../services");
const hanler = async (event) => {
    const body = JSON.parse(event.body);
    const { employeeId, startTime, endTime } = body;
    if (isNaN(Date.parse(startTime)) || isNaN(Date.parse(endTime))) {
        return (0, api_gateway_1.formatJSONResponse)(400, { "message": "Dates are not valid!" });
    }
    let startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);
    try {
        const savedAppointments = await services_1.appointmentService.generateAppointments(employeeId, startDateTime, endDateTime);
        return (0, api_gateway_1.formatJSONResponse)(200, savedAppointments);
    }
    catch (error) {
        console.log(error);
        return (0, api_gateway_1.formatJSONResponse)(500, { "message": "Something went wrong!" });
    }
};
exports.hanler = hanler;
//# sourceMappingURL=generateAppointments.js.map