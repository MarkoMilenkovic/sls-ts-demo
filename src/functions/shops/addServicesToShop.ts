import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { formatJSONResponse, handleError } from '../../libs/api-gateway';
import { primoServices } from '../../services';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const shopId = event.pathParameters?.shopId;
    const services = JSON.parse(event.body!);
    try {
        const shop = await primoServices.addServicesToShop(shopId!, services!);
        return formatJSONResponse(200, shop);
    } catch (error) {
        return handleError(error);
    }
};


