import { DataMapper } from "@aws/dynamodb-data-mapper";
import gen2array from "../libs/array-helper";
import { Appointment } from "../models/appointment";
import { beginsWith, AttributePath, FunctionExpression, ConditionExpression } from '@aws/dynamodb-expressions';
import { UpdateOptions } from "@aws/dynamodb-data-mapper";

class AppointmentService {
    constructor(
        private readonly mapper: DataMapper
    ) { }

    async getAvailableAppointments(employeeId: string, appointmentStartTime: string): Promise<Appointment[]> {
        const keyCondition = { employeeId: employeeId, appointmentStartTime: beginsWith(appointmentStartTime) };
        const filterExpression = new FunctionExpression('attribute_not_exists', new AttributePath('userId'));

        return await gen2array(this.mapper.query(Appointment, keyCondition, { filter: filterExpression }));
    }

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

}

function addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
}

export default AppointmentService;