import { createClient } from "@supabase/supabase-js";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

// 🔥 Initialize Supabase Client
const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
);

interface DeleteButtonProps {
    discussionId: string;
    userId: string;
    authorId: string;
    onDelete: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ discussionId, userId, authorId, onDelete }) => {
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        setLoading(true);

        try {
            console.log("Attempting to delete discussion:", discussionId);

            // 🔒 Check Permission
            if (userId !== authorId) {
                throw new Error("You can only delete your own posts.");
            }

            // 🚨 Confirm Deletion
            if (!window.confirm("Are you sure you want to delete this discussion?")) {
                setLoading(false);
                return;
            }

            // 🛠 Step 1: Delete Related Votes (if exists)
            console.log("Deleting related votes...");
            const { error: votesError } = await supabase
                .from("votes")
                .delete()
                .eq("discussion_id", discussionId);

            if (votesError) {
                console.warn("Votes deletion error:", votesError);
            } else {
                console.log("Votes deleted successfully.");
            }

            // 🛠 Step 2: Delete Related Comments (if exists)
            console.log("Deleting related comments...");
            const { error: commentsError } = await supabase
                .from("comments")
                .delete()
                .eq("discussion_id", discussionId);

            if (commentsError) {
                console.warn("Comments deletion error:", commentsError);
            } else {
                console.log("Comments deleted successfully.");
            }

            // 🚀 Step 3: Delete Discussion
            console.log("Deleting discussion...");
            const { error: deleteError } = await supabase
                .from("discussions")
                .delete()
                .eq("id", discussionId);

            if (deleteError) {
                console.error("Supabase delete error:", deleteError);
                throw new Error("Failed to delete discussion.");
            }

            // 🎉 Success
            toast.success("Discussion deleted successfully.");
            onDelete();
        } catch (error: any) {
            toast.error(error.message);
            console.error("Deletion error:", error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="text-red-600 hover:text-red-800 disabled:opacity-50 flex items-center space-x-2"
        >
            <Trash2 className="h-5 w-5" />
            <span>{loading ? "Deleting..." : "Delete"}</span>
        </button>
    );
};

export default DeleteButton;
