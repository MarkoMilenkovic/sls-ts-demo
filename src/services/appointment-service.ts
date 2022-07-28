import { DataMapper, ItemNotFoundException } from "@aws/dynamodb-data-mapper";
import gen2array from "../libs/array-helper";
import { Appointment } from "../models/appointment";
import {
    equals, between, beginsWith, AttributePath, AttributeValue, FunctionExpression,
    ConditionExpression, lessThanOrEqualTo, greaterThanOrEqualTo, greaterThan, lessThan
} from '@aws/dynamodb-expressions';
import { QueryOptions } from "@aws/dynamodb-data-mapper";
import PrimoServices from "./primo-services";
import { DynamoDB } from "aws-sdk";
import config from "../../config.json";
import EmployeeWorkHoursService from "./employee-work-hours-service";
import { CancelledAppointment } from "../models/cancelledAppointment";

const appointmentTableName = config.PRIMO_APPOINTMENT_TABLE;

class AppointmentService {
    constructor(
        private readonly mapper: DataMapper,
        private readonly primoServices: PrimoServices,
        private readonly employeeWorkHoursService: EmployeeWorkHoursService,
        private readonly client: DynamoDB
    ) { }

    async getScheduledAppointments(employeeId: string, appointmentStartTime: string): Promise<Appointment[]> {
        const keyCondition = { employeeId: employeeId, appointmentStartTime: beginsWith(appointmentStartTime) };
        const filterExpression = new FunctionExpression('attribute_exists', new AttributePath('userId'));
        return await gen2array(this.mapper.query(Appointment, keyCondition, { filter: filterExpression }));
    }

    //todo: check if employeeId is valid -> userId will be comming from JWT so validation is not implemented
    async scheduleAppointment(employeeId: string, appointmentStartTime: string, userId: string, serviceId: string): Promise<Appointment> {
        if (!employeeId || !appointmentStartTime || !userId || !serviceId) {
            throw {
                code: "ClientError",
                message: "Missing required parameters!"
            }
        }
        //todo: get shopId from dynamo
        const shopId = "edf99677-c7e2-4083-81cf-9f0311ef034a";
        const servicePerShop = await this.primoServices.getServiceForShop(shopId, serviceId);
        const duration: number = servicePerShop.durationInMinutes!;

        const appointmentEndTime = addMinutes(new Date(appointmentStartTime), duration).toISOString();
        const isTimeValid = await this.employeeWorkHoursService.validateWorkHours(employeeId, appointmentStartTime, appointmentEndTime);

        if (!isTimeValid) {
            throw {
                code: "ClientError",
                message: "Outside Work Hours for employee!"
            }
        }

        const appointmentsToDelete = await this.getAppoitmentsToDelete(employeeId, appointmentStartTime, duration);
        const myList: DynamoDB.Types.TransactWriteItemList = [];
        myList.push({
            Put: {
                TableName: appointmentTableName,
                Item: {
                    employeeId: { S: employeeId },
                    appointmentStartTime: { S: appointmentStartTime },
                    userId: { S: userId },
                    serviceId: { S: serviceId },
                    appointmentEndTime: { S: appointmentEndTime }
                },
                ConditionExpression: 'attribute_not_exists(userId) AND ' +
                    'attribute_not_exists(employeeId) AND ' +
                    'attribute_not_exists(appointmentStartTime)',
            }
        });
        for (const appointment of appointmentsToDelete) {
            const toDelete = {
                Delete: {
                    TableName: appointmentTableName,
                    ConditionExpression: 'attribute_not_exists(userId) ',
                    Key: {
                        employeeId: { S: employeeId },
                        appointmentStartTime: { S: appointment.appointmentStartTime },
                    },
                }

            };
            myList.push(toDelete);
        }

        await this.client.transactWriteItems({ TransactItems: myList }).promise();

        return {
            employeeId,
            appointmentStartTime,
            appointmentEndTime,
            serviceId,
            userId,
        }
    }

