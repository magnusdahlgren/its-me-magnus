"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    async function signOutAndRedirect() {
      await supabase.auth.signOut();

      // Go back to the previous page in history
      router.back();
    }

    signOutAndRedirect();
  }, [router]);

  return <p>Signing you out…</p>;
}
