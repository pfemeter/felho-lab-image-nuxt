// server/utils/s3.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({ region: "us-east-1" });

// Example usage
export const uploadFile = async (bucket, key, body) => {
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body
    });
    return await s3Client.send(command);
};