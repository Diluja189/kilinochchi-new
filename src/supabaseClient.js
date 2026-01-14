import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = "https://iedrbbadousuikbrukjc.supabase.co";
// const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllZHJiYmFkb3VzdWlrYnJ1a2pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NTQwOTQsImV4cCI6MjA3OTUzMDA5NH0.o5kRv4FOHCHTgrr6XKs4xRmUNOkWqANPIloLTIcfgs0";

export const supabaseUrl = "https://ejsjtxbuvfgqrhaeomfv.supabase.co";
export const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqc2p0eGJ1dmZncXJoYWVvbWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNjQzNzQsImV4cCI6MjA4Mjc0MDM3NH0.tQPvomYhPSdaJDokUDyqdIlQ74g7FpdULRqSh2vtQms";



export const supabase = createClient(supabaseUrl, supabaseAnonKey);
