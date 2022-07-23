import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (statusCode: number, response: any) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(response)
  }
}

export const handleError = (error: any) => {
  if (error.code === 'ClientError') {
    const response = { "message": error.message };
    return formatJSONResponse(400, response);
  }
  else {
    console.log(error);
    const response = { "message": "Something went wrong!" };
    return formatJSONResponse(500, response);
  }
}

export const handleScheduleAppointmentError = (error: any) => {
  if (error.code === 'ConditionalCheckFailedException' || error.code === 'TransactionCanceledException') {
    const response = { "message": "Appointment not available!" };
    return formatJSONResponse(400, response);
  }
  return handleError(error);
}
