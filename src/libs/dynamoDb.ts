import { DataMapper } from "@aws/dynamodb-data-mapper";
import { DynamoDB } from "aws-sdk";

let  dynamoDBOptions: DynamoDB.ClientConfiguration;
if (process.env.IS_OFFLINE) {
  dynamoDBOptions = {
    region: "localhost",
    endpoint: "http://localhost:8000"
  }
}  else {
  dynamoDBOptions = {};
}

const client = new DynamoDB(dynamoDBOptions);
export const mapper = new DataMapper({ client });