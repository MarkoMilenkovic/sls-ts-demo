import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { formatJSONResponse } from '../../libs/api-gateway';
import { primoServices } from '../../services';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    try {
        const services = await primoServices.getServices();
        return formatJSONResponse(200, services);
    } catch (error) {
        console.log(error);
        return formatJSONResponse(500, { "message": "Something went wrong!" });
    }
};


