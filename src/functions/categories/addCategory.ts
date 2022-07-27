import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse, handleError } from "../../libs/api-gateway";
import { categoryService } from "../../services";

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const categories = JSON.parse(event.body as string);
    
    try {
        const createdCategories = await categoryService.createCategories(categories);
        return formatJSONResponse(200, createdCategories);

    } catch (error) {
        return handleError(error);
    }
};