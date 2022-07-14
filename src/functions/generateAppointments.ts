import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from "../libs/api-gateway";
import appointmentService from "../services";

export const hanler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const body = JSON.parse(event.body as string);
    const { employeeId, startTime, endTime } = body;
    if (isNaN(Date.parse(startTime)) || isNaN(Date.parse(endTime))) {
        return formatJSONResponse(400, { "message": "Dates are not valid!" });
    }
    let startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);

    try {
        const savedAppointments = await
            appointmentService.generateAppointments(employeeId, startDateTime, endDateTime);
        return formatJSONResponse(200, savedAppointments);

    } catch (error) {
        console.log(error);
        return formatJSONResponse(500, { "message": "Something went wrong!" });
    }
};