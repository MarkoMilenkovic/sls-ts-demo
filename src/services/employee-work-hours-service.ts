import { DataMapper } from "@aws/dynamodb-data-mapper";
import gen2array from "../libs/array-helper";
import { EmployeeWorkHours } from "../models/employeeWorkHours";
import {
    AttributeValue, ConditionExpression, lessThanOrEqualTo, greaterThanOrEqualTo
} from '@aws/dynamodb-expressions';
class EmployeeWorkHoursService {
    constructor(
        private readonly mapper: DataMapper
    ) { }

    async validateWorkHours(employeeId: string, appointmentStartTime: string, appointmentEndTime: string,): Promise<Boolean> {
        const employeeWorkHoursArray = await this.getWorkHoursForEmployeeAndDates(employeeId, appointmentStartTime, appointmentEndTime);
        if (employeeWorkHoursArray.length === 0) {
            return false;
        }

        const employeeWorkHours = employeeWorkHoursArray[0];

        const dailyHours = employeeWorkHours.dailyHours?.split('-');
        const dailyStartHours = dailyHours![0];
        const dailyEndHours = dailyHours![1];
        const employeeStartHoursForGivenDay = new Date(appointmentStartTime.split('T')[0] + 'T' + dailyStartHours);
        const employeeEndHoursForGivenDay = new Date(appointmentEndTime.split('T')[0] + 'T' + dailyEndHours);

        if (
            // is date of appointment in employee day range
            await this.isInRange(new Date(employeeWorkHours.startDate!), new Date(employeeWorkHours.endDate!),
                new Date(appointmentStartTime))
            && // is start time in employee hours range
            await this.isInRange(employeeStartHoursForGivenDay, employeeEndHoursForGivenDay, new Date(appointmentStartTime))
            && // is end time in employee hours range
            await this.isInRange(employeeStartHoursForGivenDay, employeeEndHoursForGivenDay, new Date(appointmentEndTime))
        ) {
            return true;
        }
        return false;
    }

    async isInRange(startTime: Date, endTime: Date, time: Date): Promise<Boolean> {
        if (startTime <= time && endTime >= time) {
            return true;
        }
        return false;
    }

    async addWorkHoursForEmployee(employeeId: string, startDate: string,
        endDate: string, dailyHours: string): Promise<EmployeeWorkHours> {
        validateParameters(startDate, endDate, dailyHours);
        const employeeWorkHours = new EmployeeWorkHours();
        employeeWorkHours.employeeId = employeeId;
        employeeWorkHours.startDate = startDate;
        employeeWorkHours.endDate = endDate;
        employeeWorkHours.dailyHours = dailyHours;
        return await this.mapper.put(employeeWorkHours);
    }

    async getWorkHoursForEmployeeAndDate(employeeId: string, date: string): Promise<EmployeeWorkHours[]> {
        return await this.getWorkHoursForEmployeeAndDates(employeeId, date, date);
    }

    async getWorkHoursForEmployeeAndDates(employeeId: string, startDate: string, endDate: string): Promise<EmployeeWorkHours[]> {
        let lessThenOrEqualToExpressionPredicate =
            lessThanOrEqualTo(new AttributeValue({ S: startDate }));
        let greaterThenOrEqualtToExpressionPredicate =
            greaterThanOrEqualTo(new AttributeValue({ S: endDate }));
        const endDateExpression: ConditionExpression = {
            ...greaterThenOrEqualtToExpressionPredicate,
            subject: 'endDate'
        };

        const keyCondition = { employeeId: employeeId, startDate: lessThenOrEqualToExpressionPredicate };
        const employeeWorkHoursArray =
            await gen2array(this.mapper.query(EmployeeWorkHours, keyCondition, { filter: endDateExpression }));
        return employeeWorkHoursArray;
    }

}

function validateParameters(startDate: string, endDate: string, dailyHours: string) {
    if (!startDate || !endDate || !dailyHours) {
        throw {
            code: "ClientError",
            message: "Invalid input parameters!"
        }
    }
    const dailyHoursArray = dailyHours.split('-');
    const dailyStartHours = dailyHoursArray![0];
    const dailyEndHours = dailyHoursArray![1];
    const startDateTime = new Date(startDate + 'T' + dailyStartHours);
    const endDateTime = new Date(endDate + 'T' + dailyEndHours);
    if (!isDate(startDateTime) || !isDate(endDateTime)) {
        throw {
            code: "ClientError",
            message: "Invalid input parameters!"
        }
    }
}

function isDate(date: Date) {
    return !isNaN(date.getDate());
}

export default EmployeeWorkHoursService;
