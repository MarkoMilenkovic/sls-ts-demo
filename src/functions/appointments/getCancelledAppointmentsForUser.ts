import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse, handleError } from "../../libs/api-gateway";
import { appointmentService } from "../../services";

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    //todo: move this reading from token?
    const userId = event.queryStringParameters?.userId;
    let limit = parseInt(event.queryStringParameters?.limit as string);
    let date = event.queryStringParameters?.date; 

    if(!date) {
        date = new Date().toISOString();
    }

    if (isNaN(limit)) {
        limit = 10;
    }
    try {
        const cancelledAppointments = await
            appointmentService.getCancelledAppointmentForUser(userId!, date!, limit);
        return formatJSONResponse(200, cancelledAppointments);

    } catch (error) {
        return handleError(error);
    }
};