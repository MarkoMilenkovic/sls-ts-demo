import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { formatJSONResponse } from '../../libs/api-gateway';
import { primoServices } from '../../services';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const shopId = event.pathParameters?.shopId as string;

    try {
        const shop = await primoServices.getServicesForShop(shopId);
        return formatJSONResponse(200, shop);
    } catch (error) {
        console.log(error);
        return formatJSONResponse(500, { "message": "Something went wrong!" });
    }
};


