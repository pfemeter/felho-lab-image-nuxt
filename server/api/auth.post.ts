export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { action, username, password } = body

    // Simulated network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    if (action === 'login') {
        if (username === 'admin' && password === 'password') {
            // --- PLACEHOLDER JWT GENERATION ---
            // In a real app, you would use a library like 'jsonwebtoken' or 'jose' here.
            const fakeJwt = `header.${btoa(JSON.stringify({ user: 'admin' }))}.signature`

            // Set the cookie on the server response
            setCookie(event, 'auth_token', fakeJwt, {
                maxAge: 60 * 60, // 1 hour
                secure: !import.meta.dev,
                path: '/'
            })

            return { success: true, message: 'Login successful!' }
        }
        throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
    }

    if (action === 'register') {
        return { success: true, message: 'Registration successful! You can now log in.' }
    }

    throw createError({ statusCode: 400, statusMessage: 'Invalid action' })
})