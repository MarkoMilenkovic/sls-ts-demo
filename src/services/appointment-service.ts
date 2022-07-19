import { DataMapper } from "@aws/dynamodb-data-mapper";
import gen2array from "../libs/array-helper";
import { Appointment } from "../models/appointment";
import {
    beginsWith, AttributePath, FunctionExpression, ConditionExpression, lessThanOrEqualTo, greaterThanOrEqualTo
} from '@aws/dynamodb-expressions';
import { UpdateOptions, QueryOptions } from "@aws/dynamodb-data-mapper";

class AppointmentService {
    constructor(
        private readonly mapper: DataMapper
    ) { }

    async getAvailableAppointments(employeeId: string, appointmentStartTime: string): Promise<Appointment[]> {
        const keyCondition = { employeeId: employeeId, appointmentStartTime: beginsWith(appointmentStartTime) };
        const filterExpression = new FunctionExpression('attribute_not_exists', new AttributePath('userId'));

        return await gen2array(this.mapper.query(Appointment, keyCondition, { filter: filterExpression }));
    }

    //todo: check if employeeId is valid -> userId will be comming from JWT so validation is not implemented
    //todo: check dynamodb transactions
    //todo: delete next appointments from table
    async scheduleAppointment(employeeId: string, appointmentStartTime: string, userId: string): Promise<Appointment> {
        const appointment = new Appointment();
        appointment.employeeId = employeeId;
        appointment.appointmentStartTime = appointmentStartTime;
        appointment.userId = userId;

        const andExpression: ConditionExpression = {
            type: 'And',
            conditions: [
                new FunctionExpression('attribute_not_exists', new AttributePath('userId')),
                new FunctionExpression('attribute_exists', new AttributePath('employeeId')),
                new FunctionExpression('attribute_exists', new AttributePath('appointmentStartTime'))
            ]
        };

        const options: UpdateOptions = {
            condition: andExpression
        }

        return await this.mapper.update(appointment, options);
    }

    //todo: check if employeeId is valid 
    //todo: calculate latest available time: something like 
    async generateAppointments(employeeId: string, startDateTime: Date, endDateTime: Date): Promise<Appointment[]> {
        let appointmentsToSave = [];
        const firstAppointment = new Appointment();
        firstAppointment.employeeId = employeeId;
        firstAppointment.appointmentStartTime = startDateTime.toISOString();
        appointmentsToSave.push(firstAppointment);
        while (endDateTime > startDateTime) {
            let newDateTime = addMinutes(startDateTime, 15);
            const newAppointment = new Appointment();
            newAppointment.employeeId = employeeId;
            newAppointment.appointmentStartTime = newDateTime.toISOString();
            appointmentsToSave.push(newAppointment);
            startDateTime = newDateTime;
        }
        return await gen2array(this.mapper.batchPut(appointmentsToSave));
    }

    async getAppointmentsForUser(date: string, userId: string, upcoming: Boolean, limit: number = 1): Promise<Appointment[]> {
        let equalsExpressionPredicate;
        if (upcoming) {
            equalsExpressionPredicate = greaterThanOrEqualTo(date);
        } else {
            equalsExpressionPredicate = lessThanOrEqualTo(date);
        }
        const equalsExpression: ConditionExpression = {
            ...equalsExpressionPredicate,
            subject: 'appointmentStartTime'
        };
        const options: QueryOptions = {
            indexName: "userId-index",
            filter: equalsExpression,
            limit: limit,
            scanIndexForward: false
        }
        return await gen2array(this.mapper.query(Appointment, { userId }, options));
    }

}

function addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
}

export default AppointmentService;