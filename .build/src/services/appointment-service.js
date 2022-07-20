"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const array_helper_1 = __importDefault(require("../libs/array-helper"));
const appointment_1 = require("../models/appointment");
const dynamodb_expressions_1 = require("@aws/dynamodb-expressions");
const config_json_1 = __importDefault(require("../../config.json"));
const appointmentTableName = config_json_1.default.PRIMO_APPOINTMENT_TABLE;
class AppointmentService {
    constructor(mapper, primoServices, client) {
        this.mapper = mapper;
        this.primoServices = primoServices;
        this.client = client;
    }
    async getAvailableAppointments(employeeId, appointmentStartTime) {
        const keyCondition = { employeeId: employeeId, appointmentStartTime: (0, dynamodb_expressions_1.beginsWith)(appointmentStartTime) };
        const filterExpression = new dynamodb_expressions_1.FunctionExpression('attribute_not_exists', new dynamodb_expressions_1.AttributePath('userId'));
        return await (0, array_helper_1.default)(this.mapper.query(appointment_1.Appointment, keyCondition, { filter: filterExpression }));
    }
    //todo: check if employeeId is valid -> userId will be comming from JWT so validation is not implemented
    async scheduleAppointment(employeeId, appointmentStartTime, userId, serviceId) {
        const appTest = new appointment_1.Appointment();
        appTest.employeeId = employeeId;
        appTest.userId = userId;
        appTest.serviceId = serviceId;
        appTest.appointmentStartTime = "2022-07-23T09:30:00.000Z";
        await this.mapper.put(appTest);
        //todo: get shopId from dynamo
        const shopId = "1a377f59-0b29-40be-909b-d8218239ad76";
        const servicePerShop = await this.primoServices.getServiceForShop(shopId, serviceId);
        const duration = servicePerShop.durationInMinutes;
        const appointmentsToDelete = await this.getAppoitmentsToDelete(employeeId, appointmentStartTime, duration);
        const myList = [];
        myList.push({
            Put: {
                TableName: appointmentTableName,
                Item: {
                    employeeId: { S: employeeId },
                    appointmentStartTime: { S: appointmentStartTime },
                    userId: { S: userId },
                    serviceId: { S: serviceId }
                },
                ConditionExpression: 'attribute_not_exists(userId) AND ' +
                    'attribute_not_exists(employeeId) AND ' +
                    'attribute_not_exists(appointmentStartTime)',
                // UpdateExpression: 'SET userId = :userIdVal',
                // ExpressionAttributeValues: {
                //     ':userIdVal': { S: userId }
                // }
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
            serviceId,
            userId
        };
    }
    async getAppoitmentsToDelete(employeeId, startDateTime, duration) {
        let lowerBound = addMinutes(new Date(startDateTime), 1).toISOString();
        let upperBound = addMinutes(new Date(startDateTime), (duration - 1)).toISOString();
        let equalsExpressionPredicate = (0, dynamodb_expressions_1.between)(new dynamodb_expressions_1.AttributeValue({ S: lowerBound }), new dynamodb_expressions_1.AttributeValue({ S: upperBound }));
        const equalsExpression = Object.assign(Object.assign({}, equalsExpressionPredicate), { subject: 'appointmentStartTime' });
        let employeeIdExpressionPredicate = (0, dynamodb_expressions_1.equals)(employeeId);
        const employeeIdExpression = Object.assign(Object.assign({}, employeeIdExpressionPredicate), { subject: 'employeeId' });
        const andExpression = {
            type: 'And',
            conditions: [
                equalsExpression,
                employeeIdExpression
            ]
        };
        return await (0, array_helper_1.default)(this.mapper.query(appointment_1.Appointment, andExpression));
    }
    //todo: check if employeeId is valid 
    //todo: calculate latest available time 
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
    async getAppointmentsForUser(date, userId, upcoming, limit = 1) {
        let equalsExpressionPredicate;
        if (upcoming) {
            equalsExpressionPredicate = (0, dynamodb_expressions_1.greaterThanOrEqualTo)(date);
        }
        else {
            equalsExpressionPredicate = (0, dynamodb_expressions_1.lessThanOrEqualTo)(date);
        }
        const equalsExpression = Object.assign(Object.assign({}, equalsExpressionPredicate), { subject: 'appointmentStartTime' });
        const options = {
            indexName: "userId-index",
            filter: equalsExpression,
            limit: limit,
            scanIndexForward: false
        };
        return await (0, array_helper_1.default)(this.mapper.query(appointment_1.Appointment, { userId }, options));
    }
}
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}
exports.default = AppointmentService;
//# sourceMappingURL=appointment-service.js.map