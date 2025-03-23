import { supabase } from "../supabaseClient";

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, fullName: string) => {
  const { data, error } = await supabase.from("profiles").update({ fullName }).eq("id", userId);
  if (error) throw error;
  return data;
};
