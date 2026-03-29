import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { db } from '../../utils/store';
import { images } from '../../database/schema';

const s3 = new S3Client({ region: 'us-east-1' });

export default defineEventHandler(async (event) => {
    // REQUIRE LOGIN
    const session = await getUserSession(event)
    if (!session.user) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized: Please login to upload' })
    }

    const userId = session.user.id

    const formData = await readMultipartFormData(event);
    const file = formData?.find(f => f.name === 'file');
    const filenameByUserObj = formData?.find(f => f.name === 'name');
    const filenameByUser: string | undefined = filenameByUserObj?.data.toString('utf-8');

    if (!file) throw createError({ statusCode: 400 });

    const s3Key = `uploads/${userId}/${Date.now()}-${file.filename}`;

    // 2. Upload to S3
    await s3.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
        Body: file.data,
        ContentType: file.type
    }));

    // 3. Save Metadata to DB
    await db.insert(images).values({
        name: filenameByUser || file.filename || 'Untitled',
        fileMimeType: file.type || 'image/png',
        s3Key: s3Key,
        userId: userId
    });

    return { success: true };
});