"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleScheduleAppointmentError = exports.handleError = exports.formatJSONResponse = void 0;
const formatJSONResponse = (statusCode, response) => {
    return {
        statusCode: statusCode,
        body: JSON.stringify(response)
    };
};
exports.formatJSONResponse = formatJSONResponse;
const handleError = (error) => {
    if (error.code === 'ClientError') {
        const response = { "message": error.message };
        return (0, exports.formatJSONResponse)(400, response);
    }
    else {
        console.log(error);
        const response = { "message": "Something went wrong!" };
        return (0, exports.formatJSONResponse)(500, response);
    }
};
exports.handleError = handleError;
const handleScheduleAppointmentError = (error) => {
    if (error.code === 'ConditionalCheckFailedException' || error.code === 'TransactionCanceledException') {
        const response = { "message": "Appointment not available!" };
        return (0, exports.formatJSONResponse)(400, response);
    }
    return (0, exports.handleError)(error);
};
exports.handleScheduleAppointmentError = handleScheduleAppointmentError;
//# sourceMappingURL=api-gateway.js.map