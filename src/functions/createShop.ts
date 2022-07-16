import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { formatJSONResponse } from '../libs/api-gateway';
import { shopService } from '../services';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const body = JSON.parse(event.body as string);
    const { latitude, longitude, name } = body;

    try {
        const shop = await shopService.createShop(latitude, longitude, name);
        return formatJSONResponse(200, shop);
    } catch (error) {
        console.log(error);
        return formatJSONResponse(500, { "message": "Something went wrong!" });
    }
};


