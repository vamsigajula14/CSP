import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById, getLikes, hasLiked, toggleLike, getComments, addComment } from "../api/forumApi";
import { useAuth } from "../contexts/AuthContext";

const PostPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const { user } = useAuth(); // Ensure `useAuth()` returns user
    const [post, setPost] = useState<any>(null);
    const [likes, setLikes] = useState<number>(0);
    const [liked, setLiked] = useState<boolean>(false);
    const [comments, setComments] = useState<any[]>([]);
    const [commentText, setCommentText] = useState<string>("");

    useEffect(() => {
        if (!postId) return;

        const fetchData = async () => {
            try {
                const postData = await getPostById(postId);
                setPost(postData);

                const likeCount = await getLikes(postId);
                setLikes(likeCount);

                if (user) {
                    const userLiked = await hasLiked(postId, user.id);
                    setLiked(userLiked);
                }

                const postComments = await getComments(postId);
                setComments(postComments);
            } catch (error) {
                console.error("Error fetching post details:", error);
            }
        };

        fetchData();
    }, [postId, user]);

    const handleLike = async () => {
        if (!user) {
            alert("You must be logged in to like a post.");
            return;
        }

        try {
            const { liked } = await toggleLike(postId!, user.id);
            setLiked(liked);
            setLikes(liked ? likes + 1 : likes - 1);
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    const handleCommentSubmit = async () => {
        if (!user) {
            alert("You must be logged in to comment.");
            return;
        }

        if (commentText.trim() === "") return;

        try {
            const newComment = await addComment(postId!, user.id, commentText);
            setComments([...comments, newComment]);
            setCommentText("");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    if (!post) return <p>Loading post...</p>;

    return (
        <div className="post-page">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <button onClick={handleLike}>{liked ? "Unlike" : "Like"} ({likes})</button>

            <h3>Comments</h3>
            {comments.length === 0 ? <p>No comments yet.</p> : (
                <ul>
                    {comments.map((comment) => (
                        <li key={comment.id}>
                            <strong>{comment.user_id}:</strong> {comment.content}
                        </li>
                    ))}
                </ul>
            )}

            {user ? (
                <div>
                    <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                    <button onClick={handleCommentSubmit}>Post Comment</button>
                </div>
            ) : (
                <p>You must be logged in to comment.</p>
            )}
        </div>
    );
};

export default PostPage;
