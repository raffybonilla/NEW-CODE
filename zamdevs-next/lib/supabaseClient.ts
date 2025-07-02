import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xftjumejicbxbaoqfugj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmdGp1bWVqaWNieGJhb3FmdWdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMzk5ODEsImV4cCI6MjA2NTkxNTk4MX0.QGWradaCpxJaDn7srZVeu5LnHIjg6GSjipOZ9fx_V-Q';
export const supabase = createClient(supabaseUrl, supabaseKey);