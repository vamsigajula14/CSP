import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CreateDiscussion = ({ userId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateDiscussion = async () => {
    if (!userId) {
      alert("You must be logged in to create a discussion.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.from("discussions").insert([
        {
          title,
          content,
          tags,
          author_id: userId,
        },
      ]);

      if (error) {
        console.error("Error creating discussion:", error);
        alert(error.message || "Failed to create discussion.");
      } else {
        alert("Discussion created successfully!");
        // Clear the form
        setTitle("");
        setContent("");
        setTags("");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create a New Discussion</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
      ></textarea>
      <input
        type="text"
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        disabled={loading}
      />
      <button onClick={handleCreateDiscussion} disabled={loading}>
        {loading ? "Creating..." : "Create Discussion"}
      </button>
    </div>
  );
};

export default CreateDiscussion;