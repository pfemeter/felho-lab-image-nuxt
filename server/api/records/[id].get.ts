export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Return simulated detailed data
    return {
        id,
        description: `This is the detailed view for record ${id}. This heavy data is only fetched when explicitly requested to save initial bandwidth.`,
        author: 'System Admin',
        fileSize: `${Math.floor(Math.random() * 50) + 5} MB`,
        lastModified: new Date().toISOString()
    }
})