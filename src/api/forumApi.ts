import { supabase } from "../supabaseClient";

// ✅ Fetch all posts
export const getPosts = async () => {
  const { data, error } = await supabase.from("posts").select("*");
  if (error) throw error;
  return data;
};

// ✅ Fetch a single post by ID
export const getPostById = async (postId: string) => {
  const { data, error } = await supabase.from("posts").select("*").eq("id", postId).single();
  if (error) throw error;
  return data;
};

// ✅ Create a new post
export const createPost = async (title: string, content: string, userId: string) => {
  const { data, error } = await supabase
    .from("posts")
    .insert([{ title, content, user_id: userId }]);
  if (error) throw error;
  return data;
};

// ✅ Fetch comments for a post
export const getComments = async (postId: string) => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};

// ✅ Add a new comment
export const addComment = async (postId: string, userId: string, content: string) => {
  const { data, error } = await supabase
    .from("comments")
    .insert([{ post_id: postId, user_id: userId, content }]);
  if (error) throw error;
  return data;
};

// ✅ Fetch likes count for a post
export const getLikes = async (postId: string) => {
  const { data, error } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", postId);

  if (error) throw error;
  return data.length;
};

// ✅ Check if a user has liked a post
export const hasLiked = async (postId: string, userId: string) => {
  const { data, error } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return !!data;
};

// ✅ Toggle like for a post
export const toggleLike = async (postId: string, userId: string) => {
  const liked = await hasLiked(postId, userId);

  if (liked) {
    // Remove like
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);
    if (error) throw error;
    return { liked: false };
  } else {
    // Add like
    const { error } = await supabase.from("likes").insert([{ post_id: postId, user_id: userId }]);
    if (error) throw error;
    return { liked: true };
  }
};
