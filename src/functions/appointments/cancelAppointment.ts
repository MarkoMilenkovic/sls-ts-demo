import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse, handleError } from "../../libs/api-gateway";
import { appointmentService } from "../../services";

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    //todo: move reading of initiator from token?
    const body = JSON.parse(event.body as string);
    const { employeeId, appointmentStartTime, initiator } = body;
    try {
        const appointments = await
            appointmentService.cancelAppointment(employeeId, appointmentStartTime, initiator);
        return formatJSONResponse(200, appointments);

    } catch (error) {
        return handleError(error);
    }
};