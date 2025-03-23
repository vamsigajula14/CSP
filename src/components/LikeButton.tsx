import React, { useState, useEffect } from "react";
import { toggleLike, hasLiked } from "../api/forumApi";

// Define TypeScript interface for props
interface LikeButtonProps {
  postId: string;  // Assuming postId is a string (change if it's a number)
  userId: string;  // Assuming userId is a string (change if it's a number)
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId, userId }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Check if the user has already liked the post
  useEffect(() => {
    async function checkLikeStatus() {
      const userHasLiked = await hasLiked(postId, userId);
      setLiked(userHasLiked);
    }
    checkLikeStatus();
  }, [postId, userId]);

  // Handle like button click
  const handleLike = async () => {
    try {
      const result = await toggleLike(postId, userId);
      setLiked(result.liked);
      setLikesCount((prev) => (result.liked ? prev + 1 : prev - 1));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <button onClick={handleLike} className={liked ? "liked" : ""}>
      {liked ? "Unlike" : "Like"} ({likesCount})
    </button>
  );
};

export default LikeButton;
