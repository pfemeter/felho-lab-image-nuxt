import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from '../utils/store'
import { users } from '../database/schema'

export default defineEventHandler(async (event) => {
    const { action, username, password } = await readBody(event)

    if (action === 'register') {
        const hashedPassword = await bcrypt.hash(password, 10)
        try {
            const [newUser] = await db.insert(users).values({
                username,
                passwordHash: hashedPassword
            }).returning()

            // Auto-login after registration
            await setUserSession(event, { user: { id: newUser.id, username: newUser.username } })
            return { success: true }
        } catch (e) {
            throw createError({ statusCode: 400, statusMessage: 'Username already exists' })
        }
    }

    if (action === 'login') {
        const [user] = await db.select().from(users).where(eq(users.username, username))

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
        }

        // Set the encrypted session cookie automatically
        await setUserSession(event, {
            user: { id: user.id, username: user.username },
            loggedInAt: new Date()
        })

        return { success: true }
    }
})