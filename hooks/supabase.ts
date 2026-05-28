import { createClient } from '@supabase/supabase-js';


const SUPABASE_URL = 'https://dtidkwzdyahwmtbexxzx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_kskUHHsvcqe70q3YqrqqDQ_XE775teN';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
