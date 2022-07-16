import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from "../../libs/api-gateway";
import {appointmentService} from "../../services";

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const body = JSON.parse(event.body as string);
    const { employeeId, appointmentStartTime, userId } = body;

    let statusCode;
    let response;
    try {
        const appointment = await appointmentService.scheduleAppointment(employeeId, appointmentStartTime, userId);

        response = appointment;
        statusCode = 200;
    } catch (error: any) {
        if (error.code === 'ConditionalCheckFailedException') {
            response = { "message": "Appointment not available!" };
            statusCode = 400;
        } else {
            console.log(error);
            response = { "message": "Something went wrong!" };
            statusCode = 500;
        }
    }

    return formatJSONResponse(statusCode, response);
};