import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const SUPABASE_URL = "https://rumwbymkbtxezokdjobx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1bXdieW1rYnR4ZXpva2Rqb2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5OTY3ODMsImV4cCI6MjA2NzU3Mjc4M30.NZhGwa7xOhwhrsVl1Xhnu_CCkgJVoOBIg9Es_H03Lns";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
