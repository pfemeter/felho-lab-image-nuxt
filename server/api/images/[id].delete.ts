import { eq, and } from 'drizzle-orm'
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { images } from '~~/server/database/schema'
import { s3Client } from '~~/server/utils/s3'

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)
    if (!session.user) throw createError({ statusCode: 401 })

    const imageId = getRouterParam(event, 'id')

    // 1. Find the image and ensure it belongs to the logged-in user
    const [image] = await db.select().from(images)
        .where(and(eq(images.id, imageId), eq(images.userId, session.user.id)))

    if (!image) throw createError({ statusCode: 403, statusMessage: 'Unauthorized' })

    // 2. Delete from S3
    await s3Client.send(new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: image.s3Key
    }))

    // 3. Delete from DB
    await db.delete(images).where(eq(images.id, imageId))

    return { success: true }
})