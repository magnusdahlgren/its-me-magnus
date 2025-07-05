"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { NoteForm } from "@/components/NoteForm";
import { supabase } from "@/lib/supabase";
import { getTagsForNote } from "@/lib/tags";
import styles from "@/components/NoteForm.module.css";

export default function EditNoteModal() {
  const params = useParams();
  const router = useRouter();

  const id = typeof params.id === "string" ? params.id : undefined;

  const [initialData, setInitialData] = useState<null | {
    title?: string;
    content?: string;
    image_url?: string;
    image_caption?: string;
    tags: string[];
  }>(null);

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
        {initialData ? (
          <NoteForm noteId={id!} initialData={initialData} />
        ) : (
          <p>Loading…</p>
        )}
      </div>
    </div>
  );
}
