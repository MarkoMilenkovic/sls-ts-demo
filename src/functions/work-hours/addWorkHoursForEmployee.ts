import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { formatJSONResponse } from '../../libs/api-gateway';
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
        if (error.code === 'InvalidParameters') {
            return formatJSONResponse(400, { "message": "Invalid input parameters!" });
        }
        console.log(error);
        return formatJSONResponse(500, { "message": "Something went wrong!" });
    }
};