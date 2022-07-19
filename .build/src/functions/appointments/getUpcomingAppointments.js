"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const api_gateway_1 = require("../../libs/api-gateway");
const services_1 = require("../../services");
const handler = async (event) => {
    var _a, _b, _c;
    //todo: move this reading from token?
    const userId = (_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.userId;
    let limit = parseInt((_b = event.queryStringParameters) === null || _b === void 0 ? void 0 : _b.limit);
    const date = (_c = event.queryStringParameters) === null || _c === void 0 ? void 0 : _c.date;
    if (!date) {
        return (0, api_gateway_1.formatJSONResponse)(400, { "message": "Date is mandatory!" });
    }
    if (isNaN(limit)) {
        limit = 10;
    }
    try {
        const appointments = await services_1.appointmentService.getAppointmentsForUser(date, userId, true, limit);
        return (0, api_gateway_1.formatJSONResponse)(200, appointments);
    }
    catch (error) {
        console.log(error);
        return (0, api_gateway_1.formatJSONResponse)(500, { "message": "Something went wrong!" });
    }
};
exports.handler = handler;
//# sourceMappingURL=getUpcomingAppointments.js.map