import { createClient } from '@supabase/supabase-js';

<<<<<<< HEAD

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


=======
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

>>>>>>> aeabe0789f190afb6234d65cd3ff666f7f45df8c
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: 'user' | 'expert' | 'admin';
  created_at: string;
};

export type Guide = {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  author_id: string;
};

export type Discussion = {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  tags: string[];
};

export type Reply = {
  id: string;
  content: string;
  discussion_id: string;
  author_id: string;
  created_at: string;
};

export type Vote = {
  id: string;
  discussion_id: string;
  user_id: string;
  created_at: string;
};