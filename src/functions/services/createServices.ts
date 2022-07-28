import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { formatJSONResponse, handleError } from '../../libs/api-gateway';
import { primoServices } from '../../services';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const names = JSON.parse(event.body!);

    try {
        const services = await primoServices.createServices(names);
        return formatJSONResponse(200, services);
    } catch (error) {
        return handleError(error);
    }
};


