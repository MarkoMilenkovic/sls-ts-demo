import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { formatJSONResponse } from '../../libs/api-gateway';
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
        console.log(error);
        return formatJSONResponse(500, { "message": "Something went wrong!" });
    }
};