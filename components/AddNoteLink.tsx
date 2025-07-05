"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export function AddNoteLink({ tagId }: Readonly<{ tagId: string }>) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) return null;

  return (
    <Link href={`/p/${tagId}/new`} className="add-note">
      <span>Add note to this tag</span>
    </Link>
  );
}
