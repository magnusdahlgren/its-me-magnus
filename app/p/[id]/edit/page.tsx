"use client";

import { useEffect, useState } from "react";
import { NoteForm } from "@/components/NoteForm";
import { supabase } from "@/lib/supabase";
import { getTagsForNote } from "@/lib/tags";
import styles from "@/components/NoteForm.module.css";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function EditNoteModal() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : undefined;
  const [error, setError] = useState<string | null>(null);

  const [initialData, setInitialData] = useState<null | {
    title?: string;
    content?: string;
    image_url?: string;
    image_caption?: string;
    tags: string[];
  }>(null);

  let content: React.ReactNode;

  if (error) {
    content = (
      <div>
        <h3>Error</h3>
        <p>{error}</p>
        <Link href="/p/start">Go back</Link>
      </div>
    );
  } else if (!id) {
    content = (
      <div>
        <h3>Invalid ID</h3>
        <p>Invalid Note ID</p>
        <Link href="/p/start">Go back</Link>
      </div>
    );
  } else if (!initialData) {
    content = <p>Loading…</p>;
  } else {
    content = <NoteForm noteId={id} initialData={initialData} />;
  }

  useEffect(() => {
    if (!id) return;

    async function fetchNoteAndTags() {
      const { data: note, error: noteError } = await supabase
        .from("notes")
        .select("id, title, content, image_url, image_caption")
        .eq("id", id)
        .single();

      if (noteError || !note) {
        console.error("Error fetching note:", noteError);
        setError("Failed to load note");
        return;
      }

      const tags = await getTagsForNote(id);
      const tagIds = tags.map((tag) => tag.id);

      setInitialData({
        title: note.title ?? "",
        content: note.content ?? "",
        image_url: note.image_url ?? "",
        image_caption: note.image_caption ?? "",
        tags: tagIds,
      });
    }

    fetchNoteAndTags();
  }, [id]);

  return (
    <div className={styles.modalBackdrop}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        role="presentation"
        tabIndex={-1}
      >
        {content}
      </div>
    </div>
  );
}
