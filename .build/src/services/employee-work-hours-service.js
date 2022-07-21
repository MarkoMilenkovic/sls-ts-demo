"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const array_helper_1 = __importDefault(require("../libs/array-helper"));
const employeeWorkHours_1 = require("../models/employeeWorkHours");
const dynamodb_expressions_1 = require("@aws/dynamodb-expressions");
class EmployeeWorkHoursService {
    constructor(mapper) {
        this.mapper = mapper;
    }
    async validateWorkHours(employeeId, appointmentStartTime, appointmentEndTime) {
        var _a;
        let lessThenOrEqualToExpressionPredicate = (0, dynamodb_expressions_1.lessThanOrEqualTo)(new dynamodb_expressions_1.AttributeValue({ S: appointmentStartTime }));
        let greaterThenOrEqualtToExpressionPredicate = (0, dynamodb_expressions_1.greaterThanOrEqualTo)(new dynamodb_expressions_1.AttributeValue({ S: appointmentEndTime }));
        const endDateExpression = Object.assign(Object.assign({}, greaterThenOrEqualtToExpressionPredicate), { subject: 'endDate' });
        const keyCondition = { employeeId: employeeId, startDate: lessThenOrEqualToExpressionPredicate };
        const employeeWorkHoursArray = await (0, array_helper_1.default)(this.mapper.query(employeeWorkHours_1.EmployeeWorkHours, keyCondition, { filter: endDateExpression }));
        if (employeeWorkHoursArray.length === 0) {
            return false;
        }
        const employeeWorkHours = employeeWorkHoursArray[0];
        const dailyHours = (_a = employeeWorkHours.dailyHours) === null || _a === void 0 ? void 0 : _a.split('-');
        const dailyStartHours = dailyHours[0];
        const dailyEndHours = dailyHours[1];
        const employeeStartHoursForGivenDay = new Date(appointmentStartTime.split('T')[0] + 'T' + dailyStartHours);
        const employeeEndHoursForGivenDay = new Date(appointmentEndTime.split('T')[0] + 'T' + dailyEndHours);
        if (
        // is date of appointment in employee day range
        await this.isInRange(new Date(employeeWorkHours.startDate), new Date(employeeWorkHours.endDate), new Date(appointmentStartTime))
            && // is start time in employee hours range
                await this.isInRange(employeeStartHoursForGivenDay, employeeEndHoursForGivenDay, new Date(appointmentStartTime))
            && // is end time in employee hours range
                await this.isInRange(employeeStartHoursForGivenDay, employeeEndHoursForGivenDay, new Date(appointmentEndTime))) {
            return true;
        }
        return false;
    }
    async addWorkHoursForEmployee(employeeId, startDate, endDate, dailyHours) {
        validateParameters(startDate, endDate, dailyHours);
        const employeeWorkHours = new employeeWorkHours_1.EmployeeWorkHours();
        employeeWorkHours.employeeId = employeeId;
        employeeWorkHours.startDate = startDate;
        employeeWorkHours.endDate = endDate;
        employeeWorkHours.dailyHours = dailyHours;
        return await this.mapper.put(employeeWorkHours);
    }
    async isInRange(startTime, endTime, time) {
        if (startTime <= time && endTime >= time) {
            return true;
        }
        return false;
    }
}
function validateParameters(startDate, endDate, dailyHours) {
    if (!startDate || !endDate || !dailyHours) {
        throw { code: 'InvalidParameters' };
    }
    const dailyHoursArray = dailyHours.split('-');
    const dailyStartHours = dailyHoursArray[0];
    const dailyEndHours = dailyHoursArray[1];
    const startDateTime = new Date(startDate + 'T' + dailyStartHours);
    const endDateTime = new Date(endDate + 'T' + dailyEndHours);
    if (!isDate(startDateTime) || !isDate(endDateTime)) {
        throw { code: 'InvalidParameters' };
    }
}
function isDate(date) {
    return !isNaN(date.getDate());
}
exports.default = EmployeeWorkHoursService;
//# sourceMappingURL=employee-work-hours-service.js.map