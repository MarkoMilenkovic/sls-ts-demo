import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { formatJSONResponse, handleError } from '../../libs/api-gateway';
import { categoryService } from '../../services';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    try {
        const categories = await categoryService.getCategories();
        return formatJSONResponse(200, categories);
    } catch (error) {
        return handleError(error);
    }
};


