export default defineEventHandler(async (event) => {
    const formData = await readMultipartFormData(event)
    if (!formData) throw createError({ statusCode: 400, message: 'Invalid form data' })

    let name = ''
    let fileData: Buffer | undefined
    let mimetype = ''

    for (const field of formData) {
        if (field.name === 'name') name = field.data.toString()
        if (field.name === 'file') {
            fileData = field.data
            mimetype = field.type || ''
        }
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (!fileData || !allowedTypes.includes(mimetype)) {
        throw createError({ statusCode: 400, message: 'Invalid file. Only JPG and PNG are allowed.' })
    }

    // Generate IDs and timestamps (mock DB behavior)
    const id = crypto.randomUUID()
    const fileId = crypto.randomUUID()
    const uploadDateTime = new Date().toISOString()

    // Save to in-memory "database"
    filesDb.set(fileId, { buffer: fileData, mimetype })
    const newRecord = { id, name, uploadDateTime, fileId }
    recordsDb.push(newRecord)

    return newRecord
})