    async getAppoitmentsToDelete(employeeId: string, startDateTime: string, duration: number): Promise<Appointment[]> {
        let lowerBound = addMinutes(new Date(startDateTime), 1).toISOString();
        let upperBound = addMinutes(new Date(startDateTime), (duration - 1)).toISOString();

        let betweenExpressionPredicate =
            between(new AttributeValue({ S: lowerBound }), new AttributeValue({ S: upperBound }));
        const equalsExpression: ConditionExpression = {
            ...betweenExpressionPredicate,
            subject: 'appointmentStartTime'
        };

        let employeeIdExpressionPredicate = equals(employeeId);
        const employeeIdExpression: ConditionExpression = {
            ...employeeIdExpressionPredicate,
            subject: 'employeeId'
        };

        const andExpression: ConditionExpression = {
            type: 'And',
            conditions: [
                equalsExpression,
                employeeIdExpression
            ]
        };

        const appointments = await gen2array(this.mapper.query(Appointment, andExpression));

        let endTimeGreaterThenStartExpressionPredicate =
            greaterThan(startDateTime);
        const endTimeGreaterThenStartExpression: ConditionExpression = {
            ...endTimeGreaterThenStartExpressionPredicate,
            subject: 'appointmentEndTime'
        };
        let startTimeGreaterThenStartExpressionPredicate =
            lessThan(startDateTime);
        const startTimeGreaterThenStartExpression: ConditionExpression = {
            ...startTimeGreaterThenStartExpressionPredicate,
            subject: 'appointmentStartTime'
        };
        const expression: ConditionExpression = {
            type: 'And',
            conditions: [
                endTimeGreaterThenStartExpression
            ]
        };

        const options: QueryOptions = {
            filter: expression,
        }
        const moreAppointments = await gen2array(this.mapper.query(Appointment,
            {
                employeeId,
                appointmentStartTime: startTimeGreaterThenStartExpression
            },
            options));

        const merged = appointments.concat(moreAppointments);
        return merged;
    }

    async getAppointmentsForUser(date: string, userId: string, upcoming: Boolean, limit: number = 1): Promise<Appointment[]> {
        if (!date || !userId) {
            throw {
                code: "ClientError",
                message: "Missing required parameters!"
            }
        }
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

    async cancelAppointment(employeeId: string, appointmentStartTime: string, initiator: string): Promise<CancelledAppointment> {
        if (!employeeId || !appointmentStartTime || !initiator) {
            throw {
                code: "ClientError",
                message: "Missing required parameters!"
            }
        }

        const appointmentToCancel = await this.getOneAppointment(employeeId, appointmentStartTime);
        const cancelledAppointment = CancelledAppointment.create(appointmentToCancel, initiator, 'mocked shop id');
        await this.mapper.delete(appointmentToCancel);
        return await this.mapper.put(cancelledAppointment);
    }

    private async getOneAppointment(employeeId: string, startTime: string): Promise<Appointment> {
        try {
            const appointmentToGet = new Appointment();
            appointmentToGet.employeeId = employeeId;
            appointmentToGet.appointmentStartTime = startTime;
            return await this.mapper.get(appointmentToGet);
        } catch (error: any) {
            if (error.name === 'ItemNotFoundException') {
                throw {
                    code: "ClientError",
                    message: "Unknown appointment!"
                };
            } else {
                throw error;
            }
        }
    }

    async getCancelledAppointmentForUser(userId: string, toDate: string, limit: number): Promise<CancelledAppointment[]> {
        if (!userId) {
            throw {
                code: "ClientError",
                message: "Missing required parameters!"
            }
        }
        let equalsExpressionPredicate = greaterThanOrEqualTo(toDate);
        const equalsExpression = {
            ...equalsExpressionPredicate,
            subject: 'appointmentStartTime'
        };
        let userIdExpressionPredicate = equals(userId);
        const userIdExpression: ConditionExpression = {
            ...userIdExpressionPredicate,
            subject: 'userId'
        };
        const andExpression: ConditionExpression = {
            type: 'And',
            conditions: [
                equalsExpression,
                userIdExpression
            ]
        };
        const options: QueryOptions = {
            indexName: "userId-index",
            limit: limit,
            scanIndexForward: false
        }
        return await gen2array(this.mapper.query(CancelledAppointment, andExpression, options));
    }

}

function addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
}

export default AppointmentService;