import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { formatJSONResponse } from '../../libs/api-gateway';
import { ServicePerShop } from '../../models/servicePerShop';
import { primoServices } from '../../services';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const shopId = event.pathParameters?.shopId;
    const services: ServicePerShop[] = JSON.parse(event.body as string);
    if (services.filter(e => !e.durationInMinutes || !e.price).length > 0) {
        return formatJSONResponse(400, { "message": "Duration and price are mandatory" });
    }
    try {
        const shop = await primoServices.addServicesToShop(shopId!, services);
        return formatJSONResponse(200, shop);
    } catch (error) {
        console.log(error);
        return formatJSONResponse(500, { "message": "Something went wrong!" });
    }
};


