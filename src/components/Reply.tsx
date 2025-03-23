import { useState } from "react";
import { addReply } from "../api/replies";

interface ReplyProps {
  discussionId: string;
  parentReplyId: string | null;
  userId: string;
  onReplyAdded: () => void;
}

const Reply: React.FC<ReplyProps> = ({ discussionId, parentReplyId, userId, onReplyAdded }) => {
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    setLoading(true);
    try {
      await addReply(replyText, discussionId, userId, parentReplyId);
      setReplyText("");
      onReplyAdded(); // Refresh replies after adding
    } catch (error: any) {
      console.error("Failed to add reply:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <textarea
        className="w-full border p-2"
        placeholder="Write a reply..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-3 py-1 mt-2"
        disabled={loading}
        onClick={handleReplySubmit}
      >
        {loading ? "Posting..." : "Reply"}
      </button>
    </div>
  );
};

export default Reply;
