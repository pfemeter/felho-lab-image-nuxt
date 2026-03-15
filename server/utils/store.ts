// export const recordsDb = [
//     { id: '1', name: 'Sample Diagram', uploadDateTime: '2026-03-01T10:00:00Z', fileId: 'mock-file-1' },
//     { id: '2', name: 'Project Screenshot', uploadDateTime: '2026-03-01T11:30:00Z', fileId: 'mock-file-2' },
// ]
// 
// export const filesDb = new Map<string, { buffer: Buffer; mimetype: string }>()

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL!
const client = postgres(connectionString)
export const db = drizzle(client)