import { desc, asc } from 'drizzle-orm';
import { images } from '~~/server/database/schema';
import { db } from '~~/server/utils/store';

export default defineEventHandler(async (event) => {
    const { sortBy = 'uploadDateTime' } = getQuery(event);

    return await db.select()
        .from(images)
        .orderBy(sortBy === 'name' ? asc(images.name) : desc(images.uploadDateTime));
});