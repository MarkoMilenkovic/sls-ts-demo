"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const array_helper_1 = __importDefault(require("../libs/array-helper"));
const appointment_1 = require("../models/appointment");
const dynamodb_expressions_1 = require("@aws/dynamodb-expressions");
class AppointmentService {
    constructor(mapper) {
        this.mapper = mapper;
    }
    async getAvailableAppointments(employeeId, appointmentStartTime) {
        const keyCondition = { employeeId: employeeId, appointmentStartTime: (0, dynamodb_expressions_1.beginsWith)(appointmentStartTime) };
        const filterExpression = new dynamodb_expressions_1.FunctionExpression('attribute_not_exists', new dynamodb_expressions_1.AttributePath('userId'));
        return await (0, array_helper_1.default)(this.mapper.query(appointment_1.Appointment, keyCondition, { filter: filterExpression }));
    }
    async scheduleAppointment(employeeId, appointmentStartTime, userId) {
        const appointment = new appointment_1.Appointment();
        appointment.employeeId = employeeId;
        appointment.appointmentStartTime = appointmentStartTime;
        appointment.userId = userId;
        const andExpression = {
            type: 'And',
            conditions: [
                new dynamodb_expressions_1.FunctionExpression('attribute_not_exists', new dynamodb_expressions_1.AttributePath('userId')),
                new dynamodb_expressions_1.FunctionExpression('attribute_exists', new dynamodb_expressions_1.AttributePath('employeeId')),
                new dynamodb_expressions_1.FunctionExpression('attribute_exists', new dynamodb_expressions_1.AttributePath('appointmentStartTime'))
            ]
        };
        const options = {
            condition: andExpression
        };
        return await this.mapper.update(appointment, options);
    }
    async generateAppointments(employeeId, startDateTime, endDateTime) {
        let appointmentsToSave = [];
        const firstAppointment = new appointment_1.Appointment();
        firstAppointment.employeeId = employeeId;
        firstAppointment.appointmentStartTime = startDateTime.toISOString();
        appointmentsToSave.push(firstAppointment);
        while (endDateTime > startDateTime) {
            let newDateTime = addMinutes(startDateTime, 15);
            const newAppointment = new appointment_1.Appointment();
            newAppointment.employeeId = employeeId;
            newAppointment.appointmentStartTime = newDateTime.toISOString();
            appointmentsToSave.push(newAppointment);
            startDateTime = newDateTime;
        }
        return await (0, array_helper_1.default)(this.mapper.batchPut(appointmentsToSave));
    }
}
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}
exports.default = AppointmentService;
//# sourceMappingURL=appointment-service.js.map