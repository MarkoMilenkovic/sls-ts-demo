"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapper = exports.client = void 0;
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const aws_sdk_1 = require("aws-sdk");
let dynamoDBOptions;
if (!process.env.IS_OFFLINE) {
    dynamoDBOptions = {
        region: "localhost",
        endpoint: "http://localhost:8000"
    };
}
else {
    dynamoDBOptions = {};
}
exports.client = new aws_sdk_1.DynamoDB(dynamoDBOptions);
exports.mapper = new dynamodb_data_mapper_1.DataMapper({ client: exports.client });
//# sourceMappingURL=dynamoDb.js.map