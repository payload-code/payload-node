import * as dotenv from 'dotenv'

import payload from '../../src/payload'

dotenv.config()

if (process.env.API_URL) payload.apiUrl = process.env.API_URL

if (process.env.API_KEY) payload.apiKey = process.env.API_KEY
