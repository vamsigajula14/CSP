import { supabase } from "../supabaseClient";

// Fetch votes for a discussion with pagination
export const getVotesByDiscussionId = async (discussionId: string, page: number = 1, limit: number = 10) => {
  console.log("Fetching votes for discussion ID:", discussionId, "Page:", page, "Limit:", limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit - 1;

  try {
    const { data, error } = await supabase
      .from("votes")
      .select("*")
      .eq("discussion_id", discussionId)
      .range(startIndex, endIndex);

    if (error) {
      console.error("Error fetching votes:", error);
      throw error;
    }
    console.log("Fetched votes:", data);
    return data;
  } catch (err) {
    console.error("Unexpected error fetching votes:", err);
    throw err;
  }
};

// Add a vote (like) with user profile validation and duplicate vote prevention
export const addVote = async (discussionId: string, userId: string) => {
  console.log("Adding vote for discussion ID:", discussionId, "by user ID:", userId);

  try {
    // Check if user exists in profiles
    const { data: userProfile, error: userError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (userError || !userProfile) {
      console.log("User profile not found. Creating profile...");
      const { error: createError } = await supabase
        .from("profiles")
        .insert([{ id: userId }]);

      if (createError) {
        console.error("Error creating user profile:", createError);
        throw new Error("Failed to create user profile.");
      }
      console.log("User profile created successfully.");
    } else {
      console.log("User profile validated:", userProfile);
    }

    // Prevent duplicate votes
    const { data: existingVote, error: duplicateError } = await supabase
      .from("votes")
      .select("id")
      .eq("discussion_id", discussionId)
      .eq("user_id", userId)
      .single();

    if (duplicateError && duplicateError.details !== "Row not found") {
      console.error("Error checking for duplicate vote:", duplicateError);
      throw duplicateError;
    }

    if (existingVote) {
      console.log("Duplicate vote detected.");
      throw new Error("You have already voted for this discussion.");
    }

    // Add the vote
    const { data, error } = await supabase
      .from("votes")
      .insert([{ discussion_id: discussionId, user_id: userId }]);

    if (error) {
      console.error("Error adding vote:", error);
      throw error;
    }
    console.log("Vote added successfully:", data);
    return data;
  } catch (err) {
    console.error("Unexpected error adding vote:", err);
    throw err;
  }
};


// Remove a vote (unlike) with validation
export const removeVote = async (voteId: string) => {
  console.log("Removing vote with ID:", voteId);
  try {
    // Validate vote existence
    const { data: vote, error: fetchError } = await supabase
      .from("votes")
      .select("*")
      .eq("id", voteId)
      .single();

    if (fetchError || !vote) {
      console.error("Vote not found:", fetchError || "Vote does not exist.");
      throw new Error("Vote not found. Cannot delete.");
    }

    // Proceed with deletion
    const { error } = await supabase.from("votes").delete().eq("id", voteId);
    if (error) {
      console.error("Error removing vote:", error);
      throw error;
    }
    console.log("Vote removed successfully.");
  } catch (err) {
    console.error("Unexpected error removing vote:", err);
    throw err;
  }
};
