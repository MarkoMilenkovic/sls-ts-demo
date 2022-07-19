import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from "../../libs/api-gateway";
import { appointmentService } from "../../services";

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    //todo: move this reading from token?
    const userId = event.queryStringParameters?.userId as string;
    let limit = parseInt(event.queryStringParameters?.limit as string);
    const date = event.queryStringParameters?.date;
    if (!date) {
        return formatJSONResponse(400, { "message": "Date is mandatory!" });
    }

    if (isNaN(limit)) {
        limit = 10;
    }
    try {
        const appointments = await
            appointmentService.getAppointmentsForUser(date, userId, false, limit);
        return formatJSONResponse(200, appointments);

    } catch (error) {
        console.log(error);
        return formatJSONResponse(500, { "message": "Something went wrong!" });
    }
};