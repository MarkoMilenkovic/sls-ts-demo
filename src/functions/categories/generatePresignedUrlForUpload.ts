import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { formatJSONResponse, handleError } from '../../libs/api-gateway';
import { categoryService } from '../../services';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const category = event.pathParameters?.category as string;

    try {
        const presignedUrlForUpload = await categoryService.generatePresignedUrlForUpload(category);
        return formatJSONResponse(200, {url: presignedUrlForUpload});
    } catch (error) {
        return handleError(error);
    }
};


