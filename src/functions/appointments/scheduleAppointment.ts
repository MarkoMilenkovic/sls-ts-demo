import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse, handleScheduleAppointmentError } from "../../libs/api-gateway";
import { appointmentService } from "../../services";

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const body = JSON.parse(event.body as string);
    const { employeeId, appointmentStartTime, userId, serviceId } = body;
    try {
            const appointment = await
                appointmentService.scheduleAppointment(employeeId, appointmentStartTime, userId, serviceId);

            return formatJSONResponse(200, appointment);
        } catch (error: any) {
            return handleScheduleAppointmentError(error);
        }

};