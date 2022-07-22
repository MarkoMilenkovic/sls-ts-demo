import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { formatJSONResponse } from '../../libs/api-gateway';
import { shopService } from '../../services';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const body = JSON.parse(event.body as string);
    const { latitude, longitude, name, categories } = body;

    if (!latitude || !longitude || !name || !categories || categories.length === 0) {
        return formatJSONResponse(400, { "message": "Missing required parameters!" });
    }

    try {
        const shop = await shopService.createShop(latitude, longitude, name, categories);
        return formatJSONResponse(200, shop);
    } catch (error: any) {
        if (error.code === 'ClientError') {
            return formatJSONResponse(400, { "message": error.message });
        }
        console.log(error);
        return formatJSONResponse(500, { "message": "Something went wrong!" });
    }
};


