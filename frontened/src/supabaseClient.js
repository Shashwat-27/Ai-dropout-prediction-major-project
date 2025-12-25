// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Replace these with your own Supabase URL and anon key
const supabaseUrl = 'https://eakawsuhjwbxtqzznfma.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVha2F3c3VoandieHRxenpuZm1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTU5NzksImV4cCI6MjA3NjE5MTk3OX0.W7Zh3SdNHjmLm7eOOu9jF59GKJKIoOxVUGd61upLmNE'

export const supabase = createClient(supabaseUrl, supabaseKey)
