import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://otecdgfgxplavolsveed.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90ZWNkZ2ZneHBsYXZvbHN2ZWVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2Mjc2MTQsImV4cCI6MjA5MjIwMzYxNH0.hLPPLhwU6ea5l4ddHQc5Lht-YZuZIpeOo77YeDfb1k0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Save all user data to Supabase
export async function saveUserData(userId, name, data) {
  const { error } = await supabase
    .from('user_data')
    .upsert({
      id: userId,
      name,
      data,
      updated_at: new Date().toISOString(),
    });
  if (error) console.error('Save error:', error);
}

// Load user data from Supabase
export async function loadUserData(userId) {
  const { data, error } = await supabase
    .from('user_data')
    .select('name, data')
    .eq('id', userId)
    .single();
  if (error && error.code !== 'PGRST116') console.error('Load error:', error);
  return data;
}
