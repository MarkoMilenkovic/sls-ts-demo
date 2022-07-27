import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { formatJSONResponse, handleError } from '../../libs/api-gateway';
import { shopService } from '../../services';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const body = JSON.parse(event.body as string);
    const { latitude, longitude, name, categories } = body;

    try {
        const shop = await shopService.createShop(latitude, longitude, name, categories);
        return formatJSONResponse(200, shop);
    } catch (error: any) {
        return handleError(error);
    }
};


