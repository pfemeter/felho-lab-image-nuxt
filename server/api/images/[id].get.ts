import { GetObjectCommand } from "@aws-sdk/client-s3";
import { eq } from 'drizzle-orm';
import { s3Client } from '../../utils/s3';
import { db } from '../../utils/store';
import { images } from '../../database/schema';

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');

    // 1. Fetch metadata from DB to get the S3 Key
    const [imageRecord] = await db.select()
        .from(images)
        .where(eq(images.id, id));

    if (!imageRecord) {
        throw createError({ statusCode: 404, statusMessage: 'Image not found' });
    }

    try {
        // 2. Request the file from S3
        const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: imageRecord.s3Key,
        });

        const response = await s3Client.send(command);

        // 3. Set the correct headers so the browser knows it's an image
        setHeaders(event, {
            'Content-Type': imageRecord.fileMimeType,
            'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        });

        // 4. Return the body as a stream
        // Nitro handles Web Streams automatically
        return response.Body;
    } catch (error) {
        console.error('S3 Fetch Error:', error);
        throw createError({ statusCode: 500, statusMessage: 'Could not retrieve image from storage' });
    }
});