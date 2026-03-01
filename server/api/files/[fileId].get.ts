export default defineEventHandler((event) => {
    const fileId = getRouterParam(event, 'fileId')

    // Look up the file in memory store
    const file = filesDb.get(fileId!)

    if (file) {
        // Return the actual uploaded file buffer
        setResponseHeader(event, 'Content-Type', file.mimetype)
        return file.buffer
    }

    // Fallback to mock data
    return sendRedirect(event, `https://placehold.co/600x400/png?text=${fileId}`)
})