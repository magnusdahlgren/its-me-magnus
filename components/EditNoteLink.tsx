"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export function EditNoteLink({ noteId }: Readonly<{ noteId: string }>) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) return null;

  return (
    <Link href={`/p/${noteId}/edit`} scroll={false} className="edit-note">
      <span className="icon" aria-hidden="true" />
      <span className="text">Edit note</span>
    </Link>
  );
}
