import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const createDiscussion = async (title, content, tags, userId) => {
  if (!userId) throw new Error("User must be logged in to create a discussion.");

  const { data, error } = await supabase.from("discussions").insert([
    {
      title,
      content,
      tags,
      author_id: userId,
    },
  ]);

  if (error) throw error;

  return data;
};
