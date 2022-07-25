import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { formatJSONResponse, handleError } from '../../libs/api-gateway';
import { employeeWorkHoursService } from '../../services';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const employeeId = event.pathParameters?.employeeId;
    const body = JSON.parse(event.body as string);
    const { startDate, endDate, dailyHours } = body;

    try {
        const employeeWorkHours =
            await employeeWorkHoursService.addWorkHoursForEmployee(employeeId!, startDate, endDate, dailyHours);
        return formatJSONResponse(200, employeeWorkHours);
    } catch (error: any) {
        return handleError(error);
    }
};