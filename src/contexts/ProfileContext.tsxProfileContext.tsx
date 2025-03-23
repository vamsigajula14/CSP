import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface Profile {
  id: string;
  fullName: string;
  email: string;
}

interface ProfileContextType {
  profile: Profile | null;
  fetchProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }
    setProfile(data);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used within a ProfileProvider");
  return context;
};