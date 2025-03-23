
import { supabase } from "../supabaseClient";

// Fetch replies for a specific discussion
export const getRepliesByDiscussionId = async (discussionId: string) => {
  const { data, error } = await supabase
    .from("replies")
    .select("*")
    .eq("discussion_id", discussionId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};

// Add a new reply
export const addReply = async (discussionId: string, userId: string, content: string) => {
  const { data, error } = await supabase
    .from("replies")
    .insert([{ discussion_id: discussionId, author_id: userId, content }]);

  if (error) throw error;
  return data;
};

// Delete a reply
export const deleteReply = async (replyId: string) => {
  const { error } = await supabase.from("replies").delete().eq("id", replyId);
  if (error) throw error;
};
