"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapper = void 0;
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const aws_sdk_1 = require("aws-sdk");
let dynamoDBOptions;
if (process.env.IS_OFFLINE) {
    dynamoDBOptions = {
        region: "localhost",
        endpoint: "http://localhost:8000"
    };
}
else {
    dynamoDBOptions = {};
}
const client = new aws_sdk_1.DynamoDB(dynamoDBOptions);
exports.mapper = new dynamodb_data_mapper_1.DataMapper({ client });
//# sourceMappingURL=dynamoDb.js.map