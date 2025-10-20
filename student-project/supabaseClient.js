import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


export const supabase = createClient(supabaseUrl, supabaseAnonKey,{
    auth:{
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl:true,
    }
});

// For more details, see https://supabase.com/docs/guides/with-react
