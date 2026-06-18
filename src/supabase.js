import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wkqsjcrqapvuwtlapnvz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrcXNqY3JxYXB2dXd0bGFwbnZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODYxMTUsImV4cCI6MjA5NzM2MjExNX0.X6IL3O5k79bbg1smM_dVEtTFeHMGWLQ6jk-wFNiNYVU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)