"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Client = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
let s3ClientConfig;
if (process.env.IS_OFFLINE) {
    s3ClientConfig = {
        endpoint: "http://localhost:4569",
        credentials: {
            accessKeyId: "S3RVER",
            secretAccessKey: "S3RVER",
        },
        forcePathStyle: true
    };
}
else {
    s3ClientConfig = {
        forcePathStyle: true
    };
}
exports.s3Client = new client_s3_1.S3Client(s3ClientConfig);
//# sourceMappingURL=s3.js.map