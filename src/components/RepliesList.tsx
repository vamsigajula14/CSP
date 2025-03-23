import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { format } from "date-fns";

interface Profile {
  full_name: string;
}

interface Reply {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: Profile | null;
}

const RepliesList = ({ discussionId, userId }: { discussionId: string; userId: string }) => {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyText, setReplyText] = useState("");
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    fetchReplies();
  }, []);

  /** ✅ Fetch Replies with Correct Author Name */
  async function fetchReplies() {
    const { data, error } = await supabase
      .from("replies")
      .select(`
        id, content, created_at, user_id,
        profiles!replies_user_id_fkey ( full_name )
      `)
      .eq("discussion_id", discussionId)
      .order("created_at", { ascending: true });
  
    if (error) {
      console.error("❌ Supabase Query Error:", error.message, error.details);
      toast.error(`Error fetching replies: ${error.message}`);
      return;
    }
  
    // ✅ Extract profile correctly
    const formattedReplies: Reply[] = data.map(reply => ({
      ...reply,
      profiles: reply.profiles ? reply.profiles[0] : null,
    }));
  
    setReplies(formattedReplies);
  }  

  /** ✅ Post a New Reply */
  async function submitReply() {
    if (!replyText.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    const replyData = {
      discussion_id: discussionId,
      user_id: userId,
      content: replyText.trim(),
    };

    const { error } = await supabase.from("replies").insert([replyData]);

    if (!error) {
      toast.success("Reply posted!");
      setReplyText("");
      fetchReplies(); // Refresh list
    } else {
      console.error("❌ Supabase Insert Error:", error);
      toast.error("Error posting reply");
    }
  }

  /** ✅ Edit a Reply */
  async function updateReply(replyId: string) {
    if (!editedContent.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    const { error } = await supabase
      .from("replies")
      .update({ content: editedContent.trim() })
      .eq("id", replyId)
      .eq("user_id", userId);

    if (!error) {
      toast.success("Reply updated!");
      setEditingReplyId(null);
      setEditedContent("");
      fetchReplies();
    } else {
      console.error("❌ Supabase Update Error:", error);
      toast.error("Error updating reply");
    }
  }

  /** ✅ Delete a Reply */
  async function deleteReply(replyId: string) {
    const { error } = await supabase
      .from("replies")
      .delete()
      .eq("id", replyId)
      .eq("user_id", userId);

    if (!error) {
      toast.success("Reply deleted!");
      fetchReplies();
    } else {
      console.error("❌ Supabase Delete Error:", error);
      toast.error("Error deleting reply");
    }
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Replies</h3>

      {replies.length === 0 ? (
        <p className="text-gray-500">No replies yet. Be the first to reply!</p>
      ) : (
        <div className="space-y-4">
          {replies.map((reply) => (
            <div key={reply.id} className="bg-gray-100 p-3 rounded-lg">
              {editingReplyId === reply.id ? (
                <div>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                  <button
                    onClick={() => updateReply(reply.id)}
                    className="bg-blue-600 text-white px-4 py-2 mt-2 rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingReplyId(null)}
                    className="text-gray-500 ml-2"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-gray-800">{reply.content}</p>
                  <small className="text-gray-600">
                    - {reply.profiles?.full_name || "Unknown"} •{" "}
                    {format(new Date(reply.created_at), "MMM d, yyyy")}
                  </small>

                  {/* ✅ Show Edit/Delete Buttons Only for the Author */}
                  {reply.user_id === userId && (
                    <>
                      <button
                        onClick={() => {
                          setEditingReplyId(reply.id);
                          setEditedContent(reply.content);
                        }}
                        className="text-blue-500 ml-4"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteReply(reply.id)}
                        className="text-red-500 ml-2"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reply Input */}
      <div className="mt-4">
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Write your reply..."
        />
        <button
          onClick={submitReply}
          className="bg-green-600 text-white px-4 py-2 mt-2 rounded-md hover:bg-green-700"
        >
          Post Reply
        </button>
      </div>
    </div>
  );
};

export default RepliesList;
