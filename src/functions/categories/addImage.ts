import { APIGatewayProxyResult, S3Event } from 'aws-lambda';
import { formatJSONResponse, handleError } from '../../libs/api-gateway';
import { categoryService } from '../../services';

export const handler = async (event: S3Event): Promise<APIGatewayProxyResult> => {
    const key = event.Records[0].s3.object.key;

    try {
        const presignedUrlForUpload = await categoryService.addImage(key);
        return formatJSONResponse(200, {url: presignedUrlForUpload});
    } catch (error) {
        return handleError(error);
    }
};


