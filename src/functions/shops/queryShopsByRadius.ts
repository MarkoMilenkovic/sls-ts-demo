import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { formatJSONResponse } from '../../libs/api-gateway';
import { shopService } from '../../services';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const latitude: number = parseFloat(event.queryStringParameters?.latitude as string);
    const longitude: number = parseFloat(event.queryStringParameters?.longitude as string);
    const radius: number = parseFloat(event.queryStringParameters?.radius as string);
    if (!latitude || !longitude || !radius) {
        return formatJSONResponse(400, { message: "latitude, longitude and radius are required!" });
    }

    try {
        const shops = await shopService.getShopsNearLocation(latitude, longitude, radius);
        return formatJSONResponse(200, shops);
    } catch (error) {
        console.log(error);
        return formatJSONResponse(500, { "message": "Something went wrong!" });
    }
};


