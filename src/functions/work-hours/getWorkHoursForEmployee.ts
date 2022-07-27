import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { formatJSONResponse, handleError } from '../../libs/api-gateway';
import { employeeWorkHoursService } from '../../services';
import { appointmentService } from '../../services';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const employeeId = event.pathParameters?.employeeId;
    const date = event.pathParameters?.date;

    try {
        const employeeWorkHours =
            await employeeWorkHoursService.getWorkHoursForEmployeeAndDate(employeeId!, date!);
        const scheduledAppointments = await appointmentService.getScheduledAppointments(employeeId!, date!);    
        return formatJSONResponse(200, {employeeWorkHours, scheduledAppointments});
    } catch (error) {
        return handleError(error);
    }
};