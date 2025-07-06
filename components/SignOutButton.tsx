"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import styles from "./SignOutButton.module.css";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.refresh(); // Update the UI
  }

  return (
    <button onClick={handleSignOut} className={styles.signOutButton}>
      Sign out
    </button>
  );
}
