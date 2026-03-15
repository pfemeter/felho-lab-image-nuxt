import { desc, asc } from 'drizzle-orm';
import { images } from '~~/server/database/schema';
import { db } from '~~/server/utils/store';

export default defineEventHandler(async (event) => {
    const { sort = 'date' } = getQuery(event);

    return await db.select()
        .from(images)
        .orderBy(sort === 'name' ? asc(images.name) : desc(images.uploadDateTime));
});