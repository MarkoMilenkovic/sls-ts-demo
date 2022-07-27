import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse, handleError } from "../../libs/api-gateway";
import { appointmentService } from "../../services";

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    //todo: move this reading from token?
    const userId = event.queryStringParameters?.userId;
    let limit = parseInt(event.queryStringParameters?.limit as string);
    const date = event.queryStringParameters?.date; 
    if(isNaN(limit)) {
        limit = 10;
    }

    try {
        const appointments = await
            appointmentService.getAppointmentsForUser(date!, userId!, true, limit);
        return formatJSONResponse(200, appointments);

    } catch (error) {
        return handleError(error);
    }
};