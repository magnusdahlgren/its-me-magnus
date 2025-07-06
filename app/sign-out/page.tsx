"use client";

import { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    async function signOutAndRedirect() {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error("Error signing out:", error);
      }
      redirect("/p/start");
    }

    signOutAndRedirect();
  }, [router]);

  return <p>Signing you out…</p>;
}
