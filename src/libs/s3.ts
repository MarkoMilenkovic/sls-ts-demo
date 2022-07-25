import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";

let s3ClientConfig: S3ClientConfig;
if (process.env.IS_OFFLINE) {
    s3ClientConfig = {
        endpoint: "http://localhost:4569",
        credentials: {
            accessKeyId: "S3RVER", // This specific key is required when working offline
            secretAccessKey: "S3RVER",
        },
        forcePathStyle: true
    }
} else {
    s3ClientConfig = {
        forcePathStyle: true
    };
}

export const s3Client = new S3Client(s3ClientConfig);