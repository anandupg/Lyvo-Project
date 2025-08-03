import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://refwrntscfxzlkxxidki.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlZndybnRzY2Z4emxreHhpZGtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNzQ0MjQsImV4cCI6MjA2OTY1MDQyNH0.iqnsmOjqmeGSj3Otp34CaBLLy5k_KcianIJdufq840g'

// Check if environment variables are properly set
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable. Please check your .env.local file.')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client for API routes
export const createServerClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlZndybnRzY2Z4emxreHhpZGtpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA3NDQyNCwiZXhwIjoyMDY5NjUwNDI0fQ.cRDkTvy9BAbSaPd77L1OYBAynp0JnxfLhNVKeeHEyeU'
  
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Please check your .env.local file.')
  }
  
  return createClient(supabaseUrl!, serviceRoleKey)
} 