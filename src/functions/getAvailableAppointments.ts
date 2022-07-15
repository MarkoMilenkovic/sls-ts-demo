import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { formatJSONResponse } from '../libs/api-gateway';
import {appointmentService} from '../services';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const employeeId = event.pathParameters?.employeeId as string;
    const date = event.pathParameters?.date as string;

    let statusCode;
    let response;
    try {
        const appointments = await appointmentService.getAvailableAppointments(employeeId, date);

        response = appointments;
        statusCode = 200;
    } catch (error) {
        console.log(error);
        response = { "message": "Something went wrong!" };
        statusCode = 500;
    }

    return formatJSONResponse(statusCode, response);
};