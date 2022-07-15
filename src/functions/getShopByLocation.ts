import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { formatJSONResponse } from '../libs/api-gateway';
import { shopService } from '../services';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const body = JSON.parse(event.body as string);
    const { latitude, longitude, radius } = body;

    try {
        const shops = await shopService.getShopsNearLocation(latitude, longitude, radius);
        return formatJSONResponse(200, shops);

    } catch (error) {
        console.log(error);
        return formatJSONResponse(500, { "message": "Something went wrong!" });
    }
};


