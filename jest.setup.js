import '@testing-library/jest-dom'
const { toHaveNoViolations } = require('jest-axe')

process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key'

expect.extend(toHaveNoViolations)
