import { supabase } from "./supabase";

export async function isAuthenticated(): Promise<boolean> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Error getting session:", error);
    return false;
  }

  return !!session?.user;
}
