"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    async function signOutAndRedirect() {
      try {
        await supabase.auth.signOut();
        router.refresh(); // Update server-rendered content
        router.back(); // Close the modal (or go to previous page)
      } catch (error) {
        console.error("Error signing out:", error);
      }
    }

    signOutAndRedirect();
  }, [router]);

  return <p>Signing you out…</p>;
}
