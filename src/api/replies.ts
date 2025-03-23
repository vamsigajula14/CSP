import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

// ✅ Function to add a reply
export async function addReply(content: string, discussionId: string, userId: string, parentReplyId: string | null) {
  const { data, error } = await supabase.from("replies").insert([
    {
      content,
      discussion_id: discussionId,
      author_id: userId,
      parent_reply_id: parentReplyId, // This supports nested replies
    },
  ]);

  if (error) throw error;
  return data;
}

// ✅ Function to fetch replies for a discussion
export async function getReplies(discussionId: string) {
  const { data, error } = await supabase
    .from("replies")
    .select("*")
    .eq("discussion_id", discussionId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

// ✅ Function to delete a reply
export async function deleteReply(replyId: string) {
  const { error } = await supabase.from("replies").delete().eq("id", replyId);
  if (error) throw error;
}
