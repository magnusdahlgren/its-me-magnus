"use client";

import { SignInForm } from "@/components/SignInForm";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const ptrt = searchParams.get("ptrt");
  const returnTo = ptrt?.startsWith("/") ? ptrt : "/p/start";

  return <SignInForm redirectTo={returnTo} />;
}
