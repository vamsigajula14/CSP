import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface Reply {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
}

const ReplyList = ({ discussionId }: { discussionId: string }) => {
  const [replies, setReplies] = useState<Reply[]>([]);

  useEffect(() => {
    const fetchReplies = async () => {
      const { data, error } = await supabase
        .from("replies")
        .select("*")
        .eq("discussion_id", discussionId)
        .order("created_at", { ascending: true });

      if (error) console.error("Error fetching replies:", error);
      else setReplies(data || []);
    };

    fetchReplies();
  }, [discussionId]);

  return (
    <div>
      <h3>Replies</h3>
      {replies.length > 0 ? (
        replies.map((reply) => (
          <div key={reply.id} className="reply">
            <p>{reply.content}</p>
            <small>Posted at: {new Date(reply.created_at).toLocaleString()}</small>
          </div>
        ))
      ) : (
        <p>No replies yet.</p>
      )}
    </div>
  );
};

export default ReplyList;
