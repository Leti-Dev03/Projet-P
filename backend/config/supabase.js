import { createClient } from '@supabase/supabase-js';
import { ENV } from './env.js';

const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_KEY);

export default supabase;
export { supabase as supabaseAdmin };