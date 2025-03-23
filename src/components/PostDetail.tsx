import React, { useEffect, useState } from "react";
import { getComments, addComment } from "../api/forumApi";

interface Comment {
  id: string;
  postId: string;
  content: string;
  userId: string;
  created_at: string;
}

interface PostDetailProps {
  postId: string;
}

const PostDetail: React.FC<PostDetailProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await getComments(postId);
      setComments(fetchedComments);
    };
    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userId = "user-123"; // Replace with actual user ID
    await addComment(postId, newComment, userId);
    setNewComment("");
  };

  return (
    <div>
      <h3>Comments</h3>
      {comments.map((comment) => (
        <p key={comment.id}>{comment.content}</p>
      ))}
      <form onSubmit={handleCommentSubmit}>
        <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} required />
        <button type="submit">Comment</button>
      </form>
    </div>
  );
};

export default PostDetail;
