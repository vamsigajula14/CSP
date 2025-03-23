import React, { useEffect, useState } from "react";
import { getPosts } from "../api/forumApi";
import { Link } from "react-router-dom";

const ForumPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;

  return (
    <div>
      <h1>Community Forum</h1>
      <Link to="/forum/new">
        <button>Create New Post</button>
      </Link>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/forum/${post.id}`}>
              <h3>{post.title}</h3>
            </Link>
            <p>Posted by {post.profiles?.full_name || "Anonymous"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ForumPage;
