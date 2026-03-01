export default defineEventHandler((event) => {
    const query = getQuery(event)
    const sortBy = query.sortBy === 'name' ? 'name' : 'uploadDateTime'

    const records = [...recordsDb]

    records.sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name)
        }
        return new Date(b.uploadDateTime).getTime() - new Date(a.uploadDateTime).getTime()
    })

    return records
})