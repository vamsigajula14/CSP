import React, { useEffect, useState } from "react";
import { getPosts } from "../api/forumApi";

interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  created_at: string;
}

const ForumHome: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Forum</h2>
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ForumHome;
