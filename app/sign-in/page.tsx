"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { SignInForm } from "@/components/SignInForm";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ptrt = searchParams.get("ptrt");
  const returnTo = ptrt?.startsWith("/") ? ptrt : "/p/start";

  return <SignInForm redirectTo={returnTo} />;
}
