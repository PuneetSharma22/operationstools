import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ihodvebprqaqphdnfobn.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlob2R2ZWJwcnFhcXBoZG5mb2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTUwODcsImV4cCI6MjA5NzQ3MTA4N30.5FrLZLz6QIkF5WPkgC5b-mDzXbld5w-syd9kGaXB-c0'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
export default supabase