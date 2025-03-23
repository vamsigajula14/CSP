import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface VoteButtonProps {
  discussionId: string;
  userId: string;
}

const VoteButton: React.FC<VoteButtonProps> = ({ discussionId, userId }) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch the current vote count & check if the user has voted
  useEffect(() => {
    const fetchVoteData = async () => {
      if (!userId) return;

      try {
        // Check if the user has already voted
        const { data: existingVote, error: voteError } = await supabase
          .from("votes")
          .select("id")
          .eq("discussion_id", discussionId)
          .eq("user_id", userId)
          .single();

        if (voteError && voteError.code !== "PGRST116") console.error(voteError);

        setHasVoted(!!existingVote);

        // Fetch total votes count
        const { data: votes, error } = await supabase
          .from("votes")
          .select("*")
          .eq("discussion_id", discussionId);

        if (error) throw error;
        setVoteCount(votes.length);
      } catch (error) {
        console.error("Error fetching vote data:", error);
      }
    };

    fetchVoteData();
  }, [discussionId, userId]);

  const handleVote = async () => {
    if (!userId) {
      console.error("User is not logged in.");
      return;
    }

    setLoading(true);

    try {
      if (hasVoted) {
        // Remove vote (unvote)
        const { error } = await supabase
          .from("votes")
          .delete()
          .eq("discussion_id", discussionId)
          .eq("user_id", userId);

        if (error) throw error;

        setHasVoted(false);
        setVoteCount((prevCount) => prevCount - 1);
      } else {
        // Insert new vote
        const { error } = await supabase.from("votes").insert([
          { discussion_id: discussionId, user_id: userId },
        ]);

        if (error) throw error;

        setHasVoted(true);
        setVoteCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={loading}
      className={`px-4 py-2 rounded ${
        hasVoted ? "bg-red-500 text-white" : "bg-blue-500 text-white"
      }`}
    >
      {hasVoted ? "Unvote ❌" : "Vote 👍"} ({voteCount})
    </button>
  );
};

export default VoteButton;
