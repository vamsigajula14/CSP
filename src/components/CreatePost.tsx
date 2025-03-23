import React, { useState } from "react";
import { createPost } from "../api/forumApi";

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userId = "user-123"; // Replace with actual user ID
    await createPost(title, content, userId);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required />
      <button type="submit">Post</button>
    </form>
  );
};

export default CreatePost;